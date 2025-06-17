# Desarrollo Actual de Plumas del Destino

## Resumen General

"Plumas del Destino" es una aplicación PWA de oráculo digital, modular, segura y moderna, diseñada para evolucionar progresivamente hacia una plataforma avanzada, autónoma y extensible. Este documento sirve como guía para cualquier IA o desarrollador que desee comprender, mantener o evolucionar el proyecto.

---

## Funcionalidades Actuales

### 1. Estructura y Modularización

- Código fuente organizado en `src/` y `components/`.
- Separación clara de lógica de UI, API y orquestación principal.
- Uso de Tailwind CSS y fuentes personalizadas para diseño visual atractivo.

### 2. PWA y Automatización

- Service Worker avanzado con Workbox (precaching, routing, fallback offline, recarga automática).
- `manifest.json` completo para instalación y experiencia nativa.
- Soporte offline robusto.
- Automatización de tareas de desarrollo y despliegue.

### 3. Funciones Básicas

- Formulario para preguntar al oráculo.
- Animación de carga y carta visual animada para mostrar respuestas.
- Respuestas inspiradoras aleatorias y personalizadas por palabras clave.
- Sanitización de entradas para seguridad.
- Diseño responsivo y visual atractivo.

### 4. Funciones Intermedias y Avanzadas

- Historial local de preguntas/respuestas (localStorage).
- Botón para volver a preguntar y limpiar historial.
- Modo oscuro/tema personalizable y botón de cambio.
- Soporte para varios idiomas (ES/EN) y botón de cambio.
- Animaciones y transiciones suaves (fade-in, carta animada).
- Botón para compartir respuesta (Web Share API o copiar).
- Accesibilidad básica (roles y ARIA).
- Notificación push local simulada tras cada consulta.
- Mensaje del día automático al abrir la app (solo una vez por día).

### 5. Automatización y Control

- Instalación y activación de extensiones recomendadas para desarrollo avanzado y automatización.
- Configuración avanzada de settings para máxima autonomía y control de Copilot y herramientas.
- Diagnóstico y corrección de entorno (incluyendo verificación de Node.js y dependencias).
- Push automático al repositorio de GitHub tras cada cambio relevante.

---

## Funcionalidades Planeadas / Pendientes

- Almacenamiento avanzado con IndexedDB (idb) para historial y sincronización robusta.
- Integración real con IA (GPT, Gemini, etc.) para respuestas profundas.
- Autenticación de usuario y sincronización en la nube.
- Panel de administración, estadísticas de uso, integración con calendario, soporte para cartas visuales avanzadas, modo “tirada múltiple”, pagos/donaciones, API pública, soporte para plugins/extensiones de la comunidad.
- Validación final de entorno y despliegue automático.

---

## Estructura de Archivos Clave

- `index.html` — Entrada principal y configuración PWA.
- `manifest.json` — Metadatos de la app.
- `service-worker.js` — Service Worker avanzado (Workbox).
- `src/main.js` — Orquestación principal.
- `src/styles.css` — Estilos personalizados.
- `src/components/ui.js` — Componentes de UI.
- `src/components/api.js` — Lógica de respuestas y API.
- `package.json` — Dependencias y scripts.
- `.vscode/settings.json` — Configuración avanzada de entorno.

---

## Notas para IA y Desarrolladores

- El proyecto está preparado para escalar a funciones avanzadas (IA, sincronización, pagos, API, etc.).
- Se prioriza la autonomía, automatización y buenas prácticas de seguridad y accesibilidad.
- Cualquier nueva función debe seguir la modularidad y estándares actuales.
- Consultar este archivo antes de realizar cambios mayores o integraciones avanzadas.

---

Última actualización: 17 de junio de 2025
