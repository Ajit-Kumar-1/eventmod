import express from 'express';
import { loginRoute, eventsRoute, claimRoute } from './api/index.ts';
const app = express()
const port = 3000

app.use(express.json())

app.post(loginRoute.path, loginRoute.handler)
app.get(eventsRoute.path, eventsRoute.handler)
app.put(claimRoute.path, claimRoute.handler)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
