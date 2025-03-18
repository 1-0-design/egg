import React from "react";

export const EggsWeatherSunny = ({ iconsSunIconsSun }) => {
  return (
    <div className="eggs-weather-sunny">
      <div className="frame">
        <div className="frame-2">
          <div className="text-wrapper">Sunny</div>
          <div className="text-wrapper-2">San Francisco</div>
        </div>
        <div className="more-button">
          <img className="more-icon" alt="More icon" src="/static/more-icon.svg" />
        </div>
      </div>
      <div className="frame-3">
        <div className="text-wrapper-3">72°</div>
        <img
          className="icons-sun-instance"
          alt="Sun icon"
          src={iconsSunIconsSun || "/static/sun-icon.svg"}
        />
      </div>
    </div>
  );
};