/**
 * Utilitário para monitoramento de performance da aplicação.
 * Fornece métodos para marcar, medir e registrar métricas de performance.
 */
import logger from "./logger";

// Verifica se a API Performance está disponível no navegador
const isPerformanceSupported = () => {
  return (
    typeof window !== "undefined" &&
    typeof window.performance !== "undefined" &&
    typeof window.performance.mark === "function"
  );
};

/**
 * Utilitário de performance que encapsula a API Performance
 * com fallbacks para navegadores sem suporte
 */
const performance = {
  /**
   * Cria uma marca de tempo para medição posterior
   * @param {string} name - Nome da marca
   */
  mark: (name) => {
    if (isPerformanceSupported()) {
      window.performance.mark(name);
      logger.debug(`Performance mark: ${name}`);
    }
  },

  /**
   * Mede o tempo entre duas marcas
   * @param {string} name - Nome da medição
   * @param {string} startMark - Nome da marca inicial
   * @param {string} endMark - Nome da marca final
   */
  measure: (name, startMark, endMark) => {
    if (isPerformanceSupported()) {
      try {
        window.performance.measure(name, startMark, endMark);
        const measure = window.performance.getEntriesByName(name)[0];
        logger.debug(`Performance measure: ${name}`, {
          duration: `${measure.duration.toFixed(2)}ms`,
        });
      } catch (e) {
        logger.warn(`Falha ao medir performance: ${name}`, e);
      }
    }
  },

  /**
   * Mede o tempo entre duas marcas e registra no log
   * @param {string} name - Nome da medição
   * @param {string} startMark - Nome da marca inicial
   * @param {string} endMark - Nome da marca final
   */
  measureMarks: (name, startMark, endMark) => {
    if (isPerformanceSupported()) {
      try {
        window.performance.measure(name, startMark, endMark);
        const entries = window.performance.getEntriesByName(name);
        if (entries.length > 0) {
          const duration = entries[0].duration;
          logger.info(`${name}: ${duration.toFixed(2)}ms`);
        }
      } catch (e) {
        logger.warn(`Erro ao medir marcas: ${startMark} a ${endMark}`, e);
      }
    }
  },

  /**
   * Limpa todas as marcas e medições
   */
  clearMarks: () => {
    if (isPerformanceSupported()) {
      window.performance.clearMarks();
      window.performance.clearMeasures();
    }
  },

  /**
   * Callback para registro de métricas do Web Vitals
   * @param {Object} metric - Métrica do Web Vitals
   */
  logWebVitals: (metric) => {
    const { name, value, id } = metric;

    logger.info(`Web Vital: ${name}`, {
      value: Math.round(value),
      id,
      metric,
    });

    // Registrar métricas específicas com mais detalhes
    switch (name) {
      case "FCP":
        logger.info(`First Contentful Paint: ${Math.round(value)}ms`);
        break;
      case "LCP":
        logger.info(`Largest Contentful Paint: ${Math.round(value)}ms`);
        break;
      case "CLS":
        logger.info(`Cumulative Layout Shift: ${value.toFixed(3)}`);
        break;
      case "FID":
        logger.info(`First Input Delay: ${Math.round(value)}ms`);
        break;
      case "TTFB":
        logger.info(`Time to First Byte: ${Math.round(value)}ms`);
        break;
      default:
        break;
    }
  },

  /**
   * Mede o tempo de execução de uma função
   * @param {Function} fn - Função a ser medida
   * @param {string} name - Nome da medição
   * @returns {*} Resultado da função
   */
  measureFn: (fn, name) => {
    const start = performance.now();
    try {
      return fn();
    } finally {
      const duration = performance.now() - start;
      logger.debug(
        `Função ${name || fn.name || "anônima"} executada em ${duration.toFixed(
          2
        )}ms`
      );
    }
  },
};

export default performance;
