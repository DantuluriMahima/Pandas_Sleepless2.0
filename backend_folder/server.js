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
app.use('/api/register', loginRoute);

const mongoose = require('mongoose');
const { google } = require('googleapis');

app.use(cors());
app.use(express.json()); // To parse JSON bodies


// Define a schema and model for appointments
const appointmentSchema = new mongoose.Schema({
    email: String,
    doctorName: String,
    timeSlot: String,
    date: String,
});
const Appointment = mongoose.model('Appointment', appointmentSchema);

// Google Sheets API Setup
const SERVICE_ACCOUNT_FILE = './rising-woods-439809-h3-0f3c2612b9c1.json';
const SPREADSHEET_ID = '1zouIz0bX8YG-UVBTwXXTreddsyR29TTPQL5pczmFKnw';
const RANGE = 'Sheet1!A1:F10';
const sheets = google.sheets('v4');
const auth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_FILE,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Endpoint to fetch schedule data from Google Sheets
app.get('/api/schedule', async (req, res) => {
    try {
        const authClient = await auth.getClient();
        const response = await sheets.spreadsheets.values.get({
            auth: authClient,
            spreadsheetId: SPREADSHEET_ID,
            range: RANGE,
        });
        res.json(response.data.values);
    } catch (error) {
        console.error('Error fetching data from Google Sheets:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});
app.get('/api/appointments', async (req, res) => {
    try {
        const appointments = await Appointment.find(); 
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});
app.get('/api/userappointments', async (req, res) => {
    const { email } = req.query; // Extract email from query parameters

    try {
        // If email is provided, filter appointments by email; otherwise, return all appointments
        const appointments = email
            ? await Appointment.find({ email })
            : await Appointment.find();
        
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});


app.post('/api/book-appointment', async (req, res) => {
  const { email, doctorName, timeSlot, date } = req.body;

  try {
      // Check if an appointment with the same doctor, date, and email already exists
      const existingAppointmentForUser = await Appointment.findOne({
          email: email,
          doctorName: doctorName,
          date: date,
      });

      if (existingAppointmentForUser) {
          return res.status(400).json({ error: 'You already have an appointment with this doctor on this date.' });
      }

      // Check if an appointment with the same doctor, date, and time slot exists for any user
      const existingAppointmentForSlot = await Appointment.findOne({
          doctorName: doctorName,
          date: date,
          timeSlot: timeSlot,
      });

      if (existingAppointmentForSlot) {
          return res.status(400).json({ error: 'This time slot is already booked for the selected doctor.' });
      }

      // If no conflicting appointments, create a new appointment
      const newAppointment = new Appointment({
          email,
          doctorName,
          date,
          timeSlot,
      });

      await newAppointment.save();
      res.status(201).json({ message: 'Appointment booked successfully' });
  } catch (error) {
      console.error('Error saving appointment:', error);
      res.status(500).json({ error: 'Failed to book appointment' });
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
