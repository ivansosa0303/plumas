import { openDB } from 'idb';

const DB_NAME = 'plumas-historial';
const STORE = 'consultas';

export async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
      }
    }
  });
}

export async function guardarConsulta(pregunta, respuesta) {
  const db = await getDB();
  await db.add(STORE, { pregunta, respuesta, fecha: new Date().toISOString() });
}

export async function obtenerHistorial() {
  const db = await getDB();
  return db.getAll(STORE);
}

export async function limpiarHistorial() {
  const db = await getDB();
  await db.clear(STORE);
}

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
