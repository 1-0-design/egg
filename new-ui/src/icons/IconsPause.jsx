import React from "react";
import "../styles/IconsPause.css";

export const IconsPause = ({ className, rectangleClassName, rectangleClassNameOverride }) => {
  return (
    <div className={`icons-pause ${className}`}>
      <div className={`rectangle-4 ${rectangleClassName}`} />
      <div className={`rectangle-5 ${rectangleClassNameOverride}`} />
    </div>
  );
};

export default IconsPause;