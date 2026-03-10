import pkg from "../../models/index.cjs";
import { AppError } from "../../utils/app_error.js";
import { broadcast_location_update, broadcast_incident_resolved, broadcast_incident_created } from "../../websocket/websocket.broadcast.js";

const { Incident, IncidentLocation, sequelize } = pkg;

/**
 * Trigger SOS (Idempotent + Location Capture)
 */
export const trigger_sos_service = async (user, payload) => {
    const { location } = payload;

    if (!location?.latitude || !location?.longitude) {
        throw new AppError(
            "Location is required",
            400,
            "LOCATION_REQUIRED"
        );
    }

    const transaction = await sequelize.transaction();

    try {

        // 1️⃣ Check existing ACTIVE incident
        const existing = await Incident.findOne({
            where: {
                user_id: user.id,
                status: "ACTIVE"
            },
            transaction
        });

        if (existing) {
            await transaction.commit();
            return {
                incident_id: existing.id,
                status: existing.status,
                tracking_required: true,
                is_existing: true
            };
        }

        // 2️⃣ Create Incident
        const incident = await Incident.create(
            {
                user_id: user.id,
                status: "ACTIVE",
                started_at: new Date()
            },
            { transaction }
        );

        // 3️⃣ Create Initial Location Record
        await IncidentLocation.create(
            {
                incident_id: incident.id,
                latitude: location.latitude,
                longitude: location.longitude,
                accuracy: location.accuracy || null,
                recorded_at: new Date()
            },
            { transaction }
        );

        await transaction.commit();

        broadcast_incident_created({
            incident_id: incident.id,
            user_id: user.id,
            status: incident.status,
            started_at: incident.started_at
        });

        return {
            incident_id: incident.id,
            status: incident.status,
            tracking_required: true,
            is_existing: false
        };

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};


/**
 * Resolve Incident
 */
export const resolve_incident_service = async (incident_id, user) => {

    const incident = await Incident.findByPk(incident_id);

    if (!incident) {
        throw new AppError("Incident not found", 404, "INCIDENT_NOT_FOUND");
    }

    if (incident.status !== "ACTIVE") {
        throw new AppError("Incident is not active", 400, "INCIDENT_NOT_ACTIVE");
    }

    // 🔒 Ownership / Role Check
    if (user.role === "USER" && incident.user_id !== user.id) {
        throw new AppError("Forbidden", 403, "FORBIDDEN");
    }

    await incident.update({
        status: "RESOLVED",
        resolved_at: new Date()
    });

    broadcast_incident_resolved({
        incident_id: incident.id,
        status: "RESOLVED",
        resolved_at: new Date()
    });

    return {
        incident_id: incident.id,
        status: "RESOLVED"
    };
};


/**
 * Cancel Incident
 */
export const cancel_incident_service = async (incident_id, user) => {

    const incident = await Incident.findByPk(incident_id);

    if (!incident) {
        throw new AppError("Incident not found", 404, "INCIDENT_NOT_FOUND");
    }

    if (incident.status !== "ACTIVE") {
        throw new AppError("Incident is not active", 400, "INCIDENT_NOT_ACTIVE");
    }

    if (incident.user_id !== user.id) {
        throw new AppError("Forbidden", 403, "FORBIDDEN");
    }

    await incident.update({
        status: "CANCELLED",
        resolved_at: new Date()
    });

    return {
        incident_id: incident.id,
        status: "CANCELLED"
    };
};

/**
 * Add Location Update (Real-Time Tracking)
 */
export const add_incident_location_service = async (
    incident_id,
    user,
    payload
) => {
    const { location } = payload;

    if (!location?.latitude || !location?.longitude) {
        throw new AppError(
            "Location is required",
            400,
            "LOCATION_REQUIRED"
        );
    }

    const incident = await Incident.findByPk(incident_id);

    if (!incident) {
        throw new AppError("Incident not found", 404, "INCIDENT_NOT_FOUND");
    }

    if (incident.status !== "ACTIVE") {
        throw new AppError("Incident is not active", 400, "INCIDENT_NOT_ACTIVE");
    }

    // USER can only update their own incident
    if (user.role === "USER" && incident.user_id !== user.id) {
        throw new AppError("Forbidden", 403, "FORBIDDEN");
    }

    await IncidentLocation.create({
        incident_id,
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy || null,
        recorded_at: new Date()
    });

    broadcast_location_update({
        incident_id,
        latitude: location.latitude,
        longitude: location.longitude,
        recorded_at: new Date()
    });

    return {
        incident_id,
        location_recorded: true
    };
};

/**
 * Get Incidents (Operator View)
 */
export const get_incidents_service = async (query) => {

    const { status } = query;

    const where = {};
    if (status) where.status = status;

    const incidents = await Incident.findAll({
        where,
        order: [["created_at", "DESC"]]
    });

    return incidents;
};

/**
 * Get Incident Details
 */
export const get_incident_by_id_service = async (incident_id) => {

    const incident = await Incident.findByPk(incident_id, {
        include: [
            {
                model: IncidentLocation,
                as: "locations",
                order: [["recorded_at", "ASC"]]
            }
        ]
    });

    if (!incident) {
        throw new AppError("Incident not found", 404, "INCIDENT_NOT_FOUND");
    }

    return incident;
};
