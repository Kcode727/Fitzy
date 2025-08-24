import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const location = useLocation();
  // Hide navbar on any route starting with /mySpace
  if (location.pathname.startsWith("/mySpace")) {
    return null; 
  }

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check login status
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); 
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const links = [
    { path: "/", name: "Home" },
    { path: "/workout", name: "Work Out" },
    { path: "/meals", name: "Meals" },
    isLoggedIn
      ? { path: "/dashboard", name: "My Space" } // If logged in
      : { path: "/signin", name: "Sign in" },    // If not logged in
  ];

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
        {links.map((item) => (
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
