import React from "react";
import { IconsDots } from "../icons/IconsDots";
import { IconsSun } from "../icons/IconsSun";
import "../styles/EggsWeatherSunny.css";

export const EggsWeatherSunny = ({ 
  className, 
  iconsSunIconsSun,
  location = "KILAUEA, HI",
  condition = "PARTLY CLOUDY",
  temperature = "30°F"
}) => {
  return (
    <div className={`eggs-weather-sunny ${className || ""}`}>
      <div className="frame">
        <div className="frame-2">
          <div className="text-wrapper">{location}</div>
          <div className="text-wrapper-2">{condition}</div>
        </div>
        <div className="more-button">
          <IconsDots />
        </div>
      </div>
      <div className="frame-3">
        <div className="text-wrapper-3">{temperature}</div>
        <IconsSun className="icons-sun-instance" iconPath={iconsSunIconsSun} />
      </div>
    </div>
  );
};

export default EggsWeatherSunny;