// src/components/User.js
import React from 'react';
import '../styles/User.css';

function User() {
    return (
        <section id="userhome">
        <div className="container">
            <h2>Book an Appointment</h2>
            <form id="appointmentForm">
                <label htmlFor="date">Date:</label>
                <input type="date" id="date" required />
                
                <label htmlFor="time">Time:</label>
                <input type="time" id="time" required />
                
                <label htmlFor="doctorId">Doctor:</label>
                <select id="doctorId" required>
                    {Array.from({ length: 10 }, (_, i) => (
                        <option key={i} value={`doctor${i + 1}`}>
                            Doctor {i + 1}
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
    </section>
    );
}

export default User;
