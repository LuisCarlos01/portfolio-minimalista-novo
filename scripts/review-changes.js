/**
 * Script para revisar automaticamente arquivos modificados
 * Executado via: npm run review-changes
 * 
 * Este script pode ser utilizado antes de fazer commit em um repositório git,
 * para validar se os arquivos modificados não causam conflitos com outros existentes.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const chalk = require('chalk');
const { execSync } = require('child_process');

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

// Função para obter arquivos modificados (git status)
const getModifiedFiles = () => {
  try {
    const gitOutput = execSync('git status --porcelain').toString();
    return gitOutput
      .split('\n')
      .filter(Boolean)
      .map(line => {
        // Extrai o nome do arquivo do output do git status
        const match = line.match(/^[ MARCD][ MARCD] (.+)$/);
        if (match && match[1]) {
          return match[1];
        }
        
        // Caso especial para arquivos renomeados
        const renamedMatch = line.match(/^R[ MARCD] (.+) -> (.+)$/);
        if (renamedMatch && renamedMatch[2]) {
          return renamedMatch[2]; // Retorna o novo nome
        }
        
        return null;
      })
      .filter(Boolean); // Remove valores nulos
  } catch (error) {
    console.error('Erro ao obter arquivos modificados:', error);
    return [];
  }
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

// Função para indexar o projeto no CodeReviewer
const indexProject = async (CodeReviewer) => {
  // Indexar arquivos (exceto os modificados, que serão verificados separadamente)
  const allFiles = await findFiles('**/*', {
    ignore: ['node_modules/**', 'build/**', 'dist/**', '.git/**'],
    nodir: true
  });
  
  // Obter arquivos modificados para excluí-los da indexação inicial
  const modifiedFiles = getModifiedFiles();
  const filesToIndex = allFiles.filter(file => !modifiedFiles.includes(file));
  
  console.log(chalk.yellow(`Indexando ${filesToIndex.length} arquivos existentes...`));
  
  for (const file of filesToIndex) {
    if (!isBinaryFile(file)) {
      const content = readFile(file);
      const type = getFileType(file);
      CodeReviewer.registerFile(file, content, type);
    }
  }
  
  // Indexar diretórios
  const dirsSet = new Set();
  allFiles.forEach(file => {
    const dir = path.dirname(file);
    if (dir !== '.') dirsSet.add(dir);
  });
  const allDirs = Array.from(dirsSet);
  
  console.log(chalk.yellow(`Indexando ${allDirs.length} diretórios existentes...`));
  
  for (const dir of allDirs) {
    const files = await findFiles(`${dir}/*`, {
      ignore: ['node_modules/**', 'build/**', 'dist/**', '.git/**'],
      nodir: true
    });
    CodeReviewer.registerDirectory(dir, files);
  }
};

// Função principal para revisar mudanças
const reviewChanges = async () => {
  console.log(chalk.cyan('\n=== INICIANDO REVISÃO DE MUDANÇAS ===\n'));

  try {
    // Carregar o CodeReviewer
    const CodeReviewer = await loadCodeReviewer();
    
    // Indexar o projeto existente
    await indexProject(CodeReviewer);
    
    // Obter arquivos modificados
    const modifiedFiles = getModifiedFiles();
    console.log(chalk.yellow(`Encontrados ${modifiedFiles.length} arquivos modificados para revisar`));
    
    if (modifiedFiles.length === 0) {
      console.log(chalk.green('\nNenhum arquivo modificado para revisar.'));
      process.exit(0);
    }
    
    // Verificar cada arquivo modificado
    let totalIssues = 0;
    
    for (const file of modifiedFiles) {
      // Verificar se o arquivo está no .gitignore ou é binário
      if (isBinaryFile(file)) {
        console.log(chalk.gray(`Pulando arquivo binário: ${file}`));
        continue;
      }
      
      console.log(chalk.yellow(`\nVerificando: ${file}`));
      
      if (!fs.existsSync(file)) {
        console.log(chalk.red(`   Arquivo ${file} não encontrado (possivelmente excluído)`));
        continue;
      }
      
      const content = readFile(file);
      const type = getFileType(file);
      
      // Verificar o arquivo modificado
      const result = CodeReviewer.checkNewFile(file, content, type);
      let fileHasIssues = false;
      
      // Duplicação de conteúdo
      if (result.duplicateContent.length > 0) {
        console.log(chalk.red('   🔴 Conteúdo similar aos arquivos:'));
        result.duplicateContent.forEach(duplicate => {
          if (duplicate !== file) { // Evitar comparação com o próprio arquivo
            console.log(`     * ${duplicate}`);
            fileHasIssues = true;
            totalIssues++;
          }
        });
      }
      
      // Diretórios semelhantes
      if (result.similarDirectories.length > 0) {
        console.log(chalk.red('   🔴 Diretório similar a:'));
        result.similarDirectories.forEach(dir => {
          console.log(`     * ${dir}`);
          fileHasIssues = true;
          totalIssues++;
        });
      }
      
      // Arquivos semelhantes
      if (result.similarFiles.length > 0) {
        console.log(chalk.red('   🔴 Nome similar aos arquivos:'));
        result.similarFiles.forEach(similarFile => {
          if (similarFile !== file) { // Evitar comparação com o próprio arquivo
            console.log(`     * ${similarFile}`);
            fileHasIssues = true;
            totalIssues++;
          }
        });
      }
      
      // Duplicação de estilos (para CSS/SCSS)
      if (result.styleDuplicates.length > 0) {
        console.log(chalk.red('   🔴 Seletores CSS duplicados:'));
        result.styleDuplicates.forEach(duplicate => {
          console.log(`     * Seletor "${duplicate.selector}" já existe em:`);
          duplicate.files.forEach(duplicateFile => {
            if (duplicateFile !== file) {
              console.log(`       - ${duplicateFile}`);
              fileHasIssues = true;
              totalIssues++;
            }
          });
        });
      }
      
      if (!fileHasIssues) {
        console.log(chalk.green('   ✅ Nenhum problema encontrado neste arquivo'));
      }
    }
    
    // Resumo final
    console.log(chalk.cyan('\n=== RESUMO DA REVISÃO ==='));
    
    if (totalIssues > 0) {
      console.log(chalk.red(`\n❌ Encontrados ${totalIssues} problemas potenciais nas mudanças`));
      console.log(chalk.yellow('\nSugestões de solução:'));
      console.log('  • Renomeie arquivos ou diretórios para evitar conflitos de nomenclatura');
      console.log('  • Reorganize o código para evitar duplicações de conteúdo');
      console.log('  • Utilize o sistema de importação centralizado em src/styles/index.js para estilos');
      console.log('  • Considere extrair funcionalidades comuns para componentes/utilidades compartilhadas');
      process.exit(1); // Sair com código de erro
    } else {
      console.log(chalk.green('\n✅ Nenhum problema encontrado nas mudanças!'));
      process.exit(0); // Sair com sucesso
    }

  } catch (error) {
    console.error(chalk.red('Erro durante a verificação de código:'), error);
    process.exit(1);
  }
};

// Executar a revisão
reviewChanges(); 