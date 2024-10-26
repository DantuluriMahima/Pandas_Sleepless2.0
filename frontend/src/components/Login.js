//Login page to handle authorization to access the student and admin pages
import React, { useState } from 'react';
// Import Bootstrap CSS and Javascript
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    roll: '',
    password: ''
  });
  const [userType, setUserType] = useState('student'); // 'admin' or 'student'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const navigate = useNavigate();

  
  // Function to handle student login with additional authorization check
  const handleLoginClick = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/students/login', formData);
     
      if (response.data.auth) {
        const response2 = await axios.get(`http://localhost:5000/api/students/search?category=roll&keyword=${formData.roll}`);
        if (response2.data[0].position === 'Admin') {
          alert('Login successful as User');
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('studentId', response.data.studentId);
          navigate('/AdminPage');
        } else {
          alert('Unauthorized access');
        }
      } else {
        alert('Login failed');
      }
    } catch (error) {
      console.error(error);
      alert('Error logging in');
    }
  };

  // Function to handle login for student or faculty with redirection based on user type
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/students/login', formData);
      if (response.data.auth) {
        const response2 = await axios.get(`http://localhost:5000/api/students/search?category=roll&keyword=${formData.roll}`);
        if (response2.data[0].position === 'Student' || response2.data[0].position === 'Faculty') {
          alert('Login successful as User');
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('studentId', response.data.studentId);
          console.log( response.data.studentId);
          navigate('/StudentPage');
        } else {
          alert('Unauthorized access');
        }
      } else {
        alert('Login failed');
      }
    } catch (error) {
      console.error(error);
      alert('Error logging in');
    }
  };
  return (
      <section id="loginpage">
    <div className="container-fluid" style={{
      background: "linear-gradient(rgba(14, 29, 52, 0.8), rgba(14, 29, 52, 0.6)), url('static/lib8.jpeg') center center",
      backgroundSize: 'cover',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div className='container'>
      <div className="col-xl-9 col-lg-12 login-container">
      <div className="row">
          <div className="col-lg-7 img-box">
            <img src="/static/adminpage/homebar.png" alt="" />
          </div>
          <div className="col-lg-5 no-padding">
          <a href="/"className="text-light d-flex align-items-center justify-content-end" style={{ textDecoration: 'none', position: 'absolute', top: '20px', right: '40px', fontFamily: 'Roboto, sans-serif'}}>
            <i class="bi bi-box-arrow-in-left">Back to Home</i></a>
              
            <div className="card-body">
            <h1 className="card-title text-center">Login</h1>
              <ul className="nav nav-tabs" id="loginTab" role="tablist">
                <li className="nav-item">
                  <a
                    className={`nav-link ${userType === 'student' ? 'active' : ''}`}
                    onClick={() => setUserType('student')}
                    role="tab"
                  >
                    Student
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${userType === 'admin' ? 'active' : ''}`}
                    onClick={() => setUserType('admin')}
                    role="tab"
                  >
                    Admin
                  </a>
                </li>
              </ul>
              <div className="tab-content">
                <div className={`tab-pane ${userType === 'student' ? 'active' : ''}`} role="tabpanel">
                <form onSubmit={handleSubmit}>
                        <div className="form-group row no-margin">
                          <label htmlFor="roll">Roll Number</label>
                          <input
                            type="text"
                            className="form-control"
                            id="roll"
                            name="roll"
                            value={formData.roll}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="form-group row no-margin">
                          <label htmlFor="password">Password</label>
                          <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '20px' }}>
                          Login as Student
                        </button>
                      </form>
                </div>
                <div className={`tab-pane ${userType === 'admin' ? 'active' : ''}`} role="tabpanel">
                <form onSubmit={handleLoginClick}>
                        <div className="form-group row no-margin">
                          <label htmlFor="roll">Faculty ID</label>
                          <input
                            type="text"
                            className="form-control"
                            id="roll"
                            name="roll"
                            value={formData.roll}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="form-group row no-margin">
                          <label htmlFor="password">Password</label>
                          <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '20px' }}>
                          Login as Admin
                        </button>
                      </form>
                </div>
              </div>
              
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
     </section>
  );
};

export default Login;
