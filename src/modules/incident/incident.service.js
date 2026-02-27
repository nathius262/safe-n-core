import pkg from "../../models/index.cjs";
import { AppError } from "../../utils/app_error.js";

const { Incident, sequelize } = pkg;

/**
 * Trigger SOS (Idempotent)
 */
export const trigger_sos_service = async (user) => {
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

        // ✅ Idempotent behavior (retry-safe)
        if (existing) {
            await transaction.commit();
            return {
                incident_id: existing.id,
                status: existing.status,
                tracking_required: true,
                is_existing: true
            };
        }

        // 2️⃣ Create new incident
        const incident = await Incident.create(
            {
                user_id: user.id,
                status: "ACTIVE"
            },
            { transaction }
        );

        await transaction.commit();

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