import React from "react";
import { useNavigate } from "react-router-dom";
import "../../Components/styles/Home.css";
import { Container, Row, Col, Button } from "react-bootstrap";


const CallToActionSection = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate("/signup");
  };

  return (
    <div className="Register-section">
      <Container>
        <Row>
          <Col>
            <h2>Join Us Today</h2>
            <p>Register and start applying for your dream jobs with ease.</p>
            <Button onClick={handleRegisterClick}>Register Now</Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CallToActionSection;
