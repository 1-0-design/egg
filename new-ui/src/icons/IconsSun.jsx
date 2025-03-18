import React from "react";

export const IconsSun = ({ className, iconPath }) => {
  return (
    <div className={`${className || ""}`}>
      {iconPath ? (
        <img src={iconPath} alt="Sun icon" />
      ) : (
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M24 36C30.6274 36 36 30.6274 36 24C36 17.3726 30.6274 12 24 12C17.3726 12 12 17.3726 12 24C12 30.6274 17.3726 36 24 36Z"
            fill="#FFC700"
          />
          <path
            d="M24 8V2M24 46V40M36.8 11.2L40.8 7.2M7.2 40.8L11.2 36.8M40 24H46M2 24H8M36.8 36.8L40.8 40.8M7.2 7.2L11.2 11.2"
            stroke="#FFC700"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
};

export default IconsSun;