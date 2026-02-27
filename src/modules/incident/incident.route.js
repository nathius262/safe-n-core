import express from "express";
import {
    trigger_sos,
    resolve_incident,
    cancel_incident
} from "./incident.controller.js";
import { authenticate } from "../../middlewares/auth_middleware.js";

const router = express.Router();

router.post("/sos", authenticate, trigger_sos);

router.patch("/:incident_id/resolve", authenticate, resolve_incident);

router.patch("/:incident_id/cancel", authenticate, cancel_incident);

export default router;