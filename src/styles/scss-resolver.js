/**
 * Resolvedor de importações SCSS para evitar problemas com o resolve-url-loader
 */
module.exports = {
  // Esta função é chamada quando um import é encontrado nos arquivos SCSS
  // e converte URLs relativas para absolutas
  resolve: function(url, prev) {
    if (url[0] === '~') {
      url = url.substr(1);
    }
    return { file: url };
  }
}; 