import React from "react";
import {
  FaLinkedin,
  FaSquareInstagram,
  FaSquareXTwitter,
} from "react-icons/fa6";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Footer = () => {
  const { isAuthenticated } = useSelector((state) => state.user);
  return (
    <>
      <footer>
        <div>
          <img src="/logo.png" alt="logo" />
        </div>
        <div>
          <h4>Support</h4>
          <ul>
            <li>Sector-L Aliganj Lucknow</li>
            <li>rudranshpsingh@gmail.com</li>
            <li>7521931924</li>
          </ul>
        </div>

        <div>
          <h4>Quick Links</h4>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/jobs">Jobs</Link>
            </li>
            {isAuthenticated && (
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
            )}
          </ul>
        </div>
        <div>
          <h4>Follow Us</h4>
          <ul>
            <li>
              <a href="https://x.com/?lang=en" target="_blank" rel="noopener noreferrer">
                <span>
                  <FaSquareXTwitter />
                </span>
                <span>Twitter (X)</span>
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                <span>
                  <FaSquareInstagram />
                </span>
                <span>Instagram</span>
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
                <span>
                  <FaLinkedin />
                </span>
                <span>LinkedIn</span>
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </>
  );
};

export default Footer;