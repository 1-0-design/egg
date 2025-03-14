import React from "react";

export const IconsSun = ({ className }) => {
  return (
    <div className={`icons-sun ${className || ""}`}>
      <div className="content">
        <div className="sun-circle"></div>
        <div className="sun-rays">
          {[...Array(8)].map((_, index) => (
            <div 
              key={index} 
              className="sun-ray" 
              style={{ transform: `rotate(${index * 45}deg)` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};