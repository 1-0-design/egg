import React, { useState } from "react";

export const EggsMusic = ({ albumArtwork, className }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className={`eggs-music ${className || ""}`}>
      <div className="overlap-group">
        <div className="frame">
          <div className="frame-2">
            <div className="text-wrapper">Now Playing</div>
            <div className="text-wrapper-2">Taylor Swift - Cruel Summer</div>
          </div>
          <div className="more-button">
            <img className="more-icon" alt="More icon" src="/static/more-icon.svg" />
          </div>
        </div>
        <div className="frame-3">
          <img
            className="album-artwork"
            alt="Album artwork"
            src={albumArtwork || "/static/default-album.png"}
          />
          <div className="timeline">
            <div className="rectangle-5" />
          </div>
          <div 
            className="pause-button" 
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <div className="pause-icon">
                <div className="pause-bar" />
                <div className="pause-bar" />
              </div>
            ) : (
              <div className="play-icon" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};