import React from "react";

export const IconsPause = ({ 
  className, 
  contentClassName, 
  rectangleClassName, 
  rectangleClassNameOverride 
}) => {
  return (
    <div className={`icons-pause ${className || ""}`}>
      <div className={`content ${contentClassName || ""}`}>
        <div className={`rectangle-pause ${rectangleClassName || ""}`}></div>
        <div className={`rectangle-pause ${rectangleClassNameOverride || ""}`}></div>
      </div>
    </div>
  );
};