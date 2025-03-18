// Morphing animation styles
.morph-animation {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.song-suggestion {
  transform-origin: center;
  transition: all 0.3s ease-out;
}

.song-suggestion.fade-out {
  opacity: 0;
  transform: scale(0.95);
}

.morph-to-egg {
  position: fixed;
  z-index: 1000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.egg-morphing {
  opacity: 0;
  transform: scale(0.95);
  transition: all 0.3s ease-out;
}

// Animation functions
async function morphSuggestionToEgg(suggestionEl, suggestionData) {
  // Get dimensions and position
  const suggestionRect = suggestionEl.getBoundingClientRect();
  
  // Create temporary egg element
  const eggElement = createMusicEgg(suggestionData);
  eggElement.style.position = 'fixed';
  eggElement.style.top = `${suggestionRect.top}px`;
  eggElement.style.left = `${suggestionRect.left}px`;
  eggElement.style.width = `${suggestionRect.width}px`;
  eggElement.style.height = `${suggestionRect.height}px`;
  eggElement.style.opacity = '0';
  eggElement.classList.add('morph-to-egg', 'morph-animation');
  
  // Add to document
  document.body.appendChild(eggElement);
  
  // Get egg tray for final position
  const eggTray = document.querySelector('.egg-collection');
  const trayRect = eggTray.getBoundingClientRect();
  
  // Start the animation
  suggestionEl.classList.add('fade-out');
  
  // Allow DOM to update
  await new Promise(resolve => requestAnimationFrame(resolve));
  
  // Animate to egg shape and position
  eggElement.style.opacity = '1';
  eggElement.style.transform = `
    translate(${trayRect.left - suggestionRect.left}px,
             ${trayRect.top - suggestionRect.top}px)
  `;
  eggElement.style.width = '320px';
  eggElement.style.height = '200px';
  
  // Complete transition
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Clean up and finalize
  suggestionEl.remove();
  
  // Handle existing egg if any
  if (state.activeMusicEgg) {
    state.activeMusicEgg.classList.add('egg-morphing');
    await new Promise(resolve => setTimeout(resolve, 300));
    state.activeMusicEgg.remove();
  }
  
  // Place egg in final position
  eggElement.style.position = '';
  eggElement.style.top = '';
  eggElement.style.left = '';
  eggElement.style.transform = '';
  eggElement.style.opacity = '';
  eggElement.classList.remove('morph-to-egg', 'morph-animation');
  
  eggTray.innerHTML = '';
  eggTray.appendChild(eggElement);
  
  // Update state and start playing
  state.activeMusicEgg = eggElement;
  toggleMusic(suggestionData.previewUrl);
}

async function handleSuggestionClick(event, suggestionData) {
  event.preventDefault();
  const suggestionEl = event.currentTarget.closest('.song-suggestion');
  await morphSuggestionToEgg(suggestionEl, suggestionData);
}