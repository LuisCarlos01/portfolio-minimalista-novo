import styleChecker from './styleChecker';

/**
 * Classe para validar os estilos do projeto
 * Pode ser executada através de scripts npm ou durante o desenvolvimento
 */
class StyleValidator {
  constructor() {
    this.styleSheets = {};
    this.reactComponents = {};
    this.globalStyles = '';
  }

  /**
   * Registra um arquivo de estilo para verificação
   * @param {string} filename - Nome do arquivo
   * @param {string} content - Conteúdo do arquivo
   */
  registerStyleSheet(filename, content) {
    this.styleSheets[filename] = content;
  }

  /**
   * Registra um componente React para verificação
   * @param {string} filename - Nome do arquivo
   * @param {string} content - Conteúdo do arquivo
   */
  registerReactComponent(filename, content) {
    this.reactComponents[filename] = content;
  }

  /**
   * Define o conteúdo do CSS global
   * @param {string} content - Conteúdo do CSS global
   */
  setGlobalStyles(content) {
    this.globalStyles = content;
  }

  /**
   * Realiza a validação de estilos
   * @returns {Object} - Objeto com resultados da validação
   */
  validate() {
    const results = {
      duplicateSelectors: [],
      duplicateImports: [],
      componentStyleConflicts: []
    };

    // Verificar duplicação de seletores
    results.duplicateSelectors = styleChecker.checkForDuplicateSelectors(this.styleSheets);

    // Verificar importações duplicadas
    results.duplicateImports = styleChecker.checkForDuplicateImports(this.reactComponents);

    // Verificar conflitos entre componentes e estilos globais
    Object.entries(this.reactComponents).forEach(([filename, content]) => {
      const conflicts = styleChecker.checkComponentStyleConflicts(content, this.globalStyles);
      
      if (conflicts.length > 0) {
        results.componentStyleConflicts.push({
          filename,
          conflicts
        });
      }
    });

    return results;
  }

  /**
   * Imprime os resultados da validação
   * @param {Object} results - Resultados da validação
   */
  printResults(results) {
    console.log('\n=== VALIDAÇÃO DE ESTILOS ===\n');
    
    // Duplicação de seletores
    if (results.duplicateSelectors.length > 0) {
      console.log('🔴 SELETORES DUPLICADOS ENCONTRADOS:');
      results.duplicateSelectors.forEach(conflict => {
        console.log(`  - Seletor "${conflict.selector}" encontrado em:`);
        conflict.files.forEach(file => console.log(`    * ${file}`));
      });
      console.log();
    } else {
      console.log('✅ Nenhum seletor duplicado encontrado\n');
    }
    
    // Importações duplicadas
    if (results.duplicateImports.length > 0) {
      console.log('🔴 IMPORTAÇÕES CSS DUPLICADAS:');
      results.duplicateImports.forEach(duplicate => {
        console.log(`  - Arquivo "${duplicate.cssPath}" importado em:`);
        duplicate.files.forEach(file => console.log(`    * ${file}`));
      });
      console.log();
    } else {
      console.log('✅ Nenhuma importação CSS duplicada encontrada\n');
    }
    
    // Conflitos de estilo em componentes
    if (results.componentStyleConflicts.length > 0) {
      console.log('🟠 POSSÍVEIS CONFLITOS DE ESTILO EM COMPONENTES:');
      results.componentStyleConflicts.forEach(item => {
        console.log(`  - Arquivo "${item.filename}":`);
        item.conflicts.forEach(conflict => {
          console.log(`    * ${conflict.className}: ${conflict.type}`);
        });
      });
      console.log();
    } else {
      console.log('✅ Nenhum conflito de estilo em componentes encontrado\n');
    }
    
    console.log('=== FIM DA VALIDAÇÃO ===\n');
  }
  
  /**
   * Executa a validação e retorna um relatório
   * @returns {Object} - Resultados da validação
   */
  run() {
    const results = this.validate();
    this.printResults(results);
    return results;
  }
}

export default StyleValidator; 