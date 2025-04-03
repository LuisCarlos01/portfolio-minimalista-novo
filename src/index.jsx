import React from "react";
import ReactDOM from "react-dom/client";
import "./styles"; // Importação centralizada de estilos
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import performance from "./utils/performance";
import logger from "./utils/logger";

// Configurar handler global para erros não capturados
window.addEventListener("error", (event) => {
  logger.error("Erro global não capturado", {
    message: event.message,
    source: event.filename,
    lineNo: event.lineno,
    colNo: event.colno,
    error: event.error,
  });

  // Não previne o comportamento padrão do navegador
  return false;
});

// Configurar handler para rejeições de promessas não tratadas
window.addEventListener("unhandledrejection", (event) => {
  logger.error("Promessa rejeitada não tratada", {
    reason: event.reason,
  });

  // Não previne o comportamento padrão do navegador
  return false;
});

// Marcar o início do carregamento da aplicação
performance.mark("app-mount-start");

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Marcar o fim do carregamento e medir o tempo total
performance.mark("app-mount-end");
performance.measureMarks("app-mount-total", "app-mount-start", "app-mount-end");

// Registrar as métricas de web vitals
reportWebVitals(performance.logWebVitals);
