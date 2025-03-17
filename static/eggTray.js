// Debug version with inline styles
document.addEventListener('DOMContentLoaded', function() {
  console.log('eggTray.js loaded!');
  
  // Create style element for fallback CSS
  const style = document.createElement('style');
  style.innerHTML = `
    /* Fallback styles if CSS file isn't loaded */
    .egg-tray {
      align-items: center;
      background-color: rgba(255, 255, 255, 0.3);
      border-radius: 60px 60px 0px 0px;
      display: flex;
      flex-direction: column;
      gap: 15px;
      padding: 30px;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      z-index: 9999;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    }
    
    /* Basic layout styles for the tray */
    .frame-7 {
      display: flex;
      align-items: center;
      width: 100%;
      background: white;
      border-radius: 100px;
      padding: 10px 20px;
      margin-bottom: 15px;
    }
    
    .frame-8 {
      display: flex;
      justify-content: space-between;
      width: 100%;
      margin: 10px 0;
    }
    
    .frame-9 {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .frame-10 {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }
    
    .eggs-weather-sunny, .eggs-music {
      background: white;
      padding: 15px;
      border-radius: 15px;
      min-width: 200px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  `;
  document.head.appendChild(style);
  
  // Get or create the egg tray container
  let eggTrayContainer = document.getElementById('egg-tray');
  
  if (!eggTrayContainer) {
    console.log('Creating egg tray container');
    eggTrayContainer = document.createElement('div');
    eggTrayContainer.id = 'egg-tray';
    eggTrayContainer.className = 'egg-tray';
    document.body.appendChild(eggTrayContainer);
  }
  
  console.log('Egg tray container:', eggTrayContainer);
  
  eggTrayContainer.innerHTML = `
    <div class="frame-7">
      <div class="text-wrapper-6" style="flex: 1;">ask for anything</div>

      <div class="more-button-wrapper" style="background: #f5f5f5; border-radius: 50%; padding: 8px; margin-right: 10px;">
        <div class="icons-mic-wrapper">
          <svg class="icons-mic" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 14C13.66 14 15 12.66 15 11V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 12.66 10.34 14 12 14Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M19 11C19 15.4183 15.8519 18 12 18C8.14806 18 5 15.4183 5 11" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 18V22" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>

      <button class="div-wrapper" style="background: #f5f5f5; border-radius: 100px; border: none; padding: 0;">
        <button class="button" style="border: none; background: transparent; padding: 10px 15px;">
          <div class="text-wrapper-7">send</div>
        </button>
      </button>
    </div>

    <div class="frame-8">
      <div class="frame-9">
        <img class="image" alt="Image" src="/static/profile.svg" style="width: 24px; height: 24px; border-radius: 50%;" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22 viewBox=%220 0 24 24%22 fill=%22%23ccc%22><circle cx=%2212%22 cy=%2212%22 r=%2212%22/></svg>'" />
        <div class="text-wrapper-8" style="font-weight: bold;">Robert Andersen</div>
      </div>

      <div class="rectangle-wrapper" style="display: flex; justify-content: center; align-items: center;">
        <div class="rectangle-6" style="width: 50px; height: 5px; background: #000; border-radius: 5px;"></div>
      </div>

      <div class="frame-9">
        <div class="text-wrapper-9" id="time-display" style="text-align: right;">9:28 PM</div>
        <div class="ellipse" style="width: 12px; height: 12px; background: #0fea21; border-radius: 50%;"></div>
      </div>
    </div>

    <div class="frame-10">
      <!-- Weather Widget -->
      <div class="eggs-weather-sunny">
        <div class="frame" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <div class="frame-2">
            <div class="text-wrapper" style="font-weight: bold;">Sunny</div>
            <div class="text-wrapper-2">San Francisco</div>
          </div>
          <div class="more-button" style="border-radius: 50%;">
            <img class="more-icon" alt="More icon" src="/static/more-icon.svg" style="width: 24px; height: 24px;" />
          </div>
        </div>
        <div class="frame-3" style="display: flex; justify-content: space-between; align-items: center;">
          <div class="text-wrapper-3" style="font-size: 24px; font-weight: bold;">72°</div>
          <img class="icons-sun-instance" alt="Sun icon" src="/static/sun-icon.svg" style="width: 40px; height: 40px;" />
        </div>
      </div>

      <!-- Music Widget -->
      <div class="eggs-music">
        <div class="overlap-group">
          <div class="frame" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <div class="frame-2">
              <div class="text-wrapper" style="font-weight: bold;">Now Playing</div>
              <div class="text-wrapper-2">Taylor Swift - Cruel Summer</div>
            </div>
            <div class="more-button" style="border-radius: 50%;">
              <img class="more-icon" alt="More icon" src="/static/more-icon.svg" style="width: 24px; height: 24px;" />
            </div>
          </div>
          <div class="frame-3" style="display: flex; align-items: center; gap: 10px;">
            <img class="album-artwork" alt="Album artwork" src="/static/default-album.svg" style="width: 48px; height: 48px; border-radius: 4px;" />
            <div class="timeline" style="flex: 1; height: 5px; background: #eee; border-radius: 5px;">
              <div class="rectangle-5" style="width: 30%; height: 100%; background: #000; border-radius: 5px;"></div>
            </div>
            <div class="pause-button" style="width: 32px; height: 32px; background: #000; border-radius: 50%; display: flex; justify-content: center; align-items: center;">
              <div class="play-icon" style="width: 0; height: 0; border-style: solid; border-width: 8px 0 8px 12px; border-color: transparent transparent transparent white;"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Update the time
  updateTime();
  setInterval(updateTime, 60000); // Update every minute
  
  // Add a click event to show it's working
  eggTrayContainer.addEventListener('click', function(e) {
    console.log('Egg tray clicked!', e.target);
  });
  
  function updateTime() {
    const timeDisplay = document.getElementById('time-display');
    if (timeDisplay) {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
      
      timeDisplay.textContent = `${formattedHours}:${formattedMinutes} ${ampm}`;
    }
  }
});