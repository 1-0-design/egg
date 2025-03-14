import React from "react";

export const Play = ({ className, color }) => {
  return (
    <div className={`play-icon ${className || ""}`}>
      <div className="content">
        <div 
          className="play-triangle" 
          style={{ borderLeftColor: color || "#000000" }}
        ></div>
      </div>
    </div>
  );
};