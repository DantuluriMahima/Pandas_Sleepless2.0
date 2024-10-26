const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db'); 
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

connectDB();

const medicineRoute =require('./routes/medicinedb');
const pendingRoute =require('./routes/pendingdb');
const loginRoute =require('./routes/loginroute');

app.use('/api/medicinedb', medicineRoute);
app.use('/api/pendingdb', pendingRoute);
app.use('/api/login', loginRoute);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
