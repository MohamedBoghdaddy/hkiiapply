import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../../Components/styles/Home.css"; // Adjust the path as needed

const HeroSection = () => (
  <div className="hero-section">
    <Container>
      <Row>
        <Col>
          <h1>Welcome to HKI AI CAREER</h1>
          <p>Your Career Ally: AI Applies, You RELAX, Job Offers Arrive!</p>
          <Button variant="dark" as={Link} to="/signup">
            Free trial !
          </Button>
        </Col>
      </Row>
    </Container>
  </div>
);

export default HeroSection;
