// src/components/StatusBar.js
// Status bar component with time and account info

class StatusBar {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error('Status bar container not found:', containerId);
      return;
    }

    // Initialize the status bar
    this.addStyles();
    this.render();
    this.startClock();
  }

  addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .status-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 30px;
        padding: 30px;
        font-family: 'Cash Sans-Medium', Helvetica;
      }

      .status-bar-account {
        display: flex;
        align-items: center;
        gap: 15px;
      }

      .status-bar-account::before {
        content: '';
        width: 12px;
        height: 12px;
        background: hsl(142.1 76.2% 36.3%);
        border-radius: 100px;
      }

      .status-bar-time {
        font-family: 'Cash Sans-Semibold', Helvetica;
        font-size: 18px;
        text-align: right;
        color: hsl(var(--foreground));
      }
    `;
    document.head.appendChild(style);
  }

  render() {
    const html = `
      <div class="status-bar">
        <div class="status-bar-account">Guest</div>
        <div class="status-bar-time"></div>
      </div>
    `;
    this.container.innerHTML = html;
    this.timeElement = this.container.querySelector('.status-bar-time');
  }

  startClock() {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      if (this.timeElement) {
        this.timeElement.textContent = timeString;
      }
    };

    // Update immediately and then every minute
    updateTime();
    setInterval(updateTime, 60000);
  }

  setAccount(accountName) {
    const accountElement = this.container.querySelector('.status-bar-account');
    if (accountElement) {
      accountElement.textContent = accountName;
    }
  }
}

export default StatusBar;