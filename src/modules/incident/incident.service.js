import * as repo from "./incident.repository.js";

export const triggerSOS = async (user_id) => {
    return repo.createIncident({
        user_id,
        status: "ACTIVE"
    });
};

export const streamLocation = async (incident_id, payload) => {
    const incident = await repo.findIncidentById(incident_id);

    if (!incident || incident.status !== "ACTIVE") {
        throw {
            status_code: 400,
            message: "Incident not active",
            code: "INVALID_INCIDENT"
        };
    }

    return repo.addLocation({
        incident_id,
        latitude: payload.latitude,
        longitude: payload.longitude,
        accuracy: payload.accuracy
    });
};

export const resolveIncident = async (incident_id) => {
    const incident = await repo.findIncidentById(incident_id);
    if (!incident) {
        throw {
            status_code: 404,
            message: "Incident not found",
            code: "NOT_FOUND"
        };
    }

    return repo.updateIncidentStatus(incident, "RESOLVED");
};