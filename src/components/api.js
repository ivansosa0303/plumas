/**
 * Base API class for handling all backend communications
 */
export class API {
  constructor() {
    this.baseUrl = '/api'; // Will be configured when we have a backend
  }

  /**
   * Handles API errors uniformly
   * @param {Error} error - The error to handle
   * @throws {Error} - Rethrows the error with additional context
   */
  handleError(error) {
    console.error('API Error:', error);
    throw new Error(`Error en la comunicación con el servidor: ${error.message}`);
  }

  /**
   * Makes a GET request to the API
   * @param {string} endpoint - The API endpoint to call
   * @returns {Promise<any>} - The API response
   */
  async get(endpoint) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Makes a POST request to the API
   * @param {string} endpoint - The API endpoint to call
   * @param {object} data - The data to send
   * @returns {Promise<any>} - The API response
   */
  async post(endpoint, data) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      this.handleError(error);
    }
  }
}
