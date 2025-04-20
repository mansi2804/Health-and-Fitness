// DietPlan.jsx
import { useState, useEffect } from "react";
import "./dietrecommendation.css";

export function DietRecommendation({ userData }) {
  const [goal, setGoal] = useState("balanced");
  const [bmiCategory, setBmiCategory] = useState("");

  useEffect(() => {
    if (userData && userData.weight && userData.height) {
      // Calculate BMI
      const heightInMeters = userData.height / 100;
      const bmiValue = userData.weight / (heightInMeters * heightInMeters);
      
      // Set BMI category
      if (bmiValue < 18.5) {
        setBmiCategory("underweight");
      } else if (bmiValue >= 18.5 && bmiValue < 25) {
        setBmiCategory("healthy");
      } else if (bmiValue >= 25 && bmiValue < 30) {
        setBmiCategory("overweight");
      } else {
        setBmiCategory("obese");
      }
    }
  }, [userData]);

  const dietPlans = {
    balanced: [
      {
        title: "Mediterranean Diet",
        description: "Heart-healthy diet based on traditional foods of Mediterranean countries",
        difficulty: "Easy to Moderate",
        duration: "Ongoing lifestyle",
        meals: [
          { name: "Breakfast", description: "Greek yogurt with honey, nuts and fresh fruit" },
          { name: "Lunch", description: "Tuna salad with olive oil, mixed greens and chickpeas" },
          { name: "Dinner", description: "Grilled fish with roasted vegetables and quinoa" },
          { name: "Snack", description: "Handful of almonds and an apple" },
          { name: "Hydration", description: "8-10 glasses of water daily" },
        ],
      },
      {
        title: "Balanced Macros",
        description: "Focus on balanced protein, carbs and fats",
        difficulty: "Moderate",
        duration: "Ongoing lifestyle",
        meals: [
          { name: "Breakfast", description: "Oatmeal with protein powder and berries" },
          { name: "Lunch", description: "Chicken breast with sweet potato and green vegetables" },
          { name: "Dinner", description: "Lean ground turkey with brown rice and mixed vegetables" },
          { name: "Snack", description: "Cottage cheese with fruit or vegetable sticks with hummus" },
          { name: "Hydration", description: "2-3 liters of water daily" },
        ],
      },
      {
        title: "Whole Foods Plan",
        description: "Minimally processed natural foods",
        difficulty: "Moderate",
        duration: "Ongoing lifestyle",
        meals: [
          { name: "Breakfast", description: "Vegetable omelet with whole grain toast" },
          { name: "Lunch", description: "Quinoa bowl with roasted vegetables and grilled chicken" },
          { name: "Dinner", description: "Baked salmon with steamed vegetables and wild rice" },
          { name: "Snack", description: "Fresh fruit and a small handful of nuts" },
          { name: "Hydration", description: "Herbal teas and water throughout the day" },
        ],
      },
    ],
    weightloss: [
      {
        title: "Calorie Deficit Plan",
        description: "Moderate calorie restriction for sustainable weight loss",
        difficulty: "Moderate",
        duration: "8-12 weeks",
        meals: [
          { name: "Breakfast", description: "Protein smoothie with spinach, berries, and almond milk" },
          { name: "Lunch", description: "Large salad with lean protein and light dressing" },
          { name: "Dinner", description: "Lean protein with non-starchy vegetables and small portion of complex carbs" },
          { name: "Snack", description: "Greek yogurt with cinnamon or vegetable sticks" },
          { name: "Hydration", description: "Minimum 3 liters of water daily" },
        ],
      },
      {
        title: "Low Carb Approach",
        description: "Reduced carbohydrate intake to promote fat burning",
        difficulty: "Challenging",
        duration: "4-8 weeks",
        meals: [
          { name: "Breakfast", description: "Eggs with avocado and vegetables" },
          { name: "Lunch", description: "Protein with large green salad and olive oil dressing" },
          { name: "Dinner", description: "Grilled or baked meat/fish with low-carb vegetables" },
          { name: "Snack", description: "String cheese, nuts or hardboiled eggs" },
          { name: "Hydration", description: "8-10 glasses of water with electrolytes" },
        ],
      },
      {
        title: "Intermittent Fasting",
        description: "Time-restricted eating pattern",
        difficulty: "Challenging",
        duration: "Ongoing with cycling",
        meals: [
          { name: "Eating Window", description: "8-hour eating window (e.g., 12pm-8pm)" },
          { name: "First Meal", description: "Protein-rich meal with healthy fats and vegetables" },
          { name: "Second Meal", description: "Balanced meal with lean protein, vegetables, and moderate carbs" },
          { name: "Optional Snack", description: "Small protein-rich snack if needed" },
          { name: "Hydration", description: "Water, black coffee, and herbal tea during fasting hours" },
        ],
      },
    ],
    musclegain: [
      {
        title: "High Protein Plan",
        description: "Increased protein intake to support muscle growth",
        difficulty: "Moderate",
        duration: "Ongoing with bulking/cutting cycles",
        meals: [
          { name: "Breakfast", description: "Protein pancakes with Greek yogurt and berries" },
          { name: "Lunch", description: "Chicken or turkey wrap with whole grain tortilla and vegetables" },
          { name: "Dinner", description: "Large portion of lean protein with rice and vegetables" },
          { name: "Post-Workout", description: "Protein shake with banana and creatine supplement" },
          { name: "Evening Snack", description: "Cottage cheese with nut butter" },
        ],
      },
      {
        title: "Clean Bulk Diet",
        description: "Calorie surplus with focus on quality nutrition",
        difficulty: "Advanced",
        duration: "12-16 weeks",
        meals: [
          { name: "Breakfast", description: "Egg whites, oatmeal with fruit and protein powder" },
          { name: "Mid-Morning", description: "Lean protein source with complex carbohydrates" },
          { name: "Lunch", description: "Large serving of protein, sweet potato, and vegetables" },
          { name: "Post-Workout", description: "Fast-acting protein and carb shake" },
          { name: "Dinner", description: "Lean red meat or fish with quinoa and vegetables" },
        ],
      },
      {
        title: "Carb Cycling Plan",
        description: "Alternating carb intake based on training schedule",
        difficulty: "Advanced",
        duration: "8-12 weeks",
        meals: [
          { name: "Training Days", description: "Higher carb meals around workouts" },
          { name: "Rest Days", description: "Lower carb, higher fat meals" },
          { name: "Protein Intake", description: "Consistent high protein across all days" },
          { name: "Supplements", description: "Strategic pre/post workout nutrition" },
          { name: "Hydration", description: "Minimum 1 gallon of water daily" },
        ],
      },
    ],
  };

  return (
    <div className="diet-plan-container">
      <div className="diet-header">
        <div className="header-text">
          <h2>Personalized Diet Plans</h2>
          <p>Nutrition recommendations based on your goals and body composition</p>
        </div>
        <div className="diet-goals">
          <button
            onClick={() => setGoal("balanced")}
            className={`goal-button ${goal === "balanced" ? "active" : ""}`}
          >
            Balanced Nutrition
          </button>
          <button
            onClick={() => setGoal("weightloss")}
            className={`goal-button ${goal === "weightloss" ? "active" : ""}`}
          >
            Weight Loss
          </button>
          <button
            onClick={() => setGoal("musclegain")}
            className={`goal-button ${goal === "musclegain" ? "active" : ""}`}
          >
            Muscle Gain
          </button>
        </div>
      </div>

      <div className="filter-section">
        <h3>Diet Recommendations</h3>
        <div className="filter-button">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6H21M6 12H18M10 18H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Filter
        </div>
      </div>

      <div className="diet-plans-grid">
        {dietPlans[goal].map((diet, index) => (
          <div className="diet-card" key={index}>
            <div className="diet-card-header">
              <h3>{diet.title}</h3>
              <p>{diet.description}</p>
            </div>
            <div className="diet-card-details">
              <div className="detail-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {diet.duration}
              </div>
              <div className="detail-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 10V3L4 14H11V21L20 10H13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {diet.difficulty}
              </div>
            </div>
            <div className="diet-card-meals">
              <h4>Meal Plan</h4>
              <ul className="exercise-list">
                {diet.meals.map((meal, i) => (
                  <li className="exercise-item" key={i}>
                    <span className="exercise-name"><strong>{meal.name}</strong></span>
                    <span className="exercise-sets">{meal.description}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-footer">
              <button className="start-diet-button">Get Full Plan</button>
            </div>
          </div>
        ))}
      </div>

      {bmiCategory && (
        <div className="bmi-recommendations">
          <div className="bmi-header">
            <h3>Recommendations Based on Your BMI</h3>
            <p>Personalized nutrition suggestions for your body type</p>
          </div>
          <div className="bmi-content">
            {bmiCategory === "underweight" && (
              <div className="bmi-advice">
                <p>
                  Based on your BMI, you're classified as{" "}
                  <span className="highlight">underweight</span>. Here are some nutrition recommendations:
                </p>
                <ul className="recommendations-list">
                  <li>Increase your caloric intake by 300-500 calories above maintenance</li>
                  <li>Consume protein-rich foods with each meal (aim for 1.6-2.2g per kg of bodyweight)</li>
                  <li>Include calorie-dense but nutritious foods like nuts, avocados, and olive oil</li>
                  <li>Consider eating 5-6 smaller meals throughout the day if you struggle with large portions</li>
                </ul>
              </div>
            )}
            {bmiCategory === "healthy" && (
              <div className="bmi-advice">
                <p>
                  Based on your BMI, you're classified as having a{" "}
                  <span className="highlight">healthy weight</span>. Here are some nutrition recommendations:
                </p>
                <ul className="recommendations-list">
                  <li>Focus on nutrient density rather than calorie counting</li>
                  <li>Maintain a balanced macronutrient profile based on your activity level</li>
                  <li>Prioritize whole foods and limit ultra-processed food consumption</li>
                  <li>Consider meal timing around workouts to optimize performance and recovery</li>
                </ul>
              </div>
            )}
            {bmiCategory === "overweight" && (
              <div className="bmi-advice">
                <p>
                  Based on your BMI, you're classified as{" "}
                  <span className="highlight">overweight</span>. Here are some nutrition recommendations:
                </p>
                <ul className="recommendations-list">
                  <li>Create a moderate calorie deficit of 300-500 calories per day</li>
                  <li>Increase protein intake to preserve muscle (1.6-2g per kg of bodyweight)</li>
                  <li>Focus on fiber-rich foods to increase satiety and improve digestion</li>
                  <li>Consider timing carbohydrates around your workout periods</li>
                </ul>
              </div>
            )}
            {bmiCategory === "obese" && (
              <div className="bmi-advice">
                <p>
                  Based on your BMI, you're classified as{" "}
                  <span className="highlight">obese</span>. Here are some nutrition recommendations:
                </p>
                <ul className="recommendations-list">
                  <li>Work with a healthcare provider to create a safe and sustainable eating plan</li>
                  <li>Focus on whole, unprocessed foods with high nutrient density</li>
                  <li>Prioritize protein and fiber to help manage hunger and preserve muscle mass</li>
                  <li>Consider tracking food intake to increase awareness of eating patterns</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}