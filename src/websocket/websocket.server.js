import { WebSocketServer } from "ws";
import { register_client, remove_client } from "./websocket.registry.js";

let wss;

export const init_websocket = (server) => {

    wss = new WebSocketServer({ server });

    wss.on("connection", (ws) => {

        console.log("WebSocket client connected");

        register_client(ws);

        ws.on("close", () => {
            remove_client(ws);
            console.log("WebSocket client disconnected");
        });

    });

};

export const get_websocket_server = () => wss;