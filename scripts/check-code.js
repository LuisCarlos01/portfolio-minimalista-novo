/**
 * Script para verificar conflitos de código no projeto
 * Executado via: npm run check-code
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const chalk = require('chalk');

// Função para ler o conteúdo de um arquivo
const readFile = (filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Erro ao ler arquivo ${filePath}:`, error);
    return '';
  }
};

// Função para verificar se um arquivo é um arquivo binário
// (evita processar imagens e outros arquivos não-texto)
const isBinaryFile = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  const binaryExtensions = [
    '.png', '.jpg', '.jpeg', '.gif', '.ico', '.webp', '.svg',
    '.pdf', '.zip', '.rar', '.gz', '.tar',
    '.mp3', '.mp4', '.wav', '.avi', '.mov',
    '.ttf', '.woff', '.woff2', '.eot'
  ];
  return binaryExtensions.includes(ext);
};

// Função para determinar o tipo de arquivo com base na extensão
const getFileType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  if (['.js', '.cjs', '.mjs'].includes(ext)) return 'js';
  if (ext === '.jsx') return 'jsx';
  if (ext === '.ts') return 'ts';
  if (ext === '.tsx') return 'tsx';
  if (ext === '.css') return 'css';
  if (ext === '.scss') return 'scss';
  if (ext === '.md') return 'md';
  if (ext === '.json') return 'json';
  if (ext === '.html') return 'html';
  return 'other';
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

// Função para listar todos os diretórios
const findDirectories = async () => {
  const files = await findFiles('**/*', {
    ignore: ['node_modules/**', 'build/**', 'dist/**', '.git/**'],
    nodir: false,
    dot: true
  });

  const dirs = new Set();
  files.forEach(file => {
    const dir = path.dirname(file);
    if (dir !== '.') {
      dirs.add(dir);
    }
  });

  return Array.from(dirs);
};

// Função para indexar um arquivo no registro
const indexFileInRegistry = async (CodeReviewer, filePath) => {
  if (isBinaryFile(filePath)) return;
  
  const content = readFile(filePath);
  const type = getFileType(filePath);
  
  CodeReviewer.registerFile(filePath, content, type);
};

// Função para indexar um diretório no registro
const indexDirectoryInRegistry = async (CodeReviewer, dirPath) => {
  const files = await findFiles(`${dirPath}/*`, {
    ignore: ['node_modules/**', 'build/**', 'dist/**', '.git/**'],
    nodir: true
  });
  
  CodeReviewer.registerDirectory(dirPath, files);
};

// Função para carregar o CodeReviewer
const loadCodeReviewer = async () => {
  try {
    // Importa o módulo codeReviewer de forma dinâmica para Node.js
    const codeReviewerPath = path.resolve(__dirname, '../src/utils/codeReviewer.js');
    let CodeReviewerClass;
    
    // Verifica se o arquivo existe
    if (fs.existsSync(codeReviewerPath)) {
      // Lê o conteúdo do arquivo
      const codeReviewerContent = readFile(codeReviewerPath);
      
      // Cria um arquivo temporário com CommonJS export
      const tempFilePath = path.resolve(__dirname, '.temp-code-reviewer.cjs');
      const commonJSContent = codeReviewerContent
        .replace(/export default CodeReviewer;/, 'module.exports = CodeReviewer;')
        .replace(/import styleChecker from ['"]\.\/styleChecker['"];/, 'const styleChecker = require("../src/utils/styleChecker-temp.cjs");');
      
      fs.writeFileSync(tempFilePath, commonJSContent);
      
      // Faz o mesmo para o styleChecker
      const styleCheckerPath = path.resolve(__dirname, '../src/utils/styleChecker.js');
      const styleCheckerContent = readFile(styleCheckerPath);
      const tempStyleCheckerPath = path.resolve(__dirname, '../src/utils/styleChecker-temp.cjs');
      
      const styleCheckerCommonJS = styleCheckerContent
        .replace(/export const/g, 'const')
        .replace(/export default styleChecker;/, 'module.exports = styleChecker;');
      
      fs.writeFileSync(tempStyleCheckerPath, styleCheckerCommonJS);
      
      // Importa o módulo temporário
      CodeReviewerClass = require(tempFilePath);
      
      // Limpa os arquivos temporários após o uso
      process.on('exit', () => {
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
        }
        if (fs.existsSync(tempStyleCheckerPath)) {
          fs.unlinkSync(tempStyleCheckerPath);
        }
      });
    } else {
      throw new Error(`Arquivo CodeReviewer não encontrado em ${codeReviewerPath}`);
    }
    
    return new CodeReviewerClass();
  } catch (error) {
    console.error('Erro ao carregar CodeReviewer:', error);
    process.exit(1);
  }
};

// Função principal para verificar o código
const checkCode = async () => {
  console.log(chalk.cyan('\n=== INICIANDO VERIFICAÇÃO DE CÓDIGO ===\n'));

  try {
    // Carregar o CodeReviewer
    const CodeReviewer = await loadCodeReviewer();
    
    // Indexar arquivos
    const allFiles = await findFiles('**/*', {
      ignore: ['node_modules/**', 'build/**', 'dist/**', '.git/**'],
      nodir: true
    });
    console.log(chalk.yellow(`Indexando ${allFiles.length} arquivos...`));
    
    for (const file of allFiles) {
      await indexFileInRegistry(CodeReviewer, file);
    }
    
    // Indexar diretórios
    const allDirs = await findDirectories();
    console.log(chalk.yellow(`Indexando ${allDirs.length} diretórios...`));
    
    for (const dir of allDirs) {
      await indexDirectoryInRegistry(CodeReviewer, dir);
    }
    
    // Executar verificação completa
    console.log(chalk.yellow('\nExecutando verificação completa...'));
    const results = CodeReviewer.runFullReview();
    
    // Mostrar resultados
    console.log(chalk.cyan('\n=== RESULTADOS DA VERIFICAÇÃO ===\n'));
    
    // Diretórios duplicados
    if (results.duplicateDirectories.length > 0) {
      console.log(chalk.red('\n🔴 DIRETÓRIOS COM NOMES SEMELHANTES:'));
      results.duplicateDirectories.forEach(item => {
        console.log(chalk.yellow(`  - Diretório "${item.baseName}" encontrado em:`));
        item.directories.forEach(dir => console.log(`    * ${dir}`));
      });
    } else {
      console.log(chalk.green('✅ Nenhum diretório com nome duplicado encontrado'));
    }
    
    // Arquivos com nomes duplicados
    if (results.duplicateFileNames.length > 0) {
      console.log(chalk.red('\n🔴 ARQUIVOS COM NOMES SEMELHANTES:'));
      results.duplicateFileNames.forEach(item => {
        console.log(chalk.yellow(`  - Arquivo "${item.baseName}" encontrado em:`));
        item.files.forEach(file => console.log(`    * ${file}`));
      });
    } else {
      console.log(chalk.green('✅ Nenhum arquivo com nome duplicado encontrado'));
    }
    
    // Conteúdo duplicado
    if (results.duplicateContent.length > 0) {
      console.log(chalk.red('\n🔴 ARQUIVOS COM CONTEÚDO SIMILAR:'));
      results.duplicateContent.forEach(item => {
        console.log(chalk.yellow(`  - Arquivos com conteúdo similar (começa com "${item.sampleContent.substring(0, 40)}..."):`));
        item.files.forEach(file => console.log(`    * ${file}`));
      });
    } else {
      console.log(chalk.green('✅ Nenhum arquivo com conteúdo duplicado encontrado'));
    }
    
    // Resumo final
    const totalIssues = 
      results.duplicateDirectories.length + 
      results.duplicateFileNames.length + 
      results.duplicateContent.length;
    
    console.log(chalk.cyan('\n=== RESUMO DA VERIFICAÇÃO ==='));
    
    if (totalIssues > 0) {
      console.log(chalk.red(`\n❌ Encontrados ${totalIssues} problemas no total`));
      process.exit(1); // Sair com código de erro
    } else {
      console.log(chalk.green('\n✅ Nenhum problema encontrado!'));
      process.exit(0); // Sair com sucesso
    }

  } catch (error) {
    console.error(chalk.red('Erro durante a verificação de código:'), error);
    process.exit(1);
  }
};

// Executar a verificação
checkCode(); 