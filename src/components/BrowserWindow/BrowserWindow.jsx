import React, { useState, useRef, useEffect } from "react";
import { EggsMusic } from "../Egg/EggsMusic";
import { EggsWeatherSunny } from "../Egg/EggsWeatherSunny";
import { IconsPause } from "../../icons/IconsPause";
import { Mic } from "../../icons/Mic";
import { Play } from "../../icons/Play";

// Placeholder for user image
const userImage = "https://via.placeholder.com/24";

export const BrowserWindow = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentHeight, setCurrentHeight] = useState(0);
  const sheetRef = useRef(null);
  const dragHandleRef = useRef(null);
  
  // Default collapsed height from CSS
  const collapsedHeight = 200; // Adjust based on your design
  const expandedHeight = window.innerHeight;
  const expandThreshold = 100; // Pixels to drag before expanding
  
  // Toggle expansion on click
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Handle drag start
  const handleDragStart = (e) => {
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    setIsDragging(true);
    setStartY(clientY);
    setCurrentHeight(sheetRef.current.getBoundingClientRect().height);
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('touchmove', handleDrag);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchend', handleDragEnd);
  };
  
  // Handle drag movement
  const handleDrag = (e) => {
    if (!isDragging) return;
    
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
    const deltaY = startY - clientY;
    const newHeight = Math.max(collapsedHeight, Math.min(expandedHeight, currentHeight + deltaY));
    
    sheetRef.current.style.height = `${newHeight}px`;
    
    // Update expanded state based on drag position
    if (newHeight > collapsedHeight + expandThreshold && !isExpanded) {
      setIsExpanded(true);
    } else if (newHeight < collapsedHeight + expandThreshold && isExpanded) {
      setIsExpanded(false);
    }
  };
  
  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false);
    // Snap to either expanded or collapsed
    if (isExpanded) {
      sheetRef.current.style.height = `${expandedHeight}px`;
    } else {
      sheetRef.current.style.height = `${collapsedHeight}px`;
    }
    
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('touchmove', handleDrag);
    document.removeEventListener('mouseup', handleDragEnd);
    document.removeEventListener('touchend', handleDragEnd);
  };
  
  // Update height on window resize
  useEffect(() => {
    const handleResize = () => {
      if (isExpanded) {
        sheetRef.current.style.height = `${window.innerHeight}px`;
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isExpanded]);
  
  // Sample chat messages for the mockup
  const messages = [
    { type: 'time', content: '9:24 PM' },
    { type: 'user', content: 'play the cure' },
    { type: 'ai', content: "Here's The Cure. Now playing the first result." },
    { type: 'music', title: 'The Cure – Alone', playing: true },
    { type: 'music', title: 'The Cure – Just Like Heaven', playing: false },
    { type: 'music', title: 'The Cure – Lost', playing: false },
    { type: 'time', content: '9:26 PM' },
    { type: 'user', content: "what's the weather" },
    { type: 'ai', content: "Here's the weather in Kilauea, HI" }
  ];
  
  return (
    <div className="browser-window">
      <div className="frame-wrapper">
        <div className="frame-7">
          <div className="frame-8">
            {messages.map((message, index) => (
              <React.Fragment key={index}>
                {message.type === 'time' && (
                  <div className="text-wrapper-6">{message.content}</div>
                )}
                
                {message.type === 'user' && (
                  <div className="div-wrapper">
                    <div className="frame-10">
                      <div className="text-wrapper-8">{message.content}</div>
                    </div>
                  </div>
                )}
                
                {message.type === 'ai' && (
                  <div className="div-wrapper">
                    <div className="frame-9">
                      <p className="text-wrapper-7">{message.content}</p>
                    </div>
                  </div>
                )}
                
                {message.type === 'music' && (
                  <div className="div-wrapper">
                    <div className="frame-11">
                      <img className="img" alt="Album artwork" src={userImage} />
                      <p className="text-wrapper-7">{message.title}</p>
                      {message.playing ? (
                        <IconsPause
                          className="icons-pause-4"
                          rectangleClassName="icons-pause-5"
                          rectangleClassNameOverride="icons-pause-5"
                        />
                      ) : (
                        <Play className="icons-play" color="white" />
                      )}
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          
          <div 
            ref={sheetRef}
            className={`frame-13 ${isExpanded ? 'expanded' : ''} ${isDragging ? 'dragging' : ''}`}
            style={{ 
              height: isExpanded ? expandedHeight : collapsedHeight 
            }}
          >
            <div className="frame-14">
              <div className="text-wrapper-9">ask for anything</div>
              <div className="more-button-wrapper">
                <div className="icons-mic-wrapper">
                  <Mic className="icons-mic" />
                </div>
              </div>
              <button className="button">
                <button className="more-button-2">
                  <div className="text-wrapper-10">send</div>
                </button>
              </button>
            </div>
            
            <div className="frame-15">
              <div className="frame-16">
                <img className="image" alt="User" src={userImage} />
                <div className="text-wrapper-11">Robert Andersen</div>
              </div>
              
              <div 
                className="rectangle-wrapper" 
                ref={dragHandleRef}
                onClick={toggleExpand}
                onMouseDown={handleDragStart}
                onTouchStart={handleDragStart}
              >
                <div className="rectangle-6" />
              </div>
              
              <div className="frame-16">
                <div className="text-wrapper-12">9:28 PM</div>
                <div className="ellipse" />
              </div>
            </div>
            
            <div className="frame-17">
              <EggsWeatherSunny />
              <EggsMusic className="eggs-music-instance" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};