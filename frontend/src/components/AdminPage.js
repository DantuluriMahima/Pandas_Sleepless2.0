//welcoming page in admin login
import React, { useEffect, useRef, useState}  from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Dropdown, DropdownButton, Badge, Image } from 'react-bootstrap';
import '../styles/admin.css';
import { Link } from 'react-router-dom';

const AdminPage = () => {

  const token = localStorage.getItem('token');
  console.log("Token:", token);
    // State to handle sidebar toggle
  const [isSidebarToggled, setIsSidebarToggled] = useState(false);

  // useEffect to handle sidebar toggle button click
  useEffect(() => {
    const toggleSidebar = () => {
      setIsSidebarToggled(prevState => !prevState);
    };

    const toggleButton = document.querySelector('.toggle-sidebar-btn');
    if (toggleButton) {
      toggleButton.addEventListener('click', toggleSidebar);
    }

    return () => {
      if (toggleButton) {
        toggleButton.removeEventListener('click', toggleSidebar);
      }
    };
  }, []);
// useEffect to add/remove class for toggling sidebar
  useEffect(() => {
    if (isSidebarToggled) {
      document.body.classList.add('toggle-sidebar');
    } else {
      document.body.classList.remove('toggle-sidebar');
    }
  }, [isSidebarToggled]);
  useEffect(() => {
    const selectHeader = document.querySelector('#header');

    const handleScroll = () => {
      if (selectHeader) {
        window.scrollY > 100 ? selectHeader.classList.add('sticked') : selectHeader.classList.remove('sticked');
      }
    };
    document.addEventListener('scroll', handleScroll);

  }, []);
  // useEffect hook to handle side effects
  useEffect(() => {
    // Select the mobile navigation toggle button
    const mobileNavToogleButton = document.querySelector('.mobile-nav-toggle');

    if (mobileNavToogleButton) {
      mobileNavToogleButton.addEventListener('click', (event) => {
        event.preventDefault();
        mobileNavToogle();
      });
    }
    // Function to toggle mobile navigation
    const mobileNavToogle = () => {
      document.querySelector('body').classList.toggle('mobile-nav-active');
      mobileNavToogleButton.classList.toggle('bi-three-dots:');
      mobileNavToogleButton.classList.toggle('bi-x');
    };
    // Add event listeners to navigation links
    document.querySelectorAll('#navbar a').forEach((navbarlink) => {
      if (!navbarlink.hash) return;

      const section = document.querySelector(navbarlink.hash);
      if (!section) return;

      navbarlink.addEventListener('click', () => {
        if (document.querySelector('.mobile-nav-active')) {
          mobileNavToogle();
        }
      });
    });
// Add event listeners to navigation dropdowns
    const navDropdowns = document.querySelectorAll('.navbar .dropdown > a');

    navDropdowns.forEach((el) => {
      el.addEventListener('click', function (event) {
        if (document.querySelector('.mobile-nav-active')) {
          event.preventDefault();
          this.classList.toggle('active');
          this.nextElementSibling.classList.toggle('dropdown-active');

          const dropDownIndicator = this.querySelector('.dropdown-indicator');
          dropDownIndicator.classList.toggle('bi-chevron-up');
          dropDownIndicator.classList.toggle('bi-chevron-down');
        }
      });
    });
// Cleanup function to remove event listeners
    return () => {
      if (mobileNavToogleButton) {
        mobileNavToogleButton.removeEventListener('click', (event) => {
          event.preventDefault();
          mobileNavToogle();
        });
      }

      document.querySelectorAll('#navbar a').forEach((navbarlink) => {
        if (!navbarlink.hash) return;

        const section = document.querySelector(navbarlink.hash);
        if (!section) return;

        navbarlink.removeEventListener('click', () => {
          if (document.querySelector('.mobile-nav-active')) {
            mobileNavToogle();
          }
        });
      });

      navDropdowns.forEach((el) => {
        el.removeEventListener('click', function (event) {
          if (document.querySelector('.mobile-nav-active')) {
            event.preventDefault();
            this.classList.toggle('active');
            this.nextElementSibling.classList.toggle('dropdown-active');

            const dropDownIndicator = this.querySelector('.dropdown-indicator');
            dropDownIndicator.classList.toggle('bi-chevron-up');
            dropDownIndicator.classList.toggle('bi-chevron-down');
          }
        });
      });
    };
  }, []);
  //reponsive view of navigation bar in smaller sized window
  useEffect(() => {
    const mobileNavToggleButtons = document.querySelectorAll('.mobile-nav-toggle');
    const mobileNavShow = document.querySelector('.mobile-nav-show');
    const mobileNavHide = document.querySelector('.mobile-nav-hide');
    
    function mobileNavToggle() {
      document.body.classList.toggle('mobile-nav-active');
      mobileNavShow.classList.toggle('d-none');
      mobileNavHide.classList.toggle('d-none');
    }
    
    mobileNavToggleButtons.forEach(button => {
      button.addEventListener('click', mobileNavToggle);
    });
    
    return () => {
      mobileNavToggleButtons.forEach(button => {
        button.removeEventListener('click', mobileNavToggle);
      });
    };
  }, []); 
  return (
    <div>
      <section id="admin">
      <header id="header" className="header fixed-top d-flex align-items-center">
        <div className="container-fluid container-xl d-flex align-items-center justify-content-between">
            <div className="logo d-flex align-items-center">
              <img src="/static/logo.svg.png" alt="IIT Dharwad Logo" />
              <h1>IIT Dharwad</h1>
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
        <aside id="sidebar" className="sidebar">

        <ul className="sidebar-nav" id="sidebar-nav">

        <li className="nav-item">
            <Link className="nav-link " to="/admin">
            <i className="bi bi-grid"></i>
            <span>Home</span>
            </Link>
        </li>
        <li className="nav-item">
            <Link className="nav-link collapsed" to="/admin/medicine">
            <i className="bi bi-table"></i><span>Medicine Database</span>
            </Link>
        </li>
        <li className="nav-item">
            <Link className="nav-link collapsed" to="/admin/pendingmeds">
            <i className="bi bi-droplet-half"></i><span>Pending Medicines</span>
            </Link>
            </li>
        </ul>

        </aside>
        <main id="main" className="main" >

        <div className="pagetitle">
        <h1>Home</h1>
        <nav>
            <ol className="breadcrumb">
            <li className="breadcrumb-item active" style={{ color: "#ccc" }}>Home</li>
            </ol>
        </nav>
        </div>
        <section id="hero" className="hero section" >

            <div className="container">
                <div className="row gy-4 justify-content-center justify-content-lg-between">
                <div className="col-lg-5 order-2 order-lg-1 d-flex flex-column justify-content-center">
                    <h1>Welcome to<br />Admin Page</h1>
                    <p>Indian Institute of Technology, Dharwad</p>
                    <div className="d-flex">
                    </div>
                </div>
                </div>
            </div>

            </section>
        </main>

      
        <footer id="footer" className="footer">

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
    </div>
  );
};

export default AdminPage;
