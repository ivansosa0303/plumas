/**
 * Utility function to sanitize user input and prevent XSS attacks
 * @param {string} text - The input text to sanitize
 * @returns {string} - The sanitized text
 */
export function sanitizeInput(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Creates and manages all DOM operations for the application
 */
export class UI {
  constructor() {
    this.root = document.getElementById('root');
  }

  /**
   * Initialize the UI components
   */
  init() {
    this.createMainLayout();
  }

  /**
   * Creates the main layout structure
   */
  createMainLayout() {
    this.root.innerHTML = `
      <div class="container mx-auto px-4 py-8">
        <header class="text-center mb-12">
          <h1 class="font-serif-display text-4xl md:text-6xl mb-4 text-slate-100">
            Plumas del Destino
          </h1>
          <p class="text-lg text-slate-300">
            Un oráculo para guiar tu camino
          </p>
        </header>
        <main id="mainContent" class="max-w-2xl mx-auto">
          <!-- Dynamic content will be inserted here -->
        </main>
      </div>
    `;
  }

  /**
   * Updates any element's content safely
   * @param {string} elementId - The ID of the element to update 
   * @param {string} content - The content to insert
   */
  updateContent(elementId, content) {
    const element = document.getElementById(elementId);
    if (element) {
      element.innerHTML = sanitizeInput(content);
    }
  }

  /**
   * Shows a loading state
   */
  showLoading() {
    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
      mainContent.innerHTML = `
        <div class="flex justify-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-200"></div>
        </div>
      `;
    }
  }

  /**
   * Shows an error message
   * @param {string} message - The error message to display
   */
  showError(message) {
    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
      mainContent.innerHTML = `
        <div class="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded">
          ${sanitizeInput(message)}
        </div>
      `;
    }
  }
}
