import pkg from "../../models/index.cjs";

const { Incident, IncidentLocation } = pkg;

export const createIncident = (data) => {
    return Incident.create(data);
};

export const findActiveIncidents = () => {
    return Incident.findAll({
        where: { status: "ACTIVE" }
    });
};

export const findIncidentById = (id) => {
    return Incident.findByPk(id);
};

export const updateIncidentStatus = (incident, status) => {
    return incident.update({
        status,
        resolved_at: status === "RESOLVED" ? new Date() : null
    });
};

export const addLocation = (data) => {
    return IncidentLocation.create(data);
};

export const getLocations = (incident_id) => {
    return IncidentLocation.findAll({
        where: { incident_id },
        order: [["recorded_at", "ASC"]]
    });
};