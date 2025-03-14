import React from "react";

export const Mic = ({ className }) => {
  return (
    <div className={`icons-mic ${className || ""}`}>
      <div className="content">
        <div className="overlap-group">
          <div className="mic-base"></div>
          <div className="mic-stand"></div>
          <div className="rectangle"></div>
        </div>
      </div>
    </div>
  );
};