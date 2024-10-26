import React, { useEffect, useState } from 'react';
import '../styles/User.css';

const DoctorSchedule = () => {
    const [schedule, setSchedule] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://localhost:5000/api/schedule');
            const data = await response.json();
            
            // Transform the raw data if it's an array of arrays
            const formattedData = data.slice(2).map(row => ({
                siNo: row[0],
                name: row[1],
                qualification: row[2],
                specialization: row[3],
                date: row[4],
                time: row[5] // Assuming time is a range like "9:00-12:00"
            }));
            
            setSchedule(formattedData);

            // Extract unique doctor names for the dropdown
            const doctorNames = formattedData
                .filter(row => row.name && row.name !== 'Doctor Unavailable Today')
                .map(row => row.name);

            setDoctors([...new Set(doctorNames)]); // Remove duplicates

            const uniqueDates = formattedData
                .filter(row => row.date)
                .map(row => row.date);

            setDates([...new Set(uniqueDates)]); // Remove duplicates
        };
        fetchData();
    }, []);

    useEffect(() => {
        // Filter doctors based on the selected date
        const availableDoctors = schedule
            .filter(row => row.date === selectedDate)
            .map(row => row.name);

        setFilteredDoctors([...new Set(availableDoctors)]); // Remove duplicates
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
        const timeRange = doctorData.time; // Example: "1:30-3:00"
        
        // Check if time range exists and is correctly formatted
        if (!timeRange || !timeRange.includes("-")) {
            console.error("Invalid time range:", timeRange);
            return;
        }
    
        const [startTime, endTime] = timeRange.split("-").map(time => time.trim());
    
        // Parse start and end times
        const start = new Date(`1970-01-01T${startTime.padStart(5, "0")}:00`); // Add leading zero if needed
        const end = new Date(`1970-01-01T${endTime.padStart(5, "0")}:00`);
        
        // Check if start and end are valid
        if (isNaN(start) || isNaN(end)) {
            console.error("Invalid start or end time:", start, end);
            return;
        }
        
        const slots = [];
        const slotDuration = doctorData.specialization === 'General Physician' ? 10 : 15; // Minutes
    
        // Generate slots
        for (let time = new Date(start); time < end; time.setMinutes(time.getMinutes() + slotDuration)) {
            const slotTime = time.toTimeString().slice(0, 5); // HH:MM format
            slots.push(slotTime);
        }
    
        // Check if slots were created successfully
        if (slots.length === 0) {
            console.warn("No slots generated for time range:", timeRange);
        } else {
            console.log("Generated slots:", slots); // Debugging
        }
    
        setTimeSlots(slots);
    };
    
    

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
        setSelectedDoctor(''); // Reset doctor selection when date changes
        setTimeSlots([]); // Reset time slots
    };

    const handleDoctorChange = (event) => {
        setSelectedDoctor(event.target.value);
        setTimeSlots([]); // Reset time slots when doctor changes
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const email = document.getElementById('patientId').value;
        const doctorName = selectedDoctor;
        const date = selectedDate;
        const timeSlot = document.getElementById('time').value;
    
        // Check if all fields are provided
        if (!email || !doctorName || !date || !timeSlot) {
            console.error("All fields are required.");
            alert("Please fill in all required fields.");
            return;
        }
    
        console.log("Form submitted", { email, doctorName, date, timeSlot });
    
        try {
            const response = await fetch('http://localhost:5000/api/book-appointment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    doctorName,
                    date,
                    timeSlot,
                }),
            });
    
            const result = await response.json();
    
            if (response.ok) {
                alert(result.message);
            } else {
                console.error("Error from server:", result.error);
                alert(result.error || "An error occurred. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("An error occurred. Please check your network and try again.");
        }
    };
    
    
    return (
        <section id="userhome">
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
                <h2>Cancel Medicine</h2>
                <form id="cancelForm">
                    <label htmlFor="medicineId">Medicine ID:</label>
                    <input type="text" id="medicineId" required />
                    <button type="submit">Cancel Medicine</button>
                </form>
            </div>
        
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>SI No</th>
                            <th>Name of Doctor</th>
                            <th>Qualification</th>
                            <th>Specialization</th>
                            <th>Date</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedule.map((row, index) => (
                            <tr key={index}>
                                <td>{row.siNo}</td>
                                <td>{row.name}</td>
                                <td>{row.qualification}</td>
                                <td>{row.specialization}</td>
                                <td>{row.date}</td>
                                <td>{row.time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    
    );
};

export default DoctorSchedule;
