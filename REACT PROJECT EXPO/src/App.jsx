import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Methodology from "./pages/Methodology";
import Visualization from "./pages/Visualization";
import Model from "./pages/Model";
import Team from "./pages/Team";
import DatasetGuide from "./pages/DatasetGuide";
import Synopsis from "./pages/Synopsis";
import Dashboard from "./pages/Dashboard";
import Comparison from "./pages/Comparison";
import Reporting from "./pages/Reporting";
import AboutUs from "./pages/AboutUs";
import SmoothScroll from "./components/SmoothScroll";
import Cursor from "./components/Cursor";
import Loader from "./components/Loader";
import ThemeToggle from "./components/ThemeToggle";

function App() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("coastal_ai_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  return (
    <>
      <Loader />
      <ThemeToggle />
      <Cursor />
      <Router>
        <SmoothScroll>
          <div className="app-container">
            <Navbar user={user} setUser={setUser} />
            <div className="content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/visualization" element={<Visualization />} />
                <Route path="/comparison" element={<Comparison />} />
                <Route path="/reporting" element={<Reporting />} />
                <Route path="/methodology" element={<Methodology />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/dataset" element={<DatasetGuide />} />
                <Route path="/synopsis" element={<Synopsis />} />
                <Route path="/team" element={<Team />} />
                <Route path="/model" element={<Model />} />
              </Routes>
            </div>
          </div>
        </SmoothScroll>
      </Router>
    </>
  );
}

export default App;
