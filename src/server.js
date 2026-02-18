import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import pkg from "./models/index.cjs";

const { sequelize } = pkg;

const PORT = process.env.PORT || 3000;

(async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connected successfully");

        app.listen(PORT, () =>
            console.log(`Server running on port ${PORT}`)
        );
    } catch (err) {
        console.error("Database connection failed:", err);
        process.exit(1);
    }
})();
