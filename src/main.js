import { API } from './components/api.js';
import { UI } from './components/ui.js';

// Respuestas inspiradoras del oráculo
const ORACLE_ANSWERS = [
  "Confía en tu intuición, la respuesta está en tu interior.",
  "El universo conspira a tu favor, pero debes dar el primer paso.",
  "La paciencia traerá claridad a tu camino.",
  "No temas a los cambios, son parte de tu evolución.",
  "La respuesta llegará cuando estés listo para escucharla.",
  "Suelta el control y permite que la vida te sorprenda.",
  "La gratitud abrirá nuevas puertas para ti.",
  "Escucha el silencio, ahí está la verdad.",
  "Hoy es un buen día para confiar en ti mismo.",
  "El destino se escribe con cada decisión que tomas."
];

// Respuestas personalizadas por palabras clave
const KEYWORD_ANSWERS = [
  { keyword: 'amor', answer: 'El amor florece cuando te permites ser vulnerable.' },
  { keyword: 'trabajo', answer: 'La dedicación y la pasión abrirán nuevas oportunidades laborales.' },
  { keyword: 'salud', answer: 'Escucha a tu cuerpo, el equilibrio es la clave para tu bienestar.' },
  { keyword: 'dinero', answer: 'La abundancia llega cuando actúas con generosidad y prudencia.' },
  { keyword: 'familia', answer: 'El apoyo de tus seres queridos será fundamental en este ciclo.' },
  { keyword: 'amistad', answer: 'Las amistades sinceras se fortalecen en los momentos de cambio.' }
];

// Utilidad para manejar historial en localStorage
function getHistory() {
  return JSON.parse(localStorage.getItem('oracleHistory') || '[]');
}
function addToHistory(question, answer) {
  const history = getHistory();
  const date = new Date().toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' });
  history.unshift({ question, answer, date });
  localStorage.setItem('oracleHistory', JSON.stringify(history.slice(0, 20)));
}

// Initialize the application
class App {
  constructor() {
    this.ui = new UI();
    this.api = new API();
    this.initialize();
  }

  async initialize() {
    this.ui.init();
    this.addThemeToggle();
    this.addLanguageToggle();
    this.ui.renderQuestionForm(this.handleOracleQuestion.bind(this));
    this.showHistory();
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        console.log('ServiceWorker registration successful:', registration);
      } catch (error) {
        console.error('ServiceWorker registration failed:', error);
      }
    }
    this.setupEventListeners();
  }

  addThemeToggle() {
    if (!document.getElementById('themeToggle')) {
      const btn = document.createElement('button');
      btn.id = 'themeToggle';
      btn.className = 'toggle-theme';
      btn.textContent = '🌙/☀️';
      btn.onclick = () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
      };
      document.body.appendChild(btn);
      // Estado inicial
      if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
      }
    }
  }

  addLanguageToggle() {
    if (!document.getElementById('langToggle')) {
      const btn = document.createElement('button');
      btn.id = 'langToggle';
      btn.className = 'toggle-theme';
      btn.style.top = '4rem';
      btn.textContent = 'ES/EN';
      btn.onclick = () => {
        const newLang = this.ui.lang === 'en' ? 'es' : 'en';
        this.ui.setLanguage(newLang);
        localStorage.setItem('lang', newLang);
      };
      document.body.appendChild(btn);
      // Estado inicial
      const lang = localStorage.getItem('lang') || 'es';
      this.ui.setLanguage(lang);
    }
  }

  handleOracleQuestion(question) {
    this.ui.showOracleLoading();
    setTimeout(() => {
      let answer = this.getPersonalizedAnswer(question);
      this.ui.showOracleResponse(answer);
      addToHistory(question, answer);
      this.showHistory();
      this.ui.addAskAgainButton(() => {
        this.ui.renderQuestionForm(this.handleOracleQuestion.bind(this));
        this.showHistory();
      });
      this.ui.addShareButton(answer);
      this.ui.fadeIn(document.getElementById('oracleResponse'));
      this.ui.fadeIn(document.querySelector('#mainContent .mt-10'));
      // Notificación push local simulada
      if (window.Notification && Notification.permission === 'granted') {
        new Notification('Plumas del Destino', { body: answer });
      } else if (window.Notification && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }, 1500);
  }

  getPersonalizedAnswer(question) {
    const lower = question.toLowerCase();
    const found = KEYWORD_ANSWERS.find(item => lower.includes(item.keyword));
    if (found) return found.answer;
    return ORACLE_ANSWERS[Math.floor(Math.random() * ORACLE_ANSWERS.length)];
  }

  showHistory() {
    const old = document.querySelector('#mainContent .mt-10');
    if (old) old.remove();
    this.ui.showHistory(getHistory());
    this.ui.addClearHistoryButton(() => {
      localStorage.removeItem('oracleHistory');
      this.showHistory();
    });
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
