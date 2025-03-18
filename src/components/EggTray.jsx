import React from "react";
import { EggsMusic } from "./EggsMusic";
import { EggsWeatherSunny } from "./EggsWeatherSunny";
import { Mic } from "./Mic";
import image1 from "../assets/image.png";

export const EggTray = () => {
  return (
    <div className="egg-tray">
      <div className="frame-7">
        <div className="text-wrapper-6">ask for anything</div>

        <div className="more-button-wrapper">
          <div className="icons-mic-wrapper">
            <Mic className="icons-mic" />
          </div>
        </div>

        <button className="div-wrapper">
          <button className="button">
            <div className="text-wrapper-7">send</div>
          </button>
        </button>
      </div>

      <div className="frame-8">
        <div className="frame-9">
          <img className="image" alt="Image" src={image1} />

          <div className="text-wrapper-8">Robert Andersen</div>
        </div>

        <div className="rectangle-wrapper">
          <div className="rectangle-6" />
        </div>

        <div className="frame-9">
          <div className="text-wrapper-9">9:28 PM</div>

          <div className="ellipse" />
        </div>
      </div>

      <div className="frame-10">
        <EggsWeatherSunny iconsSunIconsSun="sun-3.svg" />
        <EggsMusic
          albumArtwork="album-artwork-2.png"
          className="eggs-music-instance"
        />
      </div>
    </div>
  );
};