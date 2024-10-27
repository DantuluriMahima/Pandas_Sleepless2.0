import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../styles/User.css';

const BookAppointment = () => {
    const [schedule, setSchedule] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/schedule');
            const data = response.ok ? await response.json() : [];
            const formattedData = data.slice(2).map(row => ({
                siNo: row[0],
                name: row[1],
                qualification: row[2],
                specialization: row[3],
                date: row[4],
                time: row[5]
            }));

            setSchedule(formattedData);

            const doctorNames = formattedData
                .filter(row => row.name && row.name !== 'Doctor Unavailable Today')
                .map(row => row.name);
            setDoctors([...new Set(doctorNames)]);

            const uniqueDates = formattedData
                .filter(row => row.date)
                .map(row => row.date);
            setDates([...new Set(uniqueDates)]);
        } catch (error) {
            console.error('Error fetching schedule:', error);
            setSchedule([]);
            setDoctors([]);
            setDates([]);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const availableDoctors = schedule
            .filter(row => row.date === selectedDate)
            .map(row => row.name);
        setFilteredDoctors([...new Set(availableDoctors)]);
    }, [selectedDate, schedule]);

    useEffect(() => {
        if (selectedDate && selectedDoctor) {
            const selectedDoctorData = schedule.find(row => row.name === selectedDoctor && row.date === selectedDate);
            if (selectedDoctorData) {
                generateTimeSlots(selectedDoctorData);
            }
        }
    }, [selectedDoctor, selectedDate, schedule]);

    const generateTimeSlots = (doctorData) => {
        const timeRange = doctorData.time;
        if (!timeRange || !timeRange.includes("-")) return;

        const [startTime, endTime] = timeRange.split("-").map(time => time.trim());
        const start = new Date(`1970-01-01T${startTime.padStart(5, "0")}:00`);
        const end = new Date(`1970-01-01T${endTime.padStart(5, "0")}:00`);
        const slots = [];
        const slotDuration = doctorData.specialization === 'General Physician' ? 10 : 15;

        for (let time = new Date(start); time < end; time.setMinutes(time.getMinutes() + slotDuration)) {
            slots.push(time.toTimeString().slice(0, 5));
        }
        setTimeSlots(slots);
    };

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
        setSelectedDoctor('');
        setTimeSlots([]);
    };

    const handleDoctorChange = (event) => {
        setSelectedDoctor(event.target.value);
        setTimeSlots([]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const email = document.getElementById('patientId').value;
        const doctorName = selectedDoctor;
        const date = selectedDate;
        const timeSlot = document.getElementById('time').value;

        if (!email || !doctorName || !date || !timeSlot) {
            alert("Please fill in all required fields.");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/book-appointment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, doctorName, date, timeSlot }),
            });
            const result = await response.json();
            alert(result.message || "Booking successful.");
        } catch (error) {
            alert("An error occurred. Please check your network and try again.");
        }
    };

    return (
        <div className="container">
            <h2>Book an Appointment</h2>
            <form id="appointmentForm" onSubmit={handleSubmit}>
                <label htmlFor="date">Date:</label>
                <select id="date" onChange={handleDateChange} required>
                    <option value="">Select a Date</option>
                    {dates.map((date1, index) => (
                        <option key={index} value={date1}>
                            {date1}
                        </option>
                    ))}
                </select>
                
                <label htmlFor="time">Time:</label>
                <select id="time" required>
                    <option value="">Select a Time Slot</option>
                    {timeSlots.map((slot, index) => (
                        <option key={index} value={slot}>
                            {slot}
                        </option>
                    ))}
                </select>
                
                <label htmlFor="doctorId">Doctor:</label>
                <select id="doctorId" onChange={handleDoctorChange} required>
                    <option value="">Select a Doctor</option>
                    {filteredDoctors.map((doctor, index) => (
                        <option key={index} value={doctor}>
                            {doctor}
                        </option>
                    ))}
                </select>
                
                <label htmlFor="patientId">Patient Email:</label>
                <input type="email" id="patientId" required />
                
                <button type="submit">Book Appointment</button>
            </form>
        </div>
    );
};

export default BookAppointment;
