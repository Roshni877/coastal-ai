import { NavLink } from "react-router-dom";
import { FiDroplet } from "react-icons/fi";

function Navbar() {
  return (
    <div className="nav-pill-container">
      <nav className="nav-pill">
        <NavLink to="/" className="logo-group">
          <FiDroplet className="logo-icon" />
          <div className="logo-text-stack">
            <span className="logo-text-bold">COASTAL</span>
            <br />
            <span className="logo-text-bold">AI</span>
          </div>
        </NavLink>

        <div className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/methodology">Methodology</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/visualization">Visualization and Results</NavLink>
          <NavLink to="/dataset">Datasets & Algorithms</NavLink>
          <NavLink to="/synopsis">Synopsis and Report</NavLink>
          <NavLink to="/team">Team</NavLink>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;