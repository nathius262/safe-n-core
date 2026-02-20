import { Router } from "express";
import * as controller from "./incident.controller.js";
import { authenticate } from '../../middlewares/auth_middleware.js';

const router = Router();

router.post("/", authenticate, controller.triggerSOS);
router.post("/:id/location", authenticate, controller.addLocation);
router.patch("/:id/resolve", authenticate, controller.resolveIncident);

// router.get("/active", authenticate, controller.getActiveIncidents);
// router.get("/:id", authenticate, controller.getIncidentDetails);
// router.get("/:id/locations", authenticate, controller.getLocations);

export default router;