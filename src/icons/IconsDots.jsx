import React from "react";

export const IconsDots = ({ className }) => {
  return (
    <svg
      className={`${className || ""}`}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="2" fill="black" />
      <circle cx="6" cy="12" r="2" fill="black" />
      <circle cx="18" cy="12" r="2" fill="black" />
    </svg>
  );
};

export default IconsDots;