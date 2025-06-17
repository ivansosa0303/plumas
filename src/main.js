import { UI } from './components/ui.js';
import { API } from './components/api.js';

// Initialize the application
class App {
  constructor() {
    this.ui = new UI();
    this.api = new API();
    this.initialize();
  }

  async initialize() {
    // Initialize UI
    this.ui.init();

    // Register service worker
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        console.log('ServiceWorker registration successful:', registration);
      } catch (error) {
        console.error('ServiceWorker registration failed:', error);
      }
    }

    // Set up event listeners
    this.setupEventListeners();
  }

  setupEventListeners() {
    window.addEventListener('online', () => {
      console.log('App is online');
      // Add online functionality here
    });

    window.addEventListener('offline', () => {
      console.log('App is offline');
      // Add offline functionality here
    });

    // Add more event listeners as needed
  }
}

// Start the application when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
