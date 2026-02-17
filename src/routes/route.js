import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const modules_path = path.join(process.cwd(), 'src/modules');

fs.readdirSync(modules_path).forEach(async (module_name) => {
    const route_file = path.join(modules_path, module_name, `${module_name}.route.js`);
    if (fs.existsSync(route_file)) {
        const module_routes = await import(route_file);
        router.use(`/${module_name}`, module_routes.default);
    }
});

export default router;
