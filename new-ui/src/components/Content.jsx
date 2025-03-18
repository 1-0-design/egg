import React, { useState, useRef, useEffect } from "react";
import { EggsMusic } from "./EggsMusic";
import { EggsWeatherSunny } from "./EggsWeatherSunny";
import { IconsPause } from "../icons/IconsPause";
import { Mic } from "../icons/Mic";
import { Play } from "../icons/Play";
import image2 from "../assets/images/image-2.png";
import image3 from "../assets/images/image-3.png";
import image4 from "../assets/images/image-4.png";
import image from "../assets/images/image.png";
import "../styles/Content.css";

export const Content = () => {
  // State for handling dynamic content and null states
  const [currentTrack, setCurrentTrack] = useState({
    title: "ALONE",
    artist: "THE CURE",
    albumArt: image
  });
  
  const [weather, setWeather] = useState({
    location: "KILAUEA, HI",
    condition: "SUNNY",
    temperature: "72°F"
  });

  // Add state for message input and history
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, text: "Welcome back, Robert", sender: "ai" },
    { id: 2, text: "play the cure", sender: "user" },
    { id: 3, text: "Here's The Cure. Now playing the first result.", sender: "ai" },
    { id: 4, text: "what's the weather", sender: "user" },
    { id: 5, text: "Here's the weather in Kilauea, HI", sender: "ai" }
  ]);
  
  // Add ref for auto-scrolling
  const chatRef = useRef(null);

  // Auto-scroll when messages change
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // For a real app, we'd fetch this data from the iTunes API
  const [songs, setSongs] = useState([
    { id: 1, title: "Alone", artist: "The Cure", image: image, playing: true },
    { id: 2, title: "Just Like Heaven", artist: "The Cure", image: image2, playing: false },
    { id: 3, title: "Lost", artist: "The Cure", image: image3, playing: false }
  ]);

  // Handle message sending
  const handleSendMessage = () => {
    if (messageInput.trim() === "") return;
    
    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      text: messageInput,
      sender: "user"
    };
    
    setMessages([...messages, newUserMessage]);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        text: `I processed your request: "${messageInput}"`,
        sender: "ai"
      };
      setMessages(prevMessages => [...prevMessages, aiResponse]);
    }, 1000);
    
    setMessageInput("");
  };

  // Toggle play state for songs
  const togglePlayPause = (songId) => {
    setSongs(songs.map(song => ({
      ...song,
      playing: song.id === songId ? !song.playing : false
    })));
    
    // Update current track based on selection
    const selectedSong = songs.find(song => song.id === songId);
    if (selectedSong) {
      setCurrentTrack({
        title: selectedSong.title.toUpperCase(),
        artist: selectedSong.artist.toUpperCase(),
        albumArt: selectedSong.image
      });
    }
  };

  // Handle input keypress
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="content">
      <div className="chat" ref={chatRef}>
        <div className="time-divider">Today</div>

        {/* Render messages dynamically */}
        {messages.map((message) => (
          <div className="frame-wrapper" key={message.id}>
            <div className={message.sender === "user" ? "user-message" : "ai-message"}>
              <div className={message.sender === "user" ? "text-wrapper-8" : "text-wrapper-7"}>
                {message.text}
              </div>
            </div>
          </div>
        ))}

        {/* Song cards - only show if we have songs in state */}
        {songs.length > 0 && (
          <div className="song-cards">
            {songs.map((song) => (
              <div className="frame-wrapper" key={song.id}>
                <div className="frame-8">
                  <img className="img" alt={`${song.artist} - ${song.title}`} src={song.image} />
                  <div className="text-wrapper-7">{song.artist} – {song.title}</div>
                  {song.playing ? (
                    <IconsPause
                      className="icons-pause-4"
                      rectangleClassName="icons-pause-5"
                      rectangleClassNameOverride="icons-pause-5"
                      onClick={() => togglePlayPause(song.id)}
                    />
                  ) : (
                    <Play 
                      className="icons-play" 
                      color="white" 
                      onClick={() => togglePlayPause(song.id)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Weather card - only show if weather is in state */}
        {weather && (
          <div className="weather-card">
            <div className="frame-wrapper">
              <div className="weather-display">
                <EggsWeatherSunny 
                  location={weather.location}
                  condition={weather.condition}
                  temperature={weather.temperature}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="egg-tray">
        <div className="frame-10">
          <input
            type="text"
            className="text-wrapper-9"
            placeholder="Ask Egg anything..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />

          <div className="more-button-wrapper">
            <div className="icons-mic-wrapper">
              <Mic className="icons-mic" />
            </div>
          </div>

          <button className="button" onClick={handleSendMessage}>
            <div className="more-button-2">
              <div className="text-wrapper-10">Send</div>
            </div>
          </button>
        </div>

        <div className="frame-11">
          <div className="frame-12">
            <img className="image" alt="User" src={image4} />
            <div className="text-wrapper-11">Robert Andersen</div>
          </div>

          <div className="rectangle-wrapper">
            <div className="rectangle-7" />
          </div>

          <div className="frame-12">
            <div className="text-wrapper-12">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
            <div className="status-indicator online" />
          </div>
        </div>

        <div className="frame-13">
          {currentTrack && (
            <EggsMusic
              albumArtwork={currentTrack.albumArt}
              title={currentTrack.title}
              artist={currentTrack.artist}
              className="eggs-music-instance"
            />
          )}
          
          {weather && (
            <EggsWeatherSunny 
              location={weather.location}
              condition={weather.condition}
              temperature={weather.temperature}
            />
          )}
        </div>
      </div>
    </div>
  );
};