import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">

        <button
          className={`menu-toggle ${isOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>

      <ul className={`nav-links ${isOpen ? "open" : ""}`}>
        {[
          { path: "/", name: "Home" },
          { path: "/workout", name: "Work Out" },
          { path: "/meals", name: "Meals" },
          { path: "/plan", name: "My Plan" },
          { path: "/profile", name: "Profile" }
        ].map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              onClick={closeMenu}
            >
              {item.name}
              <span className="link-underline"></span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
