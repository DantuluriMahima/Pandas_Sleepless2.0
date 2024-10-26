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

                <label for="doctorId">Select Doctor:</label>
                <select id="doctorId" required>
                    <option value="">Choose a doctor</option>
                    <option value="1">Dr. Smith</option>
                    <option value="2">Dr. Johnson</option>
                    <option value="3">Dr. Brown</option>
                    <option value="4">Dr. Williams</option>
                    <option value="5">Dr. Jones</option>
                    <option value="6">Dr. Garcia</option>
                    <option value="7">Dr. Martinez</option>
                    <option value="8">Dr. Davis</option>
                    <option value="9">Dr. Rodriguez</option>
                    <option value="10">Dr. Lopez</option>
                </select>

                <label for="patientId">Patient Email:</label>
                <input type="email" id="patientId" required />

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
