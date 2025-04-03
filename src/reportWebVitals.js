import logger from "./utils/logger";

const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && typeof onPerfEntry === "function") {
    import("web-vitals")
      .then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(onPerfEntry);
        getFID(onPerfEntry);
        getFCP(onPerfEntry);
        getLCP(onPerfEntry);
        getTTFB(onPerfEntry);

        // Log básico da inicialização do Web Vitals
        logger.debug("Web Vitals inicializado");
      })
      .catch((error) => {
        // Log de erro caso o carregamento falhe
        logger.error("Falha ao carregar Web Vitals", error);
      });
  } else {
    logger.warn("reportWebVitals chamado sem callback válido");
  }
};

export default reportWebVitals;
