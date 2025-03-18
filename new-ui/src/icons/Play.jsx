import React from "react";

export const Play = ({ className, color = "black" }) => {
  return (
    <svg
      className={`icons-play ${className || ""}`}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 5.14V19.14L19 12.14L8 5.14Z"
        fill={color}
      />
    </svg>
  );
};

export default Play;