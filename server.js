import dotenv from 'dotenv';
import app from './src/app.js';
import pkg from './src/models/index.cjs';
const { sequelize } = pkg;

dotenv.config();

const PORT = process.env.PORT || 3000;

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully');

        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    }
})();
