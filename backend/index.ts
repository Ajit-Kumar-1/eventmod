import express from 'express';
import Routes from './api/index.ts';
import cron from 'node-cron';
import type { Route } from './Types.ts';
import resetExpired from './api/ResetExpiredHandler.ts';
const app = express()
const port = 3000

app.use(express.json())

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

Routes.forEach((route: Route) => app[route.method](route.path, route.handler));

cron.schedule('*/1 * * * *', resetExpired);

app.listen(port, () => {
  console.log(`Moderation platform backend listening on port ${port}`)
})
