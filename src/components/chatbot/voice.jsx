import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, User, Bot, Activity, Volume2 } from 'lucide-react';
import './voicechat.css'; // Import the CSS file

const VoiceChat = () => {
  const [conversation, setConversation] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isBotSpeaking, setIsBotSpeaking] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunks.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'user_input.wav');
        
        try {
          const res = await fetch('http://localhost:5001/voice', {
            method: 'POST',
            body: formData,
          });
          
          const data = await res.json();
          if (data.error) {
            alert(data.error);
          } else {
            setConversation((prev) => [
              ...prev,
              { type: 'user', text: data.user },
              { type: 'bot', text: data.bot },
            ]);
            
            // Simulate bot speaking animation
            setIsBotSpeaking(true);
            setTimeout(() => setIsBotSpeaking(false), 3000);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Couldn't access microphone:", error);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Random gentle movement for bot when idle
  const [botPosition, setBotPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isBotSpeaking) {
        setBotPosition({
          x: Math.sin(Date.now() / 1000) * 5,
          y: Math.cos(Date.now() / 1500) * 3
        });
      }
    }, 50);
    
    return () => clearInterval(intervalId);
  }, [isBotSpeaking]);

  return (
    <div className="app-container">
      {/* Left side - Chat history */}
      <div className="voice-chat-component">
      <div className="chat-section">
        <header className="header">
          <h1 className="app-title">
            <span className="title-icon">🎙</span> 
            <span className="title-text">FitVoice Coach</span>
          </h1>
        </header>

        {/* Conversation */}
        <div className="conversation-container">
          {conversation.length === 0 ? (
            <div className="empty-chat">
              <div className="empty-icon">💬</div>
              <p className="empty-text">Your conversation will appear here</p>
              <p className="empty-subtext">Press the microphone button to start</p>
            </div>
          ) : (
            <div className="message-list">
              {conversation.map((entry, idx) => (
                <div key={idx} className="message-item">
                  {entry.type === 'bot' ? (
                    <div className="avatar bot-avatar">
                      <Bot size={20} className="avatar-icon" />
                    </div>
                  ) : (
                    <div className="avatar user-avatar">
                      <User size={20} className="avatar-icon" />
                    </div>
                  )}
                  
                  <div className={`message-bubble ${entry.type === 'user' ? 'user-message' : 'bot-message'}`}>
                    {entry.text}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recording button */}
        <div className="input-container">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`record-button ${isRecording ? 'record-active' : 'record-idle'}`}
          >
            {isRecording ? (
              <Square size={24} color="white" />
            ) : (
              <Mic size={24} color="#1a1a1a" />
            )}
          </button>
          
          {isRecording && (
            <div className="record-status">
              <div className="status-pill">Recording... Speak now</div>
            </div>
          )}
        </div>
      </div>

      {/* Right side - Animated Bot */}
      <div className="bot-section">
        {/* Animated bot container */}
        <div 
          className="bot-container"
          style={{
            transform: `translate(${botPosition.x}px, ${botPosition.y}px)`
          }}
        >
          {/* Main bot body */}
          <div className="bot-body">
            <div className="bot-inner">
              {/* Bot face */}
              <div className="bot-face">
                {/* Eyes */}
                <div className="bot-eye left-eye">
                  <div 
                    className="eye-pupil"
                    style={{
                      transform: isBotSpeaking 
                        ? `translate(${Math.sin(Date.now() / 200) * 1}px, ${Math.cos(Date.now() / 300) * 1}px)` 
                        : 'translate(0, 0)'
                    }}
                  ></div>
                </div>
                <div className="bot-eye right-eye">
                  <div 
                    className="eye-pupil"
                    style={{
                      transform: isBotSpeaking 
                        ? `translate(${Math.sin((Date.now() + 300) / 200) * 1}px, ${Math.cos((Date.now() + 300) / 300) * 1}px)` 
                        : 'translate(0, 0)'
                    }}
                  ></div>
                </div>
                
                {/* Mouth */}
                <div className="bot-mouth">
                  {isBotSpeaking ? (
                    <div className="mouth-speaking">
                      <div className="mouth-wave">
                        <div 
                          className="wave-animation" 
                          style={{
                            top: `${Math.sin(Date.now() / 100) * 2 + 2}px`
                          }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <div className="mouth-idle"></div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sound waves when speaking */}
          {isBotSpeaking && (
            <div className="sound-waves">
              <div className="wave-outer"></div>
              <div className="wave-inner"></div>
            </div>
          )}

          {/* Status indicators */}
          <div className="status-indicators">
            {isRecording && (
              <div className="status-indicator">
                <Activity size={16} className="status-icon-recording" />
                <span className="status-text">Listening</span>
              </div>
            )}
            
            {isBotSpeaking && (
              <div className="status-indicator">
                <Volume2 size={16} className="status-icon-speaking" />
                <span className="status-text">Speaking</span>
              </div>
            )}
          </div>
        </div>

        {/* Bot name */}
        <div className="bot-info">
          <h2 className="bot-name">FitBot</h2>
          <p className="bot-description">Your Personal Fitness Assistant</p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default VoiceChat;