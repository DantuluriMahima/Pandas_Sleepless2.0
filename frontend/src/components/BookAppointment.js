import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownButton, Badge, Image } from 'react-bootstrap';
import axios from 'axios';
import '../styles/User.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const BookAppointment = () => {
    // State for appointments and traffic level
    const [appointments, setAppointments] = useState([]);
    const [trafficLevel, setTrafficLevel] = useState('Low');
    const [profile, setProfile] = useState([]);

    // State for booking appointments
    const [schedule, setSchedule] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');

    useEffect(() => {
        // Fetch user profile
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/api/user/profile', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch profile data');
                }
                const profileData = await response.json();
                setProfile(profileData);
            } catch (error) {
                console.error('Error fetching profile:', error.message);
            }
        };

        // Fetch appointments
        const fetchAppointments = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/appointments');
                const data = await response.json();
                const userAppointments = data.filter(
                    (appointment) => appointment.roll === profile.roll
                );
                setAppointments(userAppointments);
                calculateTrafficLevel(data);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        // Calculate traffic level
        const calculateTrafficLevel = (appointments) => {
            const currentHour = new Date().getHours();
            const hourCount = appointments.filter((appointment) => {
                const appointmentHour = new Date(`1970-01-01T${appointment.timeSlot}`).getHours();
                return appointmentHour === currentHour;
            }).length;

            if (hourCount > 10) {
                setTrafficLevel('High');
            } else if (hourCount >= 5) {
                setTrafficLevel('Medium');
            } else {
                setTrafficLevel('Low');
            }
        };

        //fetchProfile();
        //fetchAppointments();
    }, [profile.roll]);

    // Fetch schedule data for booking appointments
    const fetchScheduleData = async () => {
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
        fetchScheduleData();
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

    const handleDelete = async (email, timeSlot) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/${encodeURIComponent(email)}/${encodeURIComponent(timeSlot)}`);
            //fetchAppointments();
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    return (
        <section id="userhome">
            <header id="header" className="header fixed-top d-flex align-items-center">
        <div className="container-fluid container-xl d-flex align-items-center justify-content-between" >
            <div className="logo d-flex align-items-start">
              <img src="/static/logo.svg.png" alt="IIT Dharwad Logo" />
              <h1 style={{ marginLeft: "10px" }}>IIT Dharwad</h1>
            </div>
            <div className="link-container">
                    <Link to="/UserPage" className="custom-link">Home</Link>
                    <span className="separator"> | </span>
                    <Link to="/UserPage/appointment" className="custom-link">My Appointments</Link>
                    <span className="separator"> | </span>
                    <Link to="/UserPage/Bookappointment" className="custom-link">Book Appointment</Link>
                    
                  </div>
           </div>
        <nav className="header-nav ms-auto">
      <ul className="d-flex align-items-center list-unstyled m-4">
        <li className="nav-item dropdown">
          <DropdownButton
            menuAlign="right"
            title={
              <span className="nav-link nav-profile d-flex align-items-center pe-0">
                <button 
          className="btn d-flex align-items-center" 
          style={{ 
            border: 'none', 
            backgroundColor: 'green', 
            color: 'white', 
            borderRadius: '5px', // Make it circular
            padding: '5px' // Adjust padding as needed
          }}
        >
          <Image
            src="../../img/profile.png"
            alt="Profile"
            className="rounded-circle me-2"
            style={{ width: '30px', height: '30px' }} // Adjust size of the image
          />
          <span className="d-none d-md-block">User</span>
        </button>
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
        </header>
            <div className="container">
                <h1>Appointments</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li><Link to="/UserPage" className="custom-link">Home</Link></li>
                    </ol>
                </nav>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px',background: 'linear-gradient(rgba(14, 29, 52, 0.86), rgba(14, 29, 52, 0.493))',
        backgroundPosition: 'center center',
        backgroundSize: 'cover', // Adjust as needed
        backgroundRepeat: 'no-repeat'  }}>
    <div>
        <h2 style={{color:'white'}}>Book an Appointment</h2>
        <form
            id="appointmentForm"
            onSubmit={handleSubmit}
            style={{
                maxWidth: '500px',
                margin: '0 auto',
                padding: '20px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                backgroundColor: '#f9f9f9',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <label htmlFor="date">Date:</label>
            <select
                id="date"
                onChange={handleDateChange}
                required
                style={{ marginBottom: '15px', width: '100%' }}
            >
                <option value="">Select a Date</option>
                {dates.map((date1, index) => (
                    <option key={index} value={date1}>
                        {date1}
                    </option>
                ))}
            </select>

            <label htmlFor="time">Time:</label>
            <select id="time" required style={{ marginBottom: '15px', width: '100%' }}>
                <option value="">Select a Time Slot</option>
                {timeSlots.map((slot, index) => (
                    <option key={index} value={slot}>
                        {slot}
                    </option>
                ))}
            </select>

            <label htmlFor="doctorId">Doctor:</label>
            <select id="doctorId" onChange={handleDoctorChange} required style={{ marginBottom: '15px', width: '100%' }}>
                <option value="">Select a Doctor</option>
                {filteredDoctors.map((doctor, index) => (
                    <option key={index} value={doctor}>
                        {doctor}
                    </option>
                ))}
            </select>

            <label htmlFor="patientId">Patient Email:</label>
            <input
                type="email"
                id="patientId"
                required
                style={{ marginBottom: '15px', width: '100%' }}
            />

            <button
                type="submit"
                style={{
                    alignSelf: 'center',
                    padding: '10px 20px',
                    border: 'none',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    fontSize: '16px',
                    cursor: 'pointer',
                    borderRadius: '5px',
                    transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = '#45a049')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = '#4CAF50')}
            >
                Book Appointment
            </button>
        </form>
    </div>
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

export default BookAppointment;
