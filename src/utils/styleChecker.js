/**
 * Utilitário para verificar conflitos de estilo no projeto
 * Este script pode ser executado para detectar possíveis conflitos de estilo CSS
 */

/**
 * Verifica duplicação de seletores CSS em diferentes arquivos
 * @param {Object} styleSheets - Um objeto com arquivos de estilo e seus conteúdos
 * @returns {Array} - Array de conflitos encontrados
 */
export const checkForDuplicateSelectors = (styleSheets) => {
  const selectorMap = {};
  const conflicts = [];

  Object.entries(styleSheets).forEach(([filename, content]) => {
    // Extrair seletores CSS usando expressões regulares simples
    // Nota: Este é um parser CSS muito básico e não lida com todos os casos
    const matches = content.match(/([a-zA-Z0-9_.-][^{]*)\s*{/g) || [];
    
    matches.forEach(match => {
      // Limpar o seletor
      const selector = match.replace('{', '').trim();
      
      if (selectorMap[selector]) {
        selectorMap[selector].push(filename);
        
        // Verificar se este é o primeiro conflito para este seletor
        if (selectorMap[selector].length === 2) {
          conflicts.push({
            selector,
            files: [...selectorMap[selector]]
          });
        }
      } else {
        selectorMap[selector] = [filename];
      }
    });
  });

  return conflicts;
};

/**
 * Verifica se há importações CSS duplicadas em arquivos React
 * @param {Object} reactFiles - Um objeto com arquivos React e seus conteúdos
 * @returns {Array} - Array de importações duplicadas encontradas
 */
export const checkForDuplicateImports = (reactFiles) => {
  const importMap = {};
  const duplicates = [];

  Object.entries(reactFiles).forEach(([filename, content]) => {
    // Extrair importações CSS
    const cssImports = content.match(/import\s+['"](.+\.css)['"]/g) || [];
    
    cssImports.forEach(importStmt => {
      // Extrair o caminho do arquivo
      const match = importStmt.match(/import\s+['"](.+\.css)['"]/);
      if (match && match[1]) {
        const cssPath = match[1];
        
        if (importMap[cssPath]) {
          importMap[cssPath].push(filename);
          
          // Verificar se é a primeira duplicação para este caminho
          if (importMap[cssPath].length === 2) {
            duplicates.push({
              cssPath,
              files: [...importMap[cssPath]]
            });
          }
        } else {
          importMap[cssPath] = [filename];
        }
      }
    });
  });

  return duplicates;
};

/**
 * Escaneia os estilos em um componente React para verificar possíveis conflitos com os estilos globais
 * @param {string} componentContent - O conteúdo do componente React
 * @param {string} globalCss - O conteúdo do CSS global
 * @returns {Array} - Array de possíveis conflitos
 */
export const checkComponentStyleConflicts = (componentContent, globalCss) => {
  const conflicts = [];
  
  // Extrair estilos inline (objetos de estilo React)
  const styleObjects = componentContent.match(/const\s+styles\s*=\s*{[^}]*}/gs) || [];
  
  if (styleObjects.length === 0) return conflicts;
  
  // Para cada objeto de estilo, extrair as propriedades
  styleObjects.forEach(styleObj => {
    // Extrair nomes de classes do objeto de estilo
    const classMatches = styleObj.match(/([a-zA-Z0-9_]+):\s*{/g) || [];
    
    classMatches.forEach(classMatch => {
      const className = classMatch.replace(':', '').trim();
      
      // Verificar se essa classe existe no CSS global
      const globalClassRegex = new RegExp(`\\.${className}\\s*{`, 'g');
      
      if (globalCss.match(globalClassRegex)) {
        conflicts.push({
          className,
          type: 'Possível conflito entre estilo inline e CSS global'
        });
      }
    });
  });
  
  return conflicts;
};

/**
 * Exporta um objeto com todas as funções de verificação de estilo
 */
const styleChecker = {
  checkForDuplicateSelectors,
  checkForDuplicateImports,
  checkComponentStyleConflicts
};

export default styleChecker; 