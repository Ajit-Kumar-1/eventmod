const express = require('express')
const app = express()
const fs = require('fs');
const port = 3000

app.use(express.json())

const usersFilePath = path.join(__dirname, 'data', 'users.json');

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/')


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
