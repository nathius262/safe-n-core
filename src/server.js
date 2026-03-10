import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app.js";
import pkg from "./models/index.cjs";
import { init_websocket } from "./websocket/websocket.server.js";

const { sequelize } = pkg;

const PORT = process.env.PORT || 3000;

(async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connected successfully");

        const server = http.createServer(app);

        // initialize websocket
        init_websocket(server);

        server.listen(PORT, () =>
            console.log(`Server running on port ${PORT}`)
        );

    } catch (err) {
        console.error("Database connection failed:", err);
        process.exit(1);
    }
})();