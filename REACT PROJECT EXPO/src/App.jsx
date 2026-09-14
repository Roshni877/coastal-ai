import React from "react";
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
import SmoothScroll from "./components/SmoothScroll";
import Cursor from "./components/Cursor";
import Loader from "./components/Loader";
import ThemeToggle from "./components/ThemeToggle";

function App() {
  return (
    <>
      <Loader />
      <ThemeToggle />
      <Cursor />
      <Router>
        <SmoothScroll>
          <div className="app-container">
            <Navbar />
            <div className="content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/methodology" element={<Methodology />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/visualization" element={<Visualization />} />
                <Route path="/model" element={<Model />} />
                <Route path="/team" element={<Team />} />
                <Route path="/dataset" element={<DatasetGuide />} />
                <Route path="/synopsis" element={<Synopsis />} />
              </Routes>
            </div>
          </div>
        </SmoothScroll>
      </Router>
    </>
  );
}

export default App;
