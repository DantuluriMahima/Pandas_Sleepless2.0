import React, { useEffect, useState } from 'react';
import '../styles/User.css';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


const AppointmentStudent = () => {
    const [appointments, setAppointments] = useState([]);
    const [trafficLevel, setTrafficLevel] = useState('Low');
    useEffect(() => {
        // Fetch the appointments from the API
        const fetchAppointments = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/appointments');
                const data = await response.json();
                const userAppointments = data.filter(
                    (appointment) => appointment.roll === userRoll
                );
                setAppointments(userAppointments);

                // Calculate traffic level based on appointments data
                calculateTrafficLevel(data);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        fetchAppointments();
    }, []);

    const calculateTrafficLevel = (appointments) => {
        const currentHour = new Date().getHours(); // Get the current hour

        // Count appointments for the current hour
        const hourCount = appointments.filter((appointment) => {
            const appointmentHour = new Date(`1970-01-01T${appointment.timeSlot}`).getHours(); // Extract hour from time slot
            return appointmentHour === currentHour;
        }).length;

        // Set traffic level based on the hour count
        if (hourCount > 10) {
            setTrafficLevel('High');
        } else if (hourCount >= 5) {
            setTrafficLevel('Medium');
        } else {
            setTrafficLevel('Low');
        }
    };
    const token = localStorage.getItem('token');
    const [userRoll, setUserRoll] = useState(null);
    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);

            setUserRoll(decodedToken.roll); 
            console.log(userRoll);
        }
    }, [token]);
    
    return (
        <section id="userhome">
            <div className="container">
            <h1>Appointments</h1>
        <nav>
            <ol className="breadcrumb">
            <li><Link to="/admin/medicine" className="custom-link">Home</Link></li>
            </ol>
        </nav>
        </div>
        <div>
            <h2>All Booked Appointments</h2>
            <div>
                <strong>Traffic Level:</strong> {trafficLevel === 'High' && <span style={{ color: 'red' }}>High Traffic</span>}
                {trafficLevel === 'Medium' && <span style={{ color: 'orange' }}>Medium Traffic</span>}
                {trafficLevel === 'Low' && <span style={{ color: 'green' }}>Low Traffic</span>}
            </div>
            <table border="1" style={{ width: '100%', textAlign: 'left' }}>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Doctor Name</th>
                        <th>Date</th>
                        <th>Time Slot</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map((appointment) => (
                        <tr key={appointment._id}>
                            <td>{appointment.email}</td>
                            <td>{appointment.doctorName}</td>
                            <td>{appointment.date}</td>
                            <td>{appointment.timeSlot}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        
              
        
        </section>
    
    );
};

export default AppointmentStudent;
