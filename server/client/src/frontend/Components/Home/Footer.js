import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faLinkedin,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import "../styles/footer.css";

function Footer() {
  return (
    <section className="footer">
      <div className="footer-container">
        <div className="footer-col">
          <h4>HKI AI</h4>
          <p>
            Welcome to HKI AI, where innovation meets excellence. We specialize
            in leveraging cutting-edge AI technology to streamline your job
            application process and enhance your career opportunities.
          </p>
          <div className="icons">
            <a href="https://www.facebook.com/hedj.eg">
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a href="https://www.instagram.com/hedj.eg/">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="https://www.linkedin.com/company/hedj/">
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
          </div>
        </div>
        <div className="footer-col">
          <h4>Important Links</h4>
          <ul>
            <li>Who We Are</li>
            <li>Who We Serve</li>
            <li>How It Works</li>
            <li>Features</li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li>Affiliate Program</li>
            <li>Pricing</li>
            <li>Blog</li>
            <li>FAQ</li>
            <li>Contact Us</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default Footer;
