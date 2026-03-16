import express from 'express';
import routes from './api/index.ts';
import middleware from './api/Middleware.ts';
import type { Route } from './Types.ts';

export default function createApp() {
  const app = express();
  app.use(express.json());
  app.use(middleware);
  routes.forEach((route: Route) => {
    app[route.method](route.path, route.handler);
  });
  return app;
}
