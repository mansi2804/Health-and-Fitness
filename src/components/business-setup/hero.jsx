import React, { useState } from 'react';
import './hero.css'; // You'll need to create this CSS file

const FitnessApp = () => {
  const handleGetPlansClick = () => {
    console.log("Get Plans clicked");
    // Implement your navigation logic here
  };

  const testimonials = [
    {
      text: "This app has revolutionized my fitness regimen. With fresh routines, clear video instructions, and weight suggestions, Planfit has invigorated my commitment to a healthier lifestyle.",
      author: "Felipe1983",
      date: "Aug 11, 2023",
      rating: 5
    },
    {
      text: "I was doubtful about getting a good workout with this app, but when I did these side kick burpees HOLY COW!! Loved the personalized workout!",
      author: "Griffin Ehlers 5",
      date: "Aug 9, 2023",
      rating: 5
    },
    {
      text: "It recommends workouts that are challenging enough, manages breaks with a timer, has a clean UI, and allows you to modify your workouts!",
      author: "Abubuver",
      date: "Sep 7, 2022",
      rating: 5
    }
  ];

  return (
    <div className="app-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="content-wrapper">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                <span className="accent-text">FREE AI-POWERED</span>
                <br />
                PERSONAL TRAINING
                <br />
                FOR GYM FREAKS
              </h1>
              
              <p className="hero-subtitle">
                Get personalized workout plans created by our AI trainer.
                <br />
                Easy-to-use, effective workout planner.
              </p>

              <button
                onClick={handleGetPlansClick}
                className="primary-button"
              >
                Get Plans for Free
              </button>
            </div>

            <div className="hero-image">
              {/* Using a real placeholder image service */}
              <img
                src="https://images.unsplash.com/photo-1611241893603-3c359704e0ee?auto=format&fit=crop&q=80"
                alt="App Preview"
                className="app-preview"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="stats-section">
        <div className="content-wrapper">
          <p className="stats-intro">Planfit has changed millions of people's lives in over 100 countries.</p>
          <div className="stats-container">
            <div className="stat-item">
              <h3 className="stat-number">80,000,000+</h3>
              <p className="stat-label">Workouts Logged</p>
            </div>
            <div className="stat-item">
              <h3 className="stat-number">1,000,000+</h3>
              <p className="stat-label">App Users Worldwide</p>
            </div>
            <div className="stat-item">
              <h3 className="stat-number">4.9</h3>
              <p className="stat-label">Store Rating</p>
            </div>
          </div>
        </div>
      </section>
      <div className="landing-page">
      <div className="content-container">
        
        <div className="text-content">
          <h1>FREE AI-POWERED<br />PERSONAL TRAINING APP<br />FOR GYM BEGINNERS</h1>
          <p>
            Get personalized workout plan and<br />
            personal training by AI trainer.<br />
            Easy-to-use, effective workout planner.
          </p>
          <button className="cta-button">Get Plans for Free</button>
        </div>
        
        <div className="phone-mockups">
          <div className="phone phone-back">
            <div className="phone-screen">
              <div className="screen-content">
                <div className="analytics-graph"></div>
                <div className="analytics-details"></div>
              </div>
            </div>
          </div>
          <div className="phone phone-front">
            <div className="phone-screen">
              <div className="screen-content">
                <div className="workout-figure"></div>
                <div className="workout-controls"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>

      {/* Featured Section */}
      <section class="featured-section">
  <div class="container">
    <h3 class="section-title">Also Featured In</h3>
    <div class="logo-row">
      <div class="logo-item">
        <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="App Store" class="logo" />
      </div>
      <div class="logo-item">
        <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg" alt="Play Store" class="logo" />
      </div>
      <div class="logo-item">
        <img src="https://upload.wikimedia.org/wikipedia/commons/8/8f/GQ_logo.svg" alt="GQ" class="logo" />
      </div>
    </div>
  </div>
</section>

      

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="content-wrapper">
          <h2 className="section-title">JOIN MORE THAN 1M SUCCESS STORIES</h2>
          <div className="testimonials-container">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="rating">
                  {"★".repeat(testimonial.rating)}
                </div>
                <p className="testimonial-text">{testimonial.text}</p>
                <div className="testimonial-author">
                  <p className="author-name">{testimonial.author}</p>
                  <p className="author-date">{testimonial.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="content-wrapper">
          <p>© 2025 Planfit. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default FitnessApp;