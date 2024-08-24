import React, { useState } from "react";
import { Navbar, Nav, Container, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import "../styles/navbar.css";
import logo from "../static/images/logo.jpeg";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import Login from "../LoginSystem/Login/Login"; // Adjust path to Login component
import { useLogout } from "../../../hooks/useLogout";
import { useAuthContext } from "../../../context/AuthContext"; // Adjust path if necessary

const MiniNavBar = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { logout } = useLogout();
  const { state } = useAuthContext();

  const { user, isAuthenticated } = state;
  const navigate = useNavigate();

  const handleLoginModalOpen = () => {
    setShowLoginModal(true);
  };

  const handleLoginModalClose = () => {
    setShowLoginModal(false);
  };

  const handleNavCollapse = () => setExpanded(!expanded);

  const handleLogout = async () => {
    logout();
    navigate("/");
  };

  return (
    <Navbar expand="lg" className="navbar" variant="dark" expanded={expanded}>
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="navbar-brand">
          <img
            src={logo}
            alt="Company Logo"
            style={{ width: "60px", height: "57px", top: 0 }}
          />
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="navbarScroll"
          className="navbar-toggler"
          onClick={handleNavCollapse}
        />
        <Navbar.Collapse
          id="navbarScroll"
          className="navbar-collapse"
          in={expanded}
        >
          <Nav className="navbar-nav" navbarScroll>
            <Link to="/" className="nav-link">
              HOME
            </Link>
            {user && (
              <Nav.Link
                as={Link}
                to="/dashboard"
                className="nav-link"
                onClick={handleNavCollapse}
              >
                Dashboard
              </Nav.Link>
            )}
            <Link to="/contact" className="nav-link">
              Contact Us
            </Link>
            {user && (
              <div
                className="nav-link"
                role="button"
                tabIndex="0"
                onClick={handleLogout}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleLogout();
                  }
                }}
              >
                <FontAwesomeIcon icon={faSignOutAlt} /> Logout
              </div>
            )}
            {!user && (
              <div
                className="nav-link"
                role="button"
                tabIndex="0"
                onClick={() => {
                  handleLoginModalOpen();
                  handleNavCollapse();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleLoginModalOpen();
                    handleNavCollapse();
                  }
                }}
              >
                <FontAwesomeIcon icon={faUser} />
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>

      <Modal show={showLoginModal} onHide={handleLoginModalClose} centered>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <Login onLoginSuccess={handleLoginModalClose} /> {/* Pass callback */}
        </Modal.Body>
      </Modal>
    </Navbar>
  );
};

export default MiniNavBar;
