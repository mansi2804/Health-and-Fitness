import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  // Watch, 
  Heart, 
  Zap, 
  Award, 
  Moon,
  Loader
} from 'lucide-react';
import '../../App.css';

function Tracking() {
  // const [userId] = useState("user_1");
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState(null);
  const [exerciseInput, setExerciseInput] = useState("");
  // const [selectedWatch, setSelectedWatch] = useState(null);
  // const [showDebugInfo, setShowDebugInfo] = useState(false);
  
  // const watchOptions = [
  //   { id: "watch1", value: "Apple Watch Series 8", label: "Apple Watch Series 8" },
  //   { id: "watch2", value: "Fitbit Sense 2", label: "Fitbit Sense 2" },
  //   { id: "watch3", value: "Garmin Forerunner 255", label: "Garmin Forerunner 255" },
  //   { id: "watch4", value: "Samsung Galaxy Watch 5", label: "Samsung Galaxy Watch 5" }
  // ];
  
  const metricIcons = {
    'steps': <Activity size={24} />,
    'heart_rate': <Heart size={24} />,
    'calories_burned': <Zap size={24} />,
    'active_minutes': <Award size={24} />,
    'sleep_hours': <Moon size={24} />
  };
  
  const trendComponents = {
    'Increasing': <TrendingUp size={18} className="text-green-500" />,
    'Decreasing': <TrendingDown size={18} className="text-red-500" />,
    'Stable': <Minus size={18} className="text-yellow-500" />
  };
  
  const formatNumber = (num) => {
    if (num === null || num === undefined) return 'N/A';
    return typeof num === 'number' ?
      (Number.isInteger(num) ? num : num.toFixed(2)) :
      num;
  };
  
  const addExercise = async () => {
    const exercise = exerciseInput.trim();
    if (!exercise) {
      alert('Please enter exercise details');
      return;
    }
    
    setIsLoading(true);
    try {
      // In a real app, you would make an API call here
      // Simulate API response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add to activities list
      const activityText = exercise || "Random activity";
      setActivities(prev => [activityText, ...prev]);
      setExerciseInput('');
      
      // Toast notification instead of alert
      const toast = document.createElement('div');
      toast.className = 'toast-notification';
      toast.textContent = exercise ? 'Exercise recorded successfully!' : 'Random activity data added!';
      document.body.appendChild(toast);
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 3000);
      
      // Automatically refresh insights
      getInsights();
    } catch (error) {
      console.error('Error recording activity:', error);
      alert('Error recording activity. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // const connectDevice = () => {
  //   if (selectedWatch) {
  //     // Toast notification instead of alert
  //     const toast = document.createElement('div');
  //     toast.className = 'toast-notification';
  //     toast.textContent = `${selectedWatch} connected successfully!`;
  //     document.body.appendChild(toast);
  //     setTimeout(() => {
  //       document.body.removeChild(toast);
  //     }, 3000);
      
  //     setActivities(prev => [`Connected ${selectedWatch} to your account`, ...prev]);
  //   } else {
  //     alert('Please select a device to connect.');
  //   }
  // };
  
  const getInsights = async () => {
    setIsLoading(true);
    try {
      // Simulate API response with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockInsights = {
        steps: { latest: 8432, trend: "Increasing", average: 7850, min: 4200, max: 12000 },
        heart_rate: { latest: 72, trend: "Stable", average: 74, min: 68, max: 92 },
        calories_burned: { latest: 2450, trend: "Increasing", average: 2200, min: 1800, max: 3200 },
        active_minutes: { latest: 65, trend: "Decreasing", average: 70, min: 30, max: 120 },
        sleep_hours: { latest: 7.5, trend: "Stable", average: 7.2, min: 5, max: 9 }
      };
      setInsights(mockInsights);
    } catch (error) {
      console.error('Error getting insights:', error);
      setInsights(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    getInsights();
    
    // Add CSS to head
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --bg-primary: rgb(32, 33, 39);
        --accent-color: rgb(24, 239, 199);
        --text-primary: #ffffff;
        --text-secondary: rgba(255, 255, 255, 0.7);
        --card-bg: rgb(42, 43, 49);
        --hover-bg: rgba(24, 239, 199, 0.1);
        --border-color: rgba(255, 255, 255, 0.08);
      }
      
      body, html {
        background-color: var(--bg-primary);
        color: var(--text-primary);
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        margin: 0;
        padding: 0;
      }
      
      .app-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
        color: rgba(24, 239, 199, 0.85);
      }
      
      .card {
        background-color: var(--card-bg);
        border-radius: 16px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        margin-bottom: 2rem;
        padding: 1.5rem;
        overflow: hidden;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      
      .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
      }
      
      .header-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        color: rgba(24, 239, 199, 0.85);
      }
      

      .logo {
        background: linear-gradient(45deg, var(--accent-color), #7fffd4);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 700;
        font-size: 1.5rem;
        letter-spacing: 1px;
      }
      
      h1, h2, h3 {
        color: var(--text-primary);
        font-weight: 600;
      }
      
      h1 {
        font-size: 2rem;
        margin: 0.5rem 0;
        background: linear-gradient(120deg, #ffffff, #d7d7d7);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      
      h2 {
        font-size: 1.5rem;
        margin-top: 0;
      }
      
      p {
        color: var(--text-secondary);
        line-height: 1.6;
      }
      
      /* Dashboard description text with special styling */
      .dashboard-description {
        color: rgba(24, 239, 199, 0.85);
        font-weight: 400;
        font-size: 1.05rem;
        margin-bottom: 1.8rem;
      }
      
      .form-group {
        margin-bottom: 1.5rem;
      }
      
      label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--accent-color);
        font-weight: 500;
        font-size: 0.95rem;
        letter-spacing: 0.5px;
        text-transform: uppercase;
      }
      
      input[type="text"] {
        width: 100%;
        padding: 0.875rem 1rem;
        border-radius: 8px;
        border: 1px solid var(--border-color);
        background-color: rgba(255, 255, 255, 0.05);
        color: var(--text-primary);
        font-size: 1rem;
        transition: all 0.3s ease;
      }
      
      input[type="text"]:focus {
        outline: none;
        border-color: var(--accent-color);
        box-shadow: 0 0 0 2px rgba(24, 239, 199, 0.25);
      }
      
      .section-title {
        font-weight: 600;
        margin: 1.5rem 0 1rem;
        color: var(--accent-color);
        font-size: 0.95rem;
        letter-spacing: 0.5px;
        text-transform: uppercase;
      }
      
      .watch-options {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 1rem;
        margin-bottom: 1.5rem;
      }
      
      .watch-option {
        display: flex;
        align-items: center;
        padding: 0.75rem 1rem;
        background-color: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .watch-option:hover {
        background-color: var(--hover-bg);
      }
      
      .watch-option input {
        margin-right: 0.75rem;
        accent-color: var(--accent-color);
      }
      
      .buttons-container {
        display: flex;
        gap: 1rem;
        margin-top: 1.5rem;
        flex-wrap: wrap;
        position: relative;
      }
      
      button {
        padding: 0.875rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
      }
      
      #add-exercise {
        background-color: var(--accent-color);
        color: var(--bg-primary);
        border: none;
      }
      
      #add-exercise:hover {
        background-color: rgb(21, 215, 180);
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(24, 239, 199, 0.3);
      }
      
      #add-watch {
        background-color: transparent;
        color: var(--accent-color);
        border: 2px solid var(--accent-color);
      }
      
      #add-watch:hover {
        background-color: var(--hover-bg);
        transform: translateY(-2px);
      }
      
      .loading-spinner {
        display: inline-block;
        width: 1.5rem;
        height: 1.5rem;
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: var(--accent-color);
        animation: spin 1s ease-in-out infinite;
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      
      #loading {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: var(--text-secondary);
      }
      
      .metrics {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 1.5rem;
      }
      
      .metric {
        background-color: rgba(255, 255, 255, 0.03);
        border-radius: 12px;
        padding: 1.25rem;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }
      
      .metric:hover {
        background-color: rgba(255, 255, 255, 0.05);
        transform: translateY(-3px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
      }
      
      .metric h3 {
        font-size: 1rem;
        margin-top: 0;
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .stat-value {
        font-size: 2rem;
        font-weight: 700;
        margin: 0.75rem 0;
        background: linear-gradient(45deg, var(--accent-color), #7fffd4);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      
      .trend-indicator {
        display: flex;
        align-items: center;
        gap: 0.375rem;
        margin-bottom: 1rem;
      }
      
      .increasing { color: #4ade80; }
      .decreasing { color: #f87171; }
      .stable { color: #facc15; }
      
      .metric-details {
        font-size: 0.875rem;
        color: var(--text-secondary);
      }
      
      .metric-details p {
        margin: 0.25rem 0;
      }
      
      .empty-state {
        text-align: center;
        padding: 2rem;
      }
      
      .empty-state-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }
      
      .history {
        max-height: 500px;
        overflow-y: auto;
      }
      
      .activity-item {
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 0.75rem;
        background-color: rgba(255, 255, 255, 0.03);
        border-left: 3px solid var(--accent-color);
        transition: all 0.2s ease;
      }
      
      .activity-item:hover {
        background-color: rgba(255, 255, 255, 0.05);
      }
      
      .toast-notification {
        position: fixed;
        bottom: 1.5rem;
        right: 1.5rem;
        background-color: var(--card-bg);
        color: var(--text-primary);
        padding: 1rem 1.5rem;
        border-radius: 8px;
        border-left: 4px solid var(--accent-color);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        animation: slideIn 0.3s ease forwards, fadeOut 0.3s ease 2.7s forwards;
        z-index: 1000;
      }
      
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes fadeOut {
        from {
          opacity: 1;
        }
        to {
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return (
    <div className="app-container">
      <div className="card">
        <div className="header-bar">
          <div className="header-actions">
            {/* Future actions like settings, profile, etc. */}
          </div>
        </div>
        
        <h1>Your Fitness Dashboard</h1>
        <p className="dashboard-description">Track your exercises, monitor your progress, and achieve your fitness goals.</p>
        
        <div className="form-group">
          <label htmlFor="exercise-input">Enter your exercise details</label>
          <input
            type="text"
            id="exercise-input"
            placeholder="e.g., ran 3 miles, did yoga for 30 minutes"
            value={exerciseInput}
            onChange={(e) => setExerciseInput(e.target.value)}
          />
        </div>
        
        {/* <div className="section-title">Connect Wearable</div>
        <div className="watch-options">
          {watchOptions.map(option => (
            <label key={option.id} className="watch-option">
              <input
                type="radio"
                id={option.id}
                name="watch"
                value={option.value}
                checked={selectedWatch === option.value}
                onChange={() => setSelectedWatch(option.value)}
              />
              {option.label}
            </label>
          ))}
        </div> */}
        
        <div className="buttons-container">
          {/* <button id="add-watch" onClick={connectDevice}>
            <Watch size={18} />
            Connect Device
          </button> */}
          <button id="add-exercise" onClick={addExercise}>
            <Activity size={18} />
            Log Exercise
          </button>
          {isLoading && (
            <div id="loading">
              <Loader size={18} className="animate-spin" />
              <span>Processing...</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="card">
        <h2>Fitness Insights</h2>
        {!insights ? (
          <div id="no-data-message" className="empty-state">
            <div className="empty-state-icon">📊</div>
            <p>Loading your fitness insights...</p>
          </div>
        ) : (
          <div className="metrics" id="metrics-container">
            {Object.entries(insights).map(([metric, data]) => {
              const formattedMetric = metric.replace(/_/g, ' ');
              const value = formatNumber(data.latest);
              const trendComponent = trendComponents[data.trend] || null;
              
              return (
                <div key={metric} className="metric">
                  <h3>
                    {metricIcons[metric] || null}
                    {formattedMetric.charAt(0).toUpperCase() + formattedMetric.slice(1)}
                  </h3>
                  <div className="stat-value">{value}</div>
                  <div className="trend-indicator">
                    {trendComponent}
                    <span className={data.trend.toLowerCase()}>{data.trend}</span>
                  </div>
                  {data.average !== null && (
                    <div className="metric-details">
                      <p>Average: {formatNumber(data.average)}</p>
                      <p>Min: {formatNumber(data.min)}</p>
                      <p>Max: {formatNumber(data.max)}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <div className="card history">
        <h2>Recent Activities</h2>
        {activities.length === 0 ? (
          <div id="activities-list" className="empty-state">
            <div className="empty-state-icon">🏃</div>
            <p>No activities recorded yet. Start tracking your fitness journey!</p>
          </div>
        ) : (
          <div id="activities-list">
            {activities.slice(0, 5).map((activity, index) => (
              <div key={index} className="activity-item">
                {activity}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {showDebugInfo && insights && (
        <div id="debug-info">
          {JSON.stringify(insights, null, 2)}
        </div>
      )}
    </div>
  );
}

export default Tracking;