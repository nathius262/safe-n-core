import { get_clients } from "./websocket.registry.js";

const send = (type, payload) => {

    const message = JSON.stringify({
        type,
        data: payload
    });

    for (const client of get_clients()) {
        if (client.readyState === 1) {
            client.send(message);
        }
    }
};

export const broadcast_location_update = (payload) => {
    send("LOCATION_UPDATE", payload);
};

export const broadcast_incident_created = (payload) => {
    send("INCIDENT_CREATED", payload);
};

export const broadcast_incident_resolved = (payload) => {
    send("INCIDENT_RESOLVED", payload);
};
