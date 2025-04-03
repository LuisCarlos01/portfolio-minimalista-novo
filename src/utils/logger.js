/**
 * Utilitário de log para a aplicação.
 * Fornece métodos para registro de logs com diferentes níveis.
 */

// Verificar se estamos em ambiente de produção
const isProduction = process.env.NODE_ENV === "production";

// Configuração para desativar logs em produção
const DISABLE_LOGS_IN_PRODUCTION = true;

/**
 * Função para formatar a data e hora atual para logs
 * @returns {string} Data e hora formatadas
 */
const getTimeStamp = () => {
  const now = new Date();
  return now.toISOString();
};

/**
 * Adiciona um prefixo de timestamp e formata a mensagem de log
 * @param {string} level - Nível do log (info, warn, error, etc)
 * @param {string} message - Mensagem principal
 * @param {Object|undefined} data - Dados adicionais opcionais
 * @returns {Array} Array formatado para console.log
 */
const formatLog = (level, message, data) => {
  const timestamp = getTimeStamp();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

  if (data) {
    return [prefix, message, data];
  }

  return [prefix, message];
};

/**
 * Determina se o log deve ser exibido com base nas configurações
 * e no ambiente atual
 * @param {string} level - Nível do log
 * @returns {boolean} Se o log deve ser exibido
 */
const shouldLog = (level) => {
  // Em produção, podemos querer desativar logs menos importantes
  if (isProduction && DISABLE_LOGS_IN_PRODUCTION) {
    // Em produção mantemos apenas logs de erro
    return level === "error";
  }

  return true;
};

// API do logger
const logger = {
  debug: (message, data) => {
    if (shouldLog("debug")) {
      console.log(...formatLog("debug", message, data));
    }
  },

  info: (message, data) => {
    if (shouldLog("info")) {
      console.info(...formatLog("info", message, data));
    }
  },

  warn: (message, data) => {
    if (shouldLog("warn")) {
      console.warn(...formatLog("warn", message, data));
    }
  },

  error: (message, data) => {
    if (shouldLog("error")) {
      console.error(...formatLog("error", message, data));
    }
  },

  // Método de grupo para logs relacionados
  group: (label, callback) => {
    if (shouldLog("group")) {
      console.group(label);
      callback();
      console.groupEnd();
    }
  },
};

export default logger;
