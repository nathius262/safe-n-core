import { success_response } from "../../utils/response_formatter.js";
import * as service from "./incident.service.js";

export const triggerSOS = async (req, res, next) => {
    try {
        const incident = await service.triggerSOS(req.user.id);

        return success_response(res, {
            message: "SOS triggered",
            data: incident
        });
    } catch (error) {
        next(error);
    }
};

export const addLocation = async (req, res, next) => {
    try {
        await service.streamLocation(req.params.id, req.body);

        return success_response(res, {
            message: "Location recorded"
        });
    } catch (error) {
        next(error);
    }
};

export const resolveIncident = async (req, res, next) => {
    try {
        const result = await service.resolveIncident(req.params.id);

        return success_response(res, {
            message: "Incident resolved",
            data: result
        });
    } catch (error) {
        next(error);
    }
};