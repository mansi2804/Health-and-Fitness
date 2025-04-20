// LiveMovementDetection.jsx
import { useState, useRef } from "react";
import { Camera, Mic, MicOff, Play, Volume2, VolumeX } from "lucide-react";
import './opencv.css';

export function LiveMovementDetection() {
  const [cameraActive, setCameraActive] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [speakerActive, setSpeakerActive] = useState(true);
  const [feedback, setFeedback] = useState([]);
  const [activeTab, setActiveTab] = useState("strength");
  const videoRef = useRef(null);

  const toggleCamera = async () => {
    if (cameraActive) {
      // Stop camera
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setCameraActive(false);
    } else {
      // Start camera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraActive(true);
        // Simulate AI feedback after camera starts
        setTimeout(() => {
          setFeedback([
            "I can see you now! Let's get started with your workout.",
            "Position yourself so your full body is visible in the frame.",
            "Make sure you have enough space around you for the exercises.",
          ]);
        }, 2000);
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    }
  };

  const toggleMic = () => {
    setMicActive(!micActive);
  };

  const toggleSpeaker = () => {
    setSpeakerActive(!speakerActive);
  };

  const startWorkout = () => {
    // Simulate AI coaching feedback
    setFeedback([
      "Great! Let's start with some warm-up exercises.",
      "First, let's do 10 arm circles in each direction.",
      "Keep your back straight and shoulders relaxed.",
    ]);
    // Simulate more feedback after a delay
    setTimeout(() => {
      setFeedback((prev) => [
        ...prev,
        "Good form! Now let's move on to shoulder rolls.",
        "Try to keep your movements smooth and controlled.",
      ]);
    }, 5000);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="app-container">
      <div className="grid-layout">
        <div className="column">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Live Movement Detection</h2>
              <p className="card-description">Get real-time feedback on your exercise form</p>
            </div>
            <div className="card-content camera-container">
              <div className="video-container">
                {cameraActive ? (
                  <video ref={videoRef} autoPlay playsInline muted className="video-feed" />
                ) : (
                  <div className="video-placeholder">
                    <Camera size={64} />
                  </div>
                )}
              </div>
              <div className="button-group">
                <button
                  onClick={toggleCamera}
                  className={`control-button ${cameraActive ? "active" : ""}`}
                >
                  <Camera size={16} />
                  <span>{cameraActive ? "Stop Camera" : "Start Camera"}</span>
                </button>
                <button
                  onClick={toggleMic}
                  className={`control-button ${micActive ? "active" : ""}`}
                  disabled={!cameraActive}
                >
                  {micActive ? <Mic size={16} /> : <MicOff size={16} />}
                  <span>{micActive ? "Mute" : "Unmute"}</span>
                </button>
                <button
                  onClick={toggleSpeaker}
                  className={`control-button ${speakerActive ? "active" : ""}`}
                  disabled={!cameraActive}
                >
                  {speakerActive ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  <span>{speakerActive ? "Audio On" : "Audio Off"}</span>
                </button>
              </div>
            </div>
            <div className="card-footer">
              <button
                onClick={startWorkout}
                className="start-button"
                disabled={!cameraActive}
              >
                <Play size={16} />
                <span>Start Workout</span>
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Exercise Library</h2>
              <p className="card-description">Choose an exercise to get form guidance</p>
            </div>
            <div className="card-content">
              <div className="tabs">
                <div className="tabs-header">
                  <button
                    className={`tab-button ${activeTab === "strength" ? "active" : ""}`}
                    onClick={() => handleTabChange("strength")}
                  >
                    Strength
                  </button>
                  <button
                    className={`tab-button ${activeTab === "cardio" ? "active" : ""}`}
                    onClick={() => handleTabChange("cardio")}
                  >
                    Cardio
                  </button>
                  <button
                    className={`tab-button ${activeTab === "flexibility" ? "active" : ""}`}
                    onClick={() => handleTabChange("flexibility")}
                  >
                    Flexibility
                  </button>
                </div>
                <div className="tabs-content">
                  {activeTab === "strength" && (
                    <div className="tab-panel">
                      <button className="exercise-button">Squats</button>
                      <button className="exercise-button">Push-ups</button>
                      <button className="exercise-button">Lunges</button>
                      <button className="exercise-button">Planks</button>
                      <button className="exercise-button">Deadlifts</button>
                    </div>
                  )}
                  {activeTab === "cardio" && (
                    <div className="tab-panel">
                      <button className="exercise-button">Jumping Jacks</button>
                      <button className="exercise-button">High Knees</button>
                      <button className="exercise-button">Burpees</button>
                      <button className="exercise-button">Mountain Climbers</button>
                      <button className="exercise-button">Jump Rope</button>
                    </div>
                  )}
                  {activeTab === "flexibility" && (
                    <div className="tab-panel">
                      <button className="exercise-button">Hamstring Stretch</button>
                      <button className="exercise-button">Shoulder Stretch</button>
                      <button className="exercise-button">Hip Flexor Stretch</button>
                      <button className="exercise-button">Quad Stretch</button>
                      <button className="exercise-button">Child's Pose</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="column">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">AI Coach Feedback</h2>
              <p className="card-description">Real-time guidance and form correction</p>
            </div>
            <div className="card-content">
              <div className="feedback-container">
                {feedback.length > 0 ? (
                  feedback.map((message, index) => (
                    <div key={index} className="message">
                      <div className="ai-avatar">
                        <span>AI</span>
                      </div>
                      <div className="message-content">{message}</div>
                    </div>
                  ))
                ) : (
                  <div className="no-feedback">
                    <p>Start your camera and begin a workout to receive AI feedback</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Form Analysis</h2>
              <p className="card-description">AI-powered posture and movement analysis</p>
            </div>
            <div className="card-content">
              <div className="metrics">
                <div className="metric">
                  <div className="metric-header">
                    <span className="metric-name">Posture Alignment</span>
                    <span className="metric-value">85%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: "85%" }}></div>
                  </div>
                </div>
                <div className="metric">
                  <div className="metric-header">
                    <span className="metric-name">Movement Range</span>
                    <span className="metric-value">70%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: "70%" }}></div>
                  </div>
                </div>
                <div className="metric">
                  <div className="metric-header">
                    <span className="metric-name">Form Consistency</span>
                    <span className="metric-value">90%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: "90%" }}></div>
                  </div>
                </div>
                <div className="metric">
                  <div className="metric-header">
                    <span className="metric-name">Balance</span>
                    <span className="metric-value">65%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: "65%" }}></div>
                  </div>
                </div>
              </div>
              <div className="improvement-tips">
                <h3 className="tips-title">Form Improvement Tips</h3>
                <ul className="tips-list">
                  <li><span className="bullet">•</span> Keep your back straight during squats</li>
                  <li><span className="bullet">•</span> Engage your core throughout the movement</li>
                  <li><span className="bullet">•</span> Distribute weight evenly between both feet</li>
                  <li><span className="bullet">•</span> Breathe steadily throughout each exercise</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}