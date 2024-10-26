// src/components/user.js

export function renderUI() {
    document.body.innerHTML = `
        <div style="padding: 20px;">
            <h2>Book an Appointment</h2>
            <form id="appointmentForm">
                <label for="date">Date:</label>
                <input type="date" id="date" required />
                <label for="time">Time:</label>
                <input type="time" id="time" required />
                <label for="doctorId">Doctor ID:</label>
                <input type="text" id="doctorId" required />
                <label for="patientId">Patient ID:</label>
                <input type="text" id="patientId" required />
                <button type="submit">Book Appointment</button>
            </form>

            <h2>Cancel Medicine</h2>
            <form id="cancelForm">
                <label for="medicineId">Medicine ID:</label>
                <input type="text" id="medicineId" required />
                <button type="submit">Cancel Medicine</button>
            </form>
        </div>
    `;

    // Event listeners (same as before)
}
