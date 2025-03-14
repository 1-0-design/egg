import React from "react";
import { IconsDots } from "../../icons/IconsDots";
import { IconsSun } from "../../icons/IconsSun";

export const EggsWeatherSunny = ({ className }) => {
  return (
    <div className={`eggs-weather-sunny ${className || ""}`}>
      <div className="frame">
        <div className="frame-2">
          <div className="text-wrapper">KILAUEA, HI</div>
          <div className="text-wrapper-2">PARTLY CLOUDY</div>
        </div>
        <div className="more-button">
          <IconsDots />
        </div>
      </div>
      <div className="frame-3">
        <div className="text-wrapper-3">30° F</div>
        <IconsSun className="icons-sun-instance" />
      </div>
    </div>
  );
};