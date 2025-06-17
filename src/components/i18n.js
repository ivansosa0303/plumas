import i18next from 'i18next';

export const resources = {
  es: {
    translation: {
      saludo: 'Bienvenido a Plumas del Destino',
      pregunta: 'Haz tu pregunta al oráculo...',
      enviar: 'Preguntar',
      historial: 'Historial',
      limpiar: 'Limpiar historial',
      compartir: 'Compartir',
      tema: 'Cambiar tema',
      idioma: 'Idioma',
      respuesta: 'Respuesta',
      volver: 'Volver a preguntar',
      mensajeDia: 'Mensaje del día',
    }
  },
  en: {
    translation: {
      saludo: 'Welcome to Plumas del Destino',
      pregunta: 'Ask your question to the oracle...',
      enviar: 'Ask',
      historial: 'History',
      limpiar: 'Clear history',
      compartir: 'Share',
      tema: 'Change theme',
      idioma: 'Language',
      respuesta: 'Answer',
      volver: 'Ask again',
      mensajeDia: 'Message of the day',
    }
  }
};

export function initI18n(lang = 'es') {
  i18next.init({
    lng: lang,
    debug: false,
    resources
  });
}

export function changeLanguage(lang) {
  i18next.changeLanguage(lang);
  localStorage.setItem('lang', lang);
}

export function t(key) {
  return i18next.t(key);
}
