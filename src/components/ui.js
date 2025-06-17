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
    this.lang = 'es'; // Idioma por defecto
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

  /**
   * Renderiza el formulario de consulta al oráculo
   * @param {Function} onSubmit - Callback al enviar la pregunta
   */
  renderQuestionForm(onSubmit) {
    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
      mainContent.innerHTML = `
        <form id="oracleForm" class="space-y-6" role="form" aria-label="Formulario de consulta al oráculo">
          <label for="question" class="block text-lg font-medium text-slate-300 mb-2">¿Sobre qué quieres preguntar al oráculo?</label>
          <input id="question" name="question" type="text" required maxlength="200" class="w-full px-4 py-2 rounded bg-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Escribe tu pregunta aquí..." aria-required="true" aria-label="Pregunta al oráculo" />
          <button type="submit" class="mt-4 w-full py-2 px-4 rounded bg-indigo-700 hover:bg-indigo-800 text-white font-bold transition" aria-label="Consultar el oráculo">Consultar el oráculo</button>
        </form>
        <div id="oracleResponse" class="mt-8" role="region" aria-live="polite"></div>
      `;
      document.getElementById('oracleForm').onsubmit = (e) => {
        e.preventDefault();
        const question = document.getElementById('question').value;
        onSubmit(question);
      };
    }
  }

  /**
   * Muestra la respuesta del oráculo
   * @param {string} answer - Respuesta generada
   */
  showOracleResponse(answer) {
    const responseDiv = document.getElementById('oracleResponse');
    if (responseDiv) {
      responseDiv.innerHTML = `
        <div class="cosmic-card fade-in mt-6 text-center">
          <span class="block text-xl font-serif-display mb-2">Respuesta del oráculo:</span>
          <span class="block text-2xl text-indigo-200">${sanitizeInput(answer)}</span>
        </div>
      `;
    }
  }

  /**
   * Muestra animación de consulta
   */
  showOracleLoading() {
    const responseDiv = document.getElementById('oracleResponse');
    if (responseDiv) {
      responseDiv.innerHTML = `
        <div class="flex justify-center items-center mt-6">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-400"></div>
          <span class="ml-4 text-indigo-200">Consultando al oráculo...</span>
        </div>
      `;
    }
  }

  /**
   * Muestra el historial de preguntas y respuestas
   * @param {Array<{question: string, answer: string, date: string}>} history
   */
  showHistory(history) {
    const mainContent = document.getElementById('mainContent');
    if (!mainContent) return;
    let html = '';
    if (history.length > 0) {
      html += `<div class="mt-10">
        <h2 class="text-lg font-bold mb-4 text-slate-300">Historial de consultas</h2>
        <ul class="space-y-4">
          ${history.map(item => `
            <li class="cosmic-card text-left">
              <div class="text-sm text-slate-400 mb-1">${item.date}</div>
              <div><span class="font-semibold">Pregunta:</span> ${sanitizeInput(item.question)}</div>
              <div><span class="font-semibold">Respuesta:</span> <span class="text-indigo-200">${sanitizeInput(item.answer)}</span></div>
            </li>
          `).join('')}
        </ul>
      </div>`;
    }
    // Insertar después del formulario y respuesta
    const responseDiv = document.getElementById('oracleResponse');
    if (responseDiv) {
      responseDiv.insertAdjacentHTML('afterend', html);
    }
  }

  /**
   * Agrega un botón para volver a preguntar
   * @param {Function} onClick
   */
  addAskAgainButton(onClick) {
    const responseDiv = document.getElementById('oracleResponse');
    if (responseDiv && !document.getElementById('askAgainBtn')) {
      const btn = document.createElement('button');
      btn.id = 'askAgainBtn';
      btn.className = 'mt-6 w-full py-2 px-4 rounded bg-slate-700 hover:bg-indigo-700 text-white font-bold transition';
      btn.textContent = 'Volver a preguntar';
      btn.onclick = onClick;
      responseDiv.parentNode.insertBefore(btn, responseDiv.nextSibling);
    }
  }

  /**
   * Agrega botón para compartir la respuesta
   * @param {string} answer
   */
  addShareButton(answer) {
    const responseDiv = document.getElementById('oracleResponse');
    if (responseDiv && !document.getElementById('shareBtn')) {
      const btn = document.createElement('button');
      btn.id = 'shareBtn';
      btn.className = 'mt-4 w-full py-2 px-4 rounded bg-indigo-600 hover:bg-indigo-800 text-white font-bold transition';
      btn.textContent = 'Compartir respuesta';
      btn.onclick = () => {
        if (navigator.share) {
          navigator.share({
            title: 'Plumas del Destino',
            text: answer,
            url: window.location.href
          });
        } else {
          navigator.clipboard.writeText(answer);
          btn.textContent = '¡Copiado!';
          setTimeout(() => btn.textContent = 'Compartir respuesta', 1500);
        }
      };
      responseDiv.appendChild(btn);
    }
  }

  /**
   * Agrega botón para limpiar historial
   * @param {Function} onClick
   */
  addClearHistoryButton(onClick) {
    const mainContent = document.getElementById('mainContent');
    if (mainContent && !document.getElementById('clearHistoryBtn')) {
      const btn = document.createElement('button');
      btn.id = 'clearHistoryBtn';
      btn.className = 'mt-6 w-full py-2 px-4 rounded bg-red-700 hover:bg-red-800 text-white font-bold transition';
      btn.textContent = 'Limpiar historial';
      btn.onclick = onClick;
      mainContent.appendChild(btn);
    }
  }

  /**
   * Cambia el idioma de la interfaz
   * @param {string} lang - 'es' o 'en'
   */
  setLanguage(lang) {
    this.lang = lang;
    // Se puede expandir para traducir toda la UI
    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
      mainContent.querySelectorAll('label, button, h1, h2, .font-serif-display, .text-lg').forEach(el => {
        if (lang === 'en') {
          if (el.textContent.includes('¿Sobre qué quieres preguntar')) el.textContent = 'What do you want to ask the oracle?';
          if (el.textContent.includes('Consultar el oráculo')) el.textContent = 'Ask the Oracle';
          if (el.textContent.includes('Respuesta del oráculo:')) el.textContent = 'Oracle answer:';
          if (el.textContent.includes('Historial de consultas')) el.textContent = 'Consultation history';
          if (el.textContent.includes('Pregunta:')) el.textContent = 'Question:';
          if (el.textContent.includes('Respuesta:')) el.textContent = 'Answer:';
          if (el.textContent.includes('Volver a preguntar')) el.textContent = 'Ask again';
        } else {
          // Español por defecto
          if (el.textContent === 'What do you want to ask the oracle?') el.textContent = '¿Sobre qué quieres preguntar al oráculo?';
          if (el.textContent === 'Ask the Oracle') el.textContent = 'Consultar el oráculo';
          if (el.textContent === 'Oracle answer:') el.textContent = 'Respuesta del oráculo:';
          if (el.textContent === 'Consultation history') el.textContent = 'Historial de consultas';
          if (el.textContent === 'Question:') el.textContent = 'Pregunta:';
          if (el.textContent === 'Answer:') el.textContent = 'Respuesta:';
          if (el.textContent === 'Ask again') el.textContent = 'Volver a preguntar';
        }
      });
    }
  }

  /**
   * Aplica animación de entrada a un elemento
   * @param {HTMLElement} el
   */
  fadeIn(el) {
    if (el) {
      el.classList.add('fade-in');
      setTimeout(() => el.classList.remove('fade-in'), 600);
    }
  }
}
