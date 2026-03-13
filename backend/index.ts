import express from 'express';
const app = express()
import fs from 'fs';
const port = 3000

app.use(express.json())

app.post('/login', (req, res) => {
  const { user_id, region } = req.body;

  fs.readFile('./data/users.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to load users data' });
    }

    const users = JSON.parse(data);
    const user = users.find((u: any) => u.user_id === user_id && u.region === region);

    if (user) {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  });
})

app.get('/events', (req, res) => {
  fs.readFile('./data/events.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to load events data' });
    }

    const events = JSON.parse(data);
    res.json(events);
  });
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
