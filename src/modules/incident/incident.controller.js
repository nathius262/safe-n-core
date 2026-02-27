import { async_handler } from "../../utils/async_handler.js";
import { success_response } from "../../utils/response_formatter.js";
import {
    trigger_sos_service,
    resolve_incident_service,
    cancel_incident_service
} from "./incident.service.js";

/**
 * POST /api/incidents/sos
 */
export const trigger_sos = async_handler(async (req, res) => {

    console.log('user', req.user)

    const result = await trigger_sos_service(req.user);

    return success_response(res, {
        status_code: result.is_existing ? 200 : 201,
        message: result.is_existing
            ? "Active incident already exists"
            : "SOS triggered successfully",
        data: result
    });
});


/**
 * PATCH /api/incidents/:incident_id/resolve
 */
export const resolve_incident = async_handler(async (req, res) => {

    const result = await resolve_incident_service(
        req.params.incident_id,
        req.user
    );

    return success_response(res, {
        message: "Incident resolved successfully",
        data: result
    });
});


/**
 * PATCH /api/incidents/:incident_id/cancel
 */
export const cancel_incident = async_handler(async (req, res) => {

    const result = await cancel_incident_service(
        req.params.incident_id,
        req.user
    );

    return success_response(res, {
        message: "Incident cancelled successfully",
        data: result
    });
});