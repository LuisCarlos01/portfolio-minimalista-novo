/**
 * Script para verificar conflitos de estilo no projeto
 * Executado via: npm run check-styles
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Importar os utilitários de verificação de estilo
const styleChecker = require('../src/utils/styleChecker');

// Função para ler o conteúdo de um arquivo
const readFile = (filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Erro ao ler arquivo ${filePath}:`, error);
    return '';
  }
};

// Função para encontrar arquivos por padrão
const findFiles = (pattern, options = {}) => {
  return new Promise((resolve, reject) => {
    glob(pattern, options, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
};

// Função principal para verificar estilos
const checkStyles = async () => {
  console.log('\n=== INICIANDO VERIFICAÇÃO DE ESTILOS ===\n');

  try {
    // Coletar arquivos CSS
    const cssFiles = await findFiles('src/**/*.css');
    console.log(`Encontrados ${cssFiles.length} arquivos CSS`);

    // Coletar arquivos SCSS
    const scssFiles = await findFiles('src/**/*.scss');
    console.log(`Encontrados ${scssFiles.length} arquivos SCSS`);

    // Coletar arquivos JSX/JS com componentes React
    const reactFiles = await findFiles('src/**/*.{jsx,js}', {
      ignore: ['src/utils/**', 'src/services/**', 'node_modules/**']
    });
    console.log(`Encontrados ${reactFiles.length} arquivos de componentes React`);

    // Objeto para armazenar conteúdo dos arquivos CSS/SCSS
    const styleSheets = {};
    
    // Ler conteúdo dos arquivos CSS
    for (const file of cssFiles) {
      styleSheets[file] = readFile(file);
    }

    // Ler conteúdo dos arquivos SCSS
    for (const file of scssFiles) {
      styleSheets[file] = readFile(file);
    }

    // Objeto para armazenar conteúdo dos arquivos React
    const reactComponents = {};
    
    // Ler conteúdo dos arquivos React
    for (const file of reactFiles) {
      reactComponents[file] = readFile(file);
    }

    // Obter o conteúdo do CSS global (se existir)
    let globalCss = '';
    const globalCssPath = path.resolve(__dirname, '../src/styles/style.css');
    if (fs.existsSync(globalCssPath)) {
      globalCss = readFile(globalCssPath);
    }

    // Verificar seletores duplicados
    const duplicateSelectors = styleChecker.checkForDuplicateSelectors(styleSheets);
    
    // Verificar importações duplicadas
    const duplicateImports = styleChecker.checkForDuplicateImports(reactComponents);
    
    // Verificar conflitos entre componentes e estilos globais
    const componentConflicts = [];
    for (const [filename, content] of Object.entries(reactComponents)) {
      const conflicts = styleChecker.checkComponentStyleConflicts(content, globalCss);
      if (conflicts.length > 0) {
        componentConflicts.push({
          filename,
          conflicts
        });
      }
    }

    // Mostrar resultados
    console.log('\n=== RESULTADOS DA VERIFICAÇÃO ===\n');
    
    // Duplicação de seletores
    if (duplicateSelectors.length > 0) {
      console.log('🔴 SELETORES DUPLICADOS ENCONTRADOS:');
      duplicateSelectors.forEach(conflict => {
        console.log(`  - Seletor "${conflict.selector}" encontrado em:`);
        conflict.files.forEach(file => console.log(`    * ${file}`));
      });
      console.log();
    } else {
      console.log('✅ Nenhum seletor duplicado encontrado\n');
    }
    
    // Importações duplicadas
    if (duplicateImports.length > 0) {
      console.log('🔴 IMPORTAÇÕES CSS DUPLICADAS:');
      duplicateImports.forEach(duplicate => {
        console.log(`  - Arquivo "${duplicate.cssPath}" importado em:`);
        duplicate.files.forEach(file => console.log(`    * ${file}`));
      });
      console.log();
    } else {
      console.log('✅ Nenhuma importação CSS duplicada encontrada\n');
    }
    
    // Conflitos de estilo em componentes
    if (componentConflicts.length > 0) {
      console.log('🟠 POSSÍVEIS CONFLITOS DE ESTILO EM COMPONENTES:');
      componentConflicts.forEach(item => {
        console.log(`  - Arquivo "${item.filename}":`);
        item.conflicts.forEach(conflict => {
          console.log(`    * ${conflict.className}: ${conflict.type}`);
        });
      });
      console.log();
    } else {
      console.log('✅ Nenhum conflito de estilo em componentes encontrado\n');
    }

    // Resumo final
    const totalIssues = duplicateSelectors.length + duplicateImports.length + componentConflicts.length;
    if (totalIssues > 0) {
      console.log(`❌ Encontrados ${totalIssues} problemas de estilo no total`);
      process.exit(1); // Sair com código de erro
    } else {
      console.log('✅ Nenhum problema de estilo encontrado!');
      process.exit(0); // Sair com sucesso
    }

  } catch (error) {
    console.error('Erro durante a verificação de estilos:', error);
    process.exit(1);
  }
};

// Executar a verificação
checkStyles(); 