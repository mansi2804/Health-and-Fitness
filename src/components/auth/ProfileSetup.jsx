import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import './Auth.css';

const ProfileSetup = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    height_cm: '',
    weight_kg: '',
    goal: '',
    diet: '',
    activity_level: '',
    workout_preference: '',
    allergies: '',
    user_suggestion: '',
  });
  const [hasProfile, setHasProfile] = useState(false);
  const bubbleCanvasRef = useRef(null);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login');
      } else {
        const profileRef = doc(db, 'userProfiles', user.uid);
        getDoc(profileRef).then((docSnap) => {
          if (docSnap.exists()) {
            setFormData(docSnap.data());
            setHasProfile(true);
          }
        });
      }
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const canvas = bubbleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize(); window.addEventListener('resize', resize);
    const bubbles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * canvas.height,
      r: Math.random() * 3 + 1,
      vy: Math.random() * 0.5 + 0.2,
      alpha: Math.random() * 0.4 + 0.1,
    }));
    const animate = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      bubbles.forEach(b => {
        ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,2*Math.PI);
        ctx.fillStyle = `rgba(255,255,255,${b.alpha})`;
        ctx.fill();
        b.y -= b.vy;
        if (b.y + b.r < 0) { b.y = canvas.height + b.r; b.x = Math.random()*canvas.width; }
      });
      requestAnimationFrame(animate);
    };
    animate();
    return () => window.removeEventListener('resize', resize);
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const parsedValue = type === 'number' ? Number(value) : value;
    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      try {
        await setDoc(doc(db, 'userProfiles', user.uid), formData);
        navigate('/dashboard');
      } catch (error) {
        console.error('Error saving profile:', error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="auth-container">
      <canvas ref={bubbleCanvasRef} className="auth-bubble-canvas" />
      <div className="auth-form">
        <h2>Complete Your Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input
              id="age"
              name="age"
              type="number"
              className="input-field"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              required
              disabled={hasProfile}
            />
          </div>
          <div className="form-group">
            <label>Gender</label>
            <div className="radio-group" style={{ display: 'flex', gap: '1rem' }}>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={formData.gender === 'Male'}
                  onChange={handleChange}
                  disabled={hasProfile}
                />
                Male
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={formData.gender === 'Female'}
                  onChange={handleChange}
                  disabled={hasProfile}
                />
                Female
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Other"
                  checked={formData.gender === 'Other'}
                  onChange={handleChange}
                  disabled={hasProfile}
                />
                Other
              </label>
            </div>
          </div>
          <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="height_cm">Height (cm)</label>
              <input
                id="height_cm"
                name="height_cm"
                type="number"
                className="input-field"
                placeholder="Height (cm)"
                value={formData.height_cm}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="weight_kg">Weight (kg)</label>
              <input
                id="weight_kg"
                name="weight_kg"
                type="number"
                className="input-field"
                placeholder="Weight (kg)"
                value={formData.weight_kg}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="goal">Fitness Goal</label>
            <select
              id="goal"
              name="goal"
              className="input-field"
              value={formData.goal}
              onChange={handleChange}
              required
            >
              <option value="">Select Goal</option>
              <option value="Lose Weight">Lose Weight</option>
              <option value="Maintain Weight">Maintain Weight</option>
              <option value="Muscle Gain">Muscle Gain</option>
              <option value="Endurance">Endurance</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="diet">Diet Preference</label>
            <select
              id="diet"
              name="diet"
              className="input-field"
              value={formData.diet}
              onChange={handleChange}
              required
            >
              <option value="">Select Diet</option>
              <option value="Balanced">Balanced</option>
              <option value="High Protein">High Protein</option>
              <option value="Keto">Keto</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Vegan">Vegan</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="activity_level">Activity Level</label>
            <select
              id="activity_level"
              name="activity_level"
              className="input-field"
              value={formData.activity_level}
              onChange={handleChange}
              required
            >
              <option value="">Select Activity Level</option>
              <option value="Sedentary">Sedentary</option>
              <option value="Lightly Active">Lightly Active</option>
              <option value="Moderately Active">Moderately Active</option>
              <option value="Very Active">Very Active</option>
              <option value="Extra Active">Extra Active</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="workout_preference">Workout Preference</label>
            <select
              id="workout_preference"
              name="workout_preference"
              className="input-field"
              value={formData.workout_preference}
              onChange={handleChange}
              required
            >
              <option value="">Select Workout Preference</option>
              <option value="Strength Training">Strength Training</option>
              <option value="Cardio">Cardio</option>
              <option value="Flexibility">Flexibility</option>
              <option value="Mixed">Mixed</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="allergies">Allergies (if any)</label>
            <input
              id="allergies"
              name="allergies"
              type="text"
              className="input-field"
              placeholder="Allergies"
              value={formData.allergies}
              onChange={handleChange}
            />
          </div>
          <div className="form-group full-span">
            <label htmlFor="user_suggestion">Suggestions</label>
            <textarea
              id="user_suggestion"
              name="user_suggestion"
              className="input-field"
              placeholder="Any suggestions?"
              value={formData.user_suggestion}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="primary-button full-span">Save Profile</button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
