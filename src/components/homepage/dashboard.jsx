import React, { useEffect, useState, useRef } from "react";
import { useAuth } from '../../AuthContext';
import { db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import "./Dashboard.css";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState({
    name: "John Doe",
    age: 28,
    weight: 75,
    height: 178,
  });
  const [activeTab, setActiveTab] = useState("dashboard");
  const canvasRef = useRef(null);

  // load user profile to keep BMI in sync
  useEffect(() => {
    if (!loading && user) {
      const profileRef = doc(db, 'userProfiles', user.uid);
      getDoc(profileRef)
        .then(docSnap => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData({
              name: data.name,
              age: data.age,
              weight: data.weight_kg,
              height: data.height_cm,
            });
          }
        })
        .catch(err => console.error('Error loading profile:', err));
    }
  }, [user, loading]);

  // Starfield animation
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    const stars = Array.from({ length: 200 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.3
    }));
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(255,255,255,${Math.random()})`;
        ctx.fill();
      });
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  // Icon components
  const IconHome = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  );

  const IconUser = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );

  const IconSettings = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );

  const IconUtensils = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
      <path d="M7 2v20"></path>
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path>
    </svg>
  );

  const IconDumbbell = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
      <path d="m6.5 6.5 11 11"></path>
      <path d="m21 21-1-1"></path>
      <path d="m3 3 1 1"></path>
      <path d="m18 22 4-4"></path>
      <path d="m2 6 4-4"></path>
      <path d="m3 10 7-7"></path>
      <path d="m14 21 7-7"></path>
    </svg>
  );

  const IconActivity = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
    </svg>
  );

  const IconCamera = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
      <circle cx="12" cy="13" r="3"></circle>
    </svg>
  );

  const IconSun = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
      <circle cx="12" cy="12" r="4"></circle>
      <path d="M12 2v2"></path>
      <path d="M12 20v2"></path>
      <path d="m4.93 4.93 1.41 1.41"></path>
      <path d="m17.66 17.66 1.41 1.41"></path>
      <path d="M2 12h2"></path>
      <path d="M20 12h2"></path>
      <path d="m6.34 17.66-1.41 1.41"></path>
      <path d="m19.07 4.93-1.41 1.41"></path>
    </svg>
  );

  const IconMoon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
    </svg>
  );

  const IconMenu = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
      <line x1="4" x2="20" y1="12" y2="12"></line>
      <line x1="4" x2="20" y1="6" y2="6"></line>
      <line x1="4" x2="20" y1="18" y2="18"></line>
    </svg>
  );

  const IconX = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
      <path d="M18 6 6 18"></path>
      <path d="m6 6 12 12"></path>
    </svg>
  );

  // Components
  const Progress = ({ value }) => {
    return (
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${value}%` }}></div>
      </div>
    );
  };

  const Card = ({ children, className }) => {
    return <div className={`card ${className || ""}`}>{children}</div>;
  };

  const CardHeader = ({ children }) => {
    return <div className="card-header">{children}</div>;
  };

  const CardTitle = ({ children }) => {
    return <h3 className="card-title">{children}</h3>;
  };

  const CardDescription = ({ children }) => {
    return <p className="card-description">{children}</p>;
  };

  const CardContent = ({ children }) => {
    return <div className="card-content">{children}</div>;
  };

  const Button = ({ children, variant, size, className, onClick }) => {
    return (
      <button 
        className={`button ${variant || ""} ${size || ""} ${className || ""}`}
        onClick={onClick}
      >
        {children}
      </button>
    );
  };

  const BmiCalculator = ({ userData }) => {
    const heightM = userData.height / 100;
    const bmiValue = Number((userData.weight / (heightM * heightM)).toFixed(1));
    let bmiLabel;
    if (bmiValue < 18.5) bmiLabel = 'Underweight';
    else if (bmiValue < 25) bmiLabel = 'Normal Weight';
    else if (bmiValue < 30) bmiLabel = 'Overweight';
    else bmiLabel = 'Obese';

    return (
      <Card className="bmi-calculator">
        <CardHeader>
          <CardTitle>BMI Calculator</CardTitle>
          <CardDescription>Calculate your Body Mass Index</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bmi-result">
            <div className="bmi-value">{bmiValue}</div>
            <div className="bmi-label">{bmiLabel}</div>
          </div>
          <div className="bmi-scale">
            <div className="bmi-category underweight">
              <div className="category-label">Underweight</div>
              <div className="category-range">&lt;18.5</div>
            </div>
            <div className="bmi-category normal">
              <div className="category-label">Normal</div>
              <div className="category-range">18.5-24.9</div>
            </div>
            <div className="bmi-category overweight">
              <div className="category-label">Overweight</div>
              <div className="category-range">25-29.9</div>
            </div>
            <div className="bmi-category obese">
              <div className="category-label">Obese</div>
              <div className="category-range">&gt;30</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const NutritionPlan = () => (
    <div className="nutrition-container">
      <h2>Your Personalized Nutrition Plan</h2>
      <div className="nutrition-content">
        <div className="nutrition-summary">
          <div className="nutrition-metric">
            <div className="metric-value">2300</div>
            <div className="metric-label">Daily Calories</div>
          </div>
          <div className="nutrition-metric">
            <div className="metric-value">175g</div>
            <div className="metric-label">Protein</div>
          </div>
          <div className="nutrition-metric">
            <div className="metric-value">65g</div>
            <div className="metric-label">Fat</div>
          </div>
          <div className="nutrition-metric">
            <div className="metric-value">260g</div>
            <div className="metric-label">Carbs</div>
          </div>
        </div>
        <div className="meal-plans">
          <h3>Today's Meal Plan</h3>
          <Card>
            <CardHeader>
              <CardTitle>Breakfast (8:00 AM)</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="meal-items">
                <li>Oatmeal with berries (300 cal)</li>
                <li>Greek yogurt (120 cal)</li>
                <li>Black coffee (5 cal)</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Lunch (12:30 PM)</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="meal-items">
                <li>Grilled chicken salad (450 cal)</li>
                <li>Whole grain bread (120 cal)</li>
                <li>Apple (80 cal)</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );


  const LiveMovementDetection = () => (
    <div className="movement-container">
      <h2>Live Movement Detection</h2>
      <div className="camera-placeholder">
        <IconCamera />
        <p>Camera feed will appear here</p>
        <Button>Enable Camera</Button>
      </div>
      <div className="movement-stats">
        <div className="stat-item">
          <div className="stat-label">Form Quality</div>
          <div className="stat-value">Good</div>
          <Progress value={75} />
        </div>
        <div className="stat-item">
          <div className="stat-label">Repetitions</div>
          <div className="stat-value">12</div>
        </div>
      </div>
    </div>
  );

  const FoodScan = () => (
    <div className="foodscan-container">
      <h2>Food Scanner</h2>
      <div className="camera-placeholder">
        <IconCamera />
        <p>Scan your food to get nutritional information</p>
        <Button>Scan Food</Button>
      </div>
      <div className="recent-scans">
        <h3>Recent Scans</h3>
        <div className="scan-item">
          <div className="scan-image"></div>
          <div className="scan-details">
            <div className="scan-name">Apple</div>
            <div className="scan-nutrition">80 calories, 0g fat, 21g carbs</div>
          </div>
        </div>
      </div>
    </div>
  );

  const UserProfile = () => (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <IconUser />
        </div>
        <div className="profile-info">
          <h2>{userData?.name || "Guest User"}</h2>
          <p>{userData ? `${userData.age} years, ${userData.weight}kg, ${userData.height}cm` : "Welcome!"}</p>
        </div>
      </div>
      <div className="profile-form">
        <div className="form-group">
          <label>Name</label>
          <input type="text" defaultValue={userData?.name} />
        </div>
        <div className="form-group">
          <label>Age</label>
          <input type="number" defaultValue={userData?.age} />
        </div>
        <div className="form-group">
          <label>Weight (kg)</label>
          <input type="number" defaultValue={userData?.weight} />
        </div>
        <div className="form-group">
          <label>Height (cm)</label>
          <input type="number" defaultValue={userData?.height} />
        </div>
        <Button className="save-profile-button">Save Profile</Button>
      </div>
    </div>
  );

  const SettingsPanel = () => (
    <div className="settings-container">
      <h2>Settings</h2>
      <div className="settings-option">
        <div className="option-label">
          <IconSettings />
          <span>Notifications</span>
        </div>
        <div className="theme-toggle">
          <div className="toggle-slider active">
            <div className="toggle-knob"></div>
          </div>
          <span>Enabled</span>
        </div>
      </div>
    </div>
  );

  // Dashboard content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="dashboard-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100%' }}>
            <h1 className="hero-title">PERSONAL HEALTH AND FITNESS HUB</h1>
            <p className="hero-subtitle">
              Get personalized workout plans created by our AI trainer.
              <br />
              Easy-to-use, effective workout planner.
            </p>
            <BmiCalculator userData={userData} />
          </div>
        );
      case "nutrition":
        return <NutritionPlan />;
      case "workout":
        return <WorkoutRecommendations />;
      case "movement":
        return <LiveMovementDetection />;
      case "foodscan":
        return <FoodScan />;
      case "profile":
        return <UserProfile />;
      case "settings":
        return <SettingsPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="app-container" style={{ position: 'relative' }}>
      {/* Removed internal dashboard sidebar; using PremiumLeftNavbar for navigation */}
      <canvas ref={canvasRef} className="star-canvas" />
      <div className="main-content" style={activeTab === "dashboard" ? { marginLeft: 0, height: '100vh', padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' } : {}}>
        <main className="dashboard-main" style={activeTab === "dashboard" ? { padding: 0, width: '100%', height: '100%' } : {}}>
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;