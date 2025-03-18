import React from "react";

export const Mic = ({ className }) => {
  return (
    <svg
      className={`icons-mic ${className || ""}`}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 14C13.66 14 15 12.66 15 11V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 12.66 10.34 14 12 14ZM11 5C11 4.45 11.45 4 12 4C12.55 4 13 4.45 13 5V11C13 11.55 12.55 12 12 12C11.45 12 11 11.55 11 11V5Z"
        fill="black"
      />
      <path
        d="M17 11C17 14.53 14.39 17.44 11 17.93V21H13V23H11H9V21H11V17.93C7.61 17.44 5 14.53 5 11H7C7 13.76 9.24 16 12 16C14.76 16 17 13.76 17 11H19C19 11.34 18.97 11.67 18.92 12H20.97C21.03 11.67 21.06 11.34 21.06 11C21 5.92 16.95 1.86 11.87 2C7.46 2.11 3.79 5.6 3.5 10H5.5C5.78 6.67 8.58 4 12 4C15.31 4 18 6.69 18 10V11H17Z"
        fill="black"
      />
    </svg>
  );
};

export default Mic;