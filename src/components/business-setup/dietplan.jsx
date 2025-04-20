import { useState } from "react";
import { Edit, Plus, ChevronDown, ChevronUp } from "lucide-react";
import './dietplan.css';

export function DietPlanCard() {
  const [activeTab, setActiveTab] = useState("week1");
  const [expandedMeals, setExpandedMeals] = useState({});

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const toggleMealExpansion = (dayMealId) => {
    setExpandedMeals(prev => ({
      ...prev,
      [dayMealId]: !prev[dayMealId]
    }));
  };

  return (
    <div className="diet-card">
      <div className="card-header">
        <div className="header-content">
          <div>
            <h2 className="card-title">Current Diet Plan</h2>
            <p className="card-description">Your personalized 4-week nutrition plan</p>
          </div>
        </div>
      </div>
      <div className="card-content">
        <div className="tabs">
          <div className="tabs-list">
            <button 
              className={`tab-trigger ${activeTab === "week1" ? "active" : ""}`}
              onClick={() => handleTabChange("week1")}
            >
              Week 1
            </button>
            <button 
              className={`tab-trigger ${activeTab === "week2" ? "active" : ""}`}
              onClick={() => handleTabChange("week2")}
            >
              Week 2
            </button>
            <button 
              className={`tab-trigger ${activeTab === "week3" ? "active" : ""}`}
              onClick={() => handleTabChange("week3")}
            >
              Week 3
            </button>
            <button 
              className={`tab-trigger ${activeTab === "week4" ? "active" : ""}`}
              onClick={() => handleTabChange("week4")}
            >
              Week 4
            </button>
          </div>
          
          {activeTab === "week1" && (
            <div className="tab-content">
              
              <div className="progress-section">
                <h3 className="progress-title">Week 1 Nutrition Progress</h3>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: "29%" }}></div>
                </div>
                <div className="progress-stats">
                  <span>2/7 days tracked</span>
                  <span>29%</span>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "week2" && (
            <div className="tab-content">
              <div className="placeholder-message">
                Week 2 meal plans will be available after completing Week 1
              </div>
            </div>
          )}
          
          {activeTab === "week3" && (
            <div className="tab-content">
              <div className="placeholder-message">
                Week 3 meal plans will be available after completing Week 2
              </div>
            </div>
          )}
          
          {activeTab === "week4" && (
            <div className="tab-content">
              <div className="placeholder-message">
                Week 4 meal plans will be available after completing Week 3
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}