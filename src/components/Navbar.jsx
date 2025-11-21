import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const loc = useLocation();
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-inner">
          <div className="navbar-logo-section">
            <Link to="/" className="navbar-logo-link">
              <div className="navbar-logo-icon">CH</div>
              <div className="navbar-logo-text">
                <h1>Climate Hub</h1>
                <p>Share. Learn. Act.</p>
              </div>
            </Link>
          </div>

          <div className="navbar-nav">
            <Link to="/" className={`navbar-nav-link ${loc.pathname === "/" ? "active" : ""}`}>Home</Link>
            <Link to="/community" className={`navbar-nav-link ${loc.pathname.startsWith("/community") ? "active" : ""}`}>Community</Link>
            <Link to="/create" className="navbar-nav-btn">Create Post</Link>
            <Link to="/flashcards" className={`navbar-nav-link ${loc.pathname === "/flashcards" ? "active" : ""}`}>Learn</Link>
            <Link to="/quiz" className={`navbar-nav-link ${loc.pathname === "/quiz" ? "active" : ""}`}>Quiz</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
