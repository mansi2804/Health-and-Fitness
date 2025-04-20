import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import PremiumLeftNavbar from './components/premiumnavbar';
import FitnessApp from './components/business-setup/hero'
import Navbar from './components/business-setup/navbarr';
import Footer from './components/business-setup/footer'
import Dashboard from './components/homepage/dashboard';
import FoodNutritionAnalyzer from './components/business-setup/FoodNutritionAnalyzer';
import MealPlanGenerator from './components/business-setup/diet';
import WorkoutPlanGenerator from './components/business-setup/workoutplan';
import FitnessChatbot from './components/chatbot/Chatbot';
import { AuthProvider } from './AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Logout from './components/auth/Logout';
import ProfileSetup from './components/auth/ProfileSetup';

// Create a Layout component to handle the sidebar + content structure
const DashboardLayout = ({ children }) => {
  return (
    <PremiumLeftNavbar>
      <div className="absolute top-4 right-4"> {/* Position dropdown in the dashboard */}
      
      </div>
      {children}
    </PremiumLeftNavbar>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={
            <>
              <Navbar/>
              <FitnessApp/>
              <Footer />
            </>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile-setup" element={<PrivateRoute><ProfileSetup /></PrivateRoute>} />
          {/* Dashboard Pages with Layout */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <DashboardLayout>
                <Dashboard/>

              </DashboardLayout>
            </PrivateRoute>
          } />
          <Route path="/food-nutrition" element={
            <PrivateRoute>
              <DashboardLayout>
                <FoodNutritionAnalyzer/>
              </DashboardLayout>
            </PrivateRoute>
          } />

          <Route path="/meal-plan" element={
            <PrivateRoute>
              <DashboardLayout>
                <MealPlanGenerator/>
              </DashboardLayout>
            </PrivateRoute>
          } />

          <Route path="/workouts" element={
            <PrivateRoute>
              <DashboardLayout>
                <WorkoutPlanGenerator/>
              </DashboardLayout>
            </PrivateRoute>
          } />

          {/* Settings and Notifications can use the same layout */}
          <Route path="/ask-ai" element={
            <PrivateRoute>
              <DashboardLayout>
                <FitnessChatbot/>
              </DashboardLayout>
            </PrivateRoute>
          } />
          <Route path="/settings" element={
            <PrivateRoute>
              <DashboardLayout>
                <div>Settings Page Content</div>
              </DashboardLayout>
            </PrivateRoute>
          } />
          
          <Route path="/notifications" element={
            <PrivateRoute>
              <DashboardLayout>
                <div>Notifications Page Content</div>
              </DashboardLayout>
            </PrivateRoute>
          } />
          
          {/* Logout route */}
          <Route path="/logout" element={<Logout />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;