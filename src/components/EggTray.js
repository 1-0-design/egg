// src/components/EggTray.js
// Container for managing eggs with drag and drop support

class EggTray {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error('Egg tray container not found:', containerId);
      return;
    }

    this.eggs = new Map(); // Store active eggs
    this.setupDragAndDrop();
  }

  addEgg(egg) {
    // Create egg container
    const eggElement = document.createElement('div');
    eggElement.className = 'egg-container';
    eggElement.draggable = true;
    eggElement.dataset.eggId = egg.id;

    // Add hover controls
    const controls = document.createElement('div');
    controls.className = 'egg-controls';
    
    // Add button
    const addButton = document.createElement('button');
    addButton.className = 'egg-add-button';
    addButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    `;
    addButton.addEventListener('click', () => this.onAddEgg(egg));
    controls.appendChild(addButton);
    eggElement.appendChild(controls);

    // Initialize the egg
    egg.init(eggElement.id)
      .then(instance => {
        if (instance) {
          this.eggs.set(egg.id, {
            element: eggElement,
            instance: instance
          });
        }
      });

    this.container.appendChild(eggElement);
  }

  setupDragAndDrop() {
    this.container.addEventListener('dragstart', (e) => {
      const eggElement = e.target.closest('.egg-container');
      if (eggElement) {
        e.dataTransfer.setData('text/plain', eggElement.dataset.eggId);
        eggElement.classList.add('dragging');
      }
    });

    this.container.addEventListener('dragend', (e) => {
      const eggElement = e.target.closest('.egg-container');
      if (eggElement) {
        eggElement.classList.remove('dragging');
      }
    });

    // Handle dropping outside the tray
    document.addEventListener('dragover', (e) => {
      // Only allow dropping outside the tray
      if (!e.target.closest('#' + this.container.id)) {
        e.preventDefault();
      }
    });

    document.addEventListener('drop', (e) => {
      const eggId = e.dataTransfer.getData('text/plain');
      // Only handle drops outside the tray
      if (!e.target.closest('#' + this.container.id)) {
        e.preventDefault();
        this.removeEgg(eggId);
      }
    });
  }

  removeEgg(eggId) {
    const egg = this.eggs.get(eggId);
    if (egg) {
      egg.element.remove();
      this.eggs.delete(eggId);
    }
  }

  onAddEgg(egg) {
    // Override this method to handle adding new eggs
    console.log('Add egg clicked:', egg.id);
  }
}

export default EggTray;