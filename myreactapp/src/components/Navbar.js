// Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import "../styling/Navbar.css"; // Import the CSS file

function Navbar() {
  return (
    <div className="navbar">
      <Link to="/">Home</Link>
      <Link to="/mlb">MLB Analyzer</Link>
      <Link to="/college">College Pitching Matchups</Link>
    </div>
  );
}

export default Navbar;
