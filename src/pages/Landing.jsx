import React from "react";
import { Link } from "react-router-dom";
import heroImg from "../assets/hero-placeholder.png";

export default function Landing() {
  return (
    <div className="landing-container">
      <section className="landing-hero">
        <div className="landing-hero-text">
          <h1 className="landing-hero-title">Turn Small Actions Into Global Impact</h1>
          <p className="landing-hero-subtitle">Share how you're fighting climate change, learn new facts, and inspire others.</p>
          <div className="landing-hero-buttons">
            <Link to="/create" className="btn btn-primary">Create Post</Link>
            <Link to="/community" className="btn btn-secondary">Explore Community</Link>
          </div>
        </div>
        <div className="landing-hero-image-box">
          <img src={heroImg} alt="Climate hero" />
        </div>
      </section>

      <section className="landing-features">
        <div className="card">
          <h3>Share</h3>
          <p>Post images & stories about your climate actions.</p>
        </div>
        <div className="card">
          <h3>Learn</h3>
          <p>Animated flashcards & light quizzes.</p>
        </div>
        <div className="card">
          <h3>Inspire</h3>
          <p>Like, comment, repost; build a community.</p>
        </div>
      </section>
    </div>
  );
}
