import React from "react";
import HeroSection from "./HeroSection";
import StorytellingSection from "./StorytellingSection";
import CallToActionSection from "./CallToActionSection";
import "../styles/Home.css";
import WhoWeAre from "./WhoWeAre";
import Serve from "./Serve";
import HowItWorks from "./HowItWorks";
import Features from "./Features";
import Pricing from "./Pricing";
import Contact from "./contact";
import GlobalMap from "./GlobalMap";
const Home = () => {
  return (
    <div className="full-page">
      <section id="hero-section">
        <HeroSection />
      </section>
      <StorytellingSection />
      <section id="WhoWeAre">
        <WhoWeAre />
      </section>
      <section id="serve">
        <Serve />
      </section>
      <section id="how-it-works">
        <HowItWorks />
      </section>
      <section id="features">
        <Features />
      </section>
      <section id="GlobalMap">
        <GlobalMap />
      </section>
      <section id="pricing">
        <Pricing />
      </section>
      <section id="contact">
        <Contact />
      </section>
      <CallToActionSection />
    </div>
  );
};

export default Home;
