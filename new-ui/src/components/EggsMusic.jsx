import React, { useState } from "react";
import { IconsDots } from "../icons/IconsDots";
import "../styles/EggsMusic.css";
import albumArtworkPlaceholder from "../assets/alone-album.svg";

export const EggsMusic = ({ className, albumArtwork, title = "ALONE", artist = "THE CURE", onTogglePlay }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (onTogglePlay) {
      onTogglePlay(!isPlaying);
    }
  };
  
  return (
    <div className={`eggs-music ${className || ""}`}>
      <div className="overlap-group">
        <div className="frame">
          <div className="frame-2">
            <div className="text-wrapper">{title}</div>
            <div className="text-wrapper-2">{artist}</div>
          </div>

          <div className="more-button">
            <IconsDots />
          </div>
        </div>

        <div className="frame-3">
          <img
            className="album-artwork"
            alt="Album artwork"
            src={albumArtwork || albumArtworkPlaceholder}
          />

          <div className="timeline">
            <div className="rectangle-5" />
          </div>

          <div className="pause-button" onClick={handlePlayPause}>
            {isPlaying ? (
              <div className="pause-icon">
                <div className="pause-bar"></div>
                <div className="pause-bar"></div>
              </div>
            ) : (
              <div className="play-icon"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EggsMusic;