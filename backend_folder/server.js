const express = require('express');
const app = express();
const PORT = 5000;

app.get('/api', (req, res) => {
  res.send('Hello from the Node server!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
