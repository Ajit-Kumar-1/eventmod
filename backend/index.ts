import express from 'express';
import { loginRoute, eventsRoute } from './api/index.ts';
const app = express()
const port = 3000

app.use(express.json())

app.post(loginRoute.path, loginRoute.handler)
app.get(eventsRoute.path, eventsRoute.handler)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
