import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import maram2 from "../static/images/logo.jpeg";
import "../../Components/styles/Home.css";

const StorytellingSection = () => (
  <Container className="storytelling-section" id="About us">
    <Row>
      <Col md={6}>
        <img
          src={maram2}
          alt="Company-team"
          style={{ width: "400px", height: "auto" }}
        />
      </Col>
      <Col md={6}>
        <h2>Our Journey</h2>
        <p>
          Born from a shared vision, we are more than just a job portal—we are a
          beacon for those seeking purpose in their careers. Our team, with
          roots in management, technology, and IT, came together with a singular
          goal: to make finding the right job not just easier, but meaningful.
        </p>
        <p>
          We've been recognized for our impact, but what drives us is the
          opportunity to change lives. Our AI-powered platform is not just about
          finding jobs; it's about matching people with opportunities that feel
          like home.
        </p>
        <p>
          This journey is personal. We know the weight of seeking something more
          than just work, and we're here to guide you toward that perfect fit.
          Wherever you are in your career, let us help you find the path that
          was meant for you.
        </p>
        <p>Start your search with us, and let’s build your future together.</p>
      </Col>
    </Row>
  </Container>
);

export default StorytellingSection;
