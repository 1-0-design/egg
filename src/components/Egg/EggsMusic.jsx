import React from "react";
import { IconsDots } from "../../icons/IconsDots";
import { IconsPause } from "../../icons/IconsPause";

// Placeholder for album artwork - replace with actual image
const placeholderImage = "https://via.placeholder.com/48";

export const EggsMusic = ({ className }) => {
  return (
    <div className={`eggs-music ${className || ""}`}>
      <div className="overlap-group">
        <div className="frame">
          <div className="frame-2">
            <div className="text-wrapper">ALONE</div>
            <div className="text-wrapper-2">THE CURE</div>
          </div>
          <div className="more-button">
            <IconsDots />
          </div>
        </div>
        <div className="frame-3">
          <img
            className="album-artwork"
            alt="Album artwork"
            src={placeholderImage}
          />
          <div className="timeline">
            <div className="rectangle-5" />
          </div>
          <div className="play">
            <IconsPause
              className="icons-pause-instance"
              contentClassName="design-component-instance-node"
              rectangleClassName="icons-pause-2"
              rectangleClassNameOverride="icons-pause-3"
            />
          </div>
        </div>
      </div>
    </div>
  );
};