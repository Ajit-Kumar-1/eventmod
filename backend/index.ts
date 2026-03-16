import express from 'express';
import Routes from './src/api/index.ts';
import cron from 'node-cron';
import type { Route } from './src/Types.ts';
import resetExpired from './src/cron/ResetExpiredHandler.ts';
import middleware from './src/api/Middleware.ts';

const app = express();
const port = 3000;

app.use(express.json());
app.use(middleware);
Routes.forEach((route: Route) => app[route.method](route.path, route.handler));

cron.schedule('*/1 * * * *', resetExpired);

app.listen(port, () => console.log(`Backend listening on port ${port}`));
