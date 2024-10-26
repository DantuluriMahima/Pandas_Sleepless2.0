<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { Navigation } from "./components/navigation";
import { Header } from "./components/header";
import { About } from "./components/about";
import { Services } from "./components/services";
import { Testimonials } from "./components/testimonials";
import { Team } from "./components/Team";
import { Footer } from "./components/Footer";
import { Map } from "./components/Map"
import JsonData from "./data/data.json";
import SmoothScroll from "smooth-scroll";
import "./App.css";

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const App = () => {
  const [landingPageData, setLandingPageData] = useState({});
  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);
=======
import logo from './logo.svg';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AdminPage from './components/AdminPage.js';
import Medicine from './components/Medicine.js';
import PendingMedicines from './components/PendingMeds.js';
import './App.css';
import User from './components/User';
>>>>>>> 485e5780312a90bdaa69adc649b448fa49cc7d92

  return (
<<<<<<< HEAD
    <div>
      <Navigation />
      <Header data={landingPageData.Header} />
      <About data={landingPageData.About} />
      <Services data={landingPageData.Services} />
      <Testimonials data={landingPageData.Testimonials} />
      <Team data={landingPageData.Team} />
      <Map data={landingPageData.Map} />
      <Footer data={landingPageData.Contact}/>
    </div>
=======
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/medicine" element={<Medicine />} />
        <Route path="/admin/pendingmeds" element={<PendingMedicines />} />
        <Route path="/Userpage" element={<User />} />
      </Routes>
    </Router>
>>>>>>> 485e5780312a90bdaa69adc649b448fa49cc7d92
  );
};

export default App;
