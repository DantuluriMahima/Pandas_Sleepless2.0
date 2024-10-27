import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Dropdown, DropdownButton, Badge, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/User.css';

const DoctorSchedule = () => {
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
        const data = response.ok ? await response.json() : []; // Use empty array if fetch fails

        // Transform the raw data if it's an array of arrays
        const formattedData = data.slice(2).map(row => ({
            siNo: row[0],
            name: row[1],
            qualification: row[2],
            specialization: row[3],
            date: row[4],
            time: row[5]
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
    } catch (error) {
        console.error('Error fetching schedule:', error);
        setSchedule([]); // Ensure schedule is empty on error
        setDoctors([]); // Reset doctors
        setDates([]); // Reset dates
    }
};
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
            <header id="header" className="header fixed-top d-flex align-items-center">
        <div className="container-fluid container-xl d-flex align-items-center justify-content-between" >
            <div className="logo d-flex align-items-center">
              <img src="/static/logo.svg.png" alt="IIT Dharwad Logo" />
              <h1>IIT Dharwad</h1>
            </div>
            <div className="link-container">
                    <Link to="/admin" className="custom-link">Home</Link>
                    <span className="separator"> | </span>
                    <Link to="/admin/medicine" className="custom-link">Medicines</Link>
                    <span className="separator"> | </span>
                    <Link to="/admin/pendingmeds" className="custom-link">Pending Medicines</Link>
                    <span className="separator"> | </span>
                    <Link to="/admin/appointment" className="custom-link">Appointments</Link>
                    
                  </div>
           </div>
        <nav className="header-nav ms-auto">
      <ul className="d-flex align-items-center list-unstyled m-4">
        <li className="nav-item dropdown">
          <DropdownButton
            menuAlign="right"
            title={
              <span className="nav-link nav-profile d-flex align-items-center pe-0">
                <Image
                  src="/static/adminpage/profile.png"
                  alt="Profile"
                  className="rounded-circle me-2"
                />
                <span className="d-none d-md-block">
                  User
                </span>
              </span>
            }
            id="dropdown-profile"
          >
            <Dropdown.Header>
              <h6>User</h6>
            </Dropdown.Header>
            <Dropdown.Divider />
            <Dropdown.Item>
              <Link className="dropdown-item d-flex align-items-center" to="/admin/profile">
                <i className="bi bi-person"></i>
                <span>My Profile</span>
              </Link>
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>
              <Link className="dropdown-item d-flex align-items-center" to="/admin/studentprofile">
                <i className="bi bi-gear"></i>
                <span>Account Settings</span>
              </Link>
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>
              <Link className="dropdown-item d-flex align-items-center" to="/Login">
                <i className="bi bi-box-arrow-right"></i>
                <span>Sign Out</span>
              </Link>
            </Dropdown.Item>
          </DropdownButton>
        </li>
      </ul>
    </nav>
           <i className="bi bi-list toggle-sidebar-btn"></i>
        </header>
        
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
                    <a href="https://docs.google.com/spreadsheets/d/1zouIz0bX8YG-UVBTwXXTreddsyR29TTPQL5pczmFKnw/edit?gid=0#gid=0"><em>Sheet link</em></a>
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
            <footer id="footer" className="footer" style={{ width: '100%' }}>

            <div className="container">
            <div className="row gy-3">
                <div className="col-lg-3 col-md-12 footer-info">
                <div className="logos">
                <img src="/static/logo.svg.png" alt="Logo" className="logo" />
                </div>
                <h3>Indian Institute of Technology Dharwad</h3>
                <p>Permanent Campus</p>
                <p>Chikkamalligawad Village</p>
                <p>Dharwad, Karnataka, India - 580007</p>
                <p>Email: <a href="mailto:pro@iitdh.ac.in">pro@iitdh.ac.in</a></p>
                </div>

                <div className="col-lg-2 col-6 footer-links">
                <h4>Academics</h4>
                    <ul>
                        <li><a href="#">Admissions</a></li>
                        <li><a href="#">Announcements</a></li>
                        <li><a href="#">Departments</a></li>
                        <li><a href="#">Programs</a></li>
                    </ul>
                </div>

                <div className="col-lg-2 col-6 footer-links">
                <h4>Research</h4>
                    <ul>
                        <li><a href="#">Consultancy Projects</a></li>
                        <li><a href="#">IRINS</a></li>
                        <li><a href="#">Project Vacancies</a></li>
                        <li><a href="#">Publications</a></li>
                        <li><a href="#">Sponsored Projects</a></li>
                    </ul>
                </div>

                <div className="col-lg-2 col-6 footer-links">
                <h4>People</h4>
                    <ul>
                        <li><a href="#">Administration</a></li>
                        <li><a href="#">Faculty</a></li>
                        <li><a href="#">Staff</a></li>
                        <li><a href="#">Students</a></li>
                    </ul>
                </div>

                <div className="col-lg-2 col-6 footer-links">
                <h4>Quick Access</h4>
                    <ul>
                    <li><a href="#">About Dharwad</a></li>
                        <li><a href="#">Bus Schedule</a></li>
                        <li><a href="#">Chief Vigilance Officer</a></li>
                        <li><a href="#">Contact Us</a></li>
                        <li><a href="#">Counselling Center</a></li>
                        <li><a href="#">CSR</a></li>
                        <li><a href="#">Events</a></li>
                        <li><a href="#">Grievance Redressal</a></li>
                        <li><a href="#">ICC</a></li>
                        <li><a href="#">Intranet</a></li>
                        <li><a href="#">Old Website</a></li>
                        <li><a href="#">RTI</a></li>
                        <li><a href="#">SC-ST-OBC Liaison Cell</a></li>
                        <li><a href="#">Tenders</a></li>
                        <li><a href="#">Videos</a></li>
                        <li><a href="#">VPN Access</a></li>
                    </ul>
                </div>

            </div>
            </div>
            
            <div className="footer-legal">
            <div className="container">

                <div className="row justify-content-between">
                <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                    <div className="copyright">
                    © Copyright <strong><span>IIT Dharwad</span></strong>. All Rights Reserved
                    </div>

                    <div className="credits">
                    Designed by Pandas🐼
                    </div>

                </div>

                <div className="col-md-6">
                    <div className="social-links mb-3 mb-lg-0 text-center text-md-end">
                    <a href="#" className="twitter"><i className="bi bi-twitter"></i></a>
                    <a href="#" className="facebook"><i className="bi bi-facebook"></i></a>
                    <a href="#" className="instagram"><i className="bi bi-instagram"></i></a>
                    <a href="#" className="linkedin"><i className="bi bi-linkedin"></i></a>
                    </div>

                </div>

                </div>

            </div>
            </div>
            </footer>
        </section>
    
    );
};

export default DoctorSchedule;
