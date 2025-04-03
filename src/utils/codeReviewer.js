/**
 * CodeReviewer - Sistema de revisão automática de código
 * Verifica duplicidades, conflitos entre arquivos e linguagens diferentes
 */

import styleChecker from './styleChecker';

/**
 * Classe para revisar automaticamente o código
 * @class CodeReviewer
 */
class CodeReviewer {
  constructor() {
    this.fileRegistry = {};
    this.directoryRegistry = {};
    this.fileIndex = {};
    this.contentHashes = {};
  }

  /**
   * Registra um arquivo para análise
   * @param {string} filePath - Caminho do arquivo
   * @param {string} content - Conteúdo do arquivo
   * @param {string} type - Tipo do arquivo (js, jsx, css, scss, etc)
   */
  registerFile(filePath, content, type) {
    this.fileRegistry[filePath] = {
      content,
      type,
      hash: this.generateContentHash(content)
    };

    // Registra no índice para pesquisa rápida
    if (!this.fileIndex[type]) {
      this.fileIndex[type] = [];
    }
    this.fileIndex[type].push(filePath);

    // Registra hash para detectar duplicidade de conteúdo
    const hash = this.generateContentHash(content);
    if (!this.contentHashes[hash]) {
      this.contentHashes[hash] = [];
    }
    this.contentHashes[hash].push(filePath);
  }

  /**
   * Registra um diretório para análise
   * @param {string} dirPath - Caminho do diretório
   * @param {Array} files - Arquivos no diretório
   */
  registerDirectory(dirPath, files) {
    this.directoryRegistry[dirPath] = {
      files,
      baseName: dirPath.split('/').pop()
    };
  }

  /**
   * Gera um hash simplificado do conteúdo
   * @param {string} content - Conteúdo para gerar hash
   * @returns {string} - Hash do conteúdo
   */
  generateContentHash(content) {
    // Versão simplificada de hash para detecção de similaridade
    return content
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 100);
  }

  /**
   * Verifica duplicidade em nomes de diretórios
   * @returns {Array} - Lista de diretórios com nomes duplicados
   */
  checkDuplicateDirectories() {
    const directoryBaseNames = {};
    const duplicateDirectories = [];

    Object.entries(this.directoryRegistry).forEach(([dirPath, info]) => {
      const { baseName } = info;
      
      if (directoryBaseNames[baseName]) {
        directoryBaseNames[baseName].push(dirPath);
        
        // Se for a primeira vez que detectamos essa duplicação
        if (directoryBaseNames[baseName].length === 2) {
          duplicateDirectories.push({
            baseName,
            directories: [...directoryBaseNames[baseName]]
          });
        }
      } else {
        directoryBaseNames[baseName] = [dirPath];
      }
    });

    return duplicateDirectories;
  }

  /**
   * Verifica arquivos com conteúdo duplicado ou muito similar
   * @returns {Array} - Lista de arquivos com conteúdo duplicado
   */
  checkDuplicateContent() {
    const duplicateContent = [];

    Object.entries(this.contentHashes).forEach(([hash, files]) => {
      if (files.length > 1) {
        duplicateContent.push({
          files,
          sampleContent: hash
        });
      }
    });

    return duplicateContent;
  }

  /**
   * Verifica arquivos com nomes duplicados em diretórios diferentes
   * @returns {Array} - Lista de arquivos com nomes duplicados
   */
  checkDuplicateFileNames() {
    const fileBaseNames = {};
    const duplicateFiles = [];

    Object.keys(this.fileRegistry).forEach((filePath) => {
      const baseName = filePath.split('/').pop();
      
      if (fileBaseNames[baseName]) {
        fileBaseNames[baseName].push(filePath);
        
        // Se for a primeira vez que detectamos essa duplicação
        if (fileBaseNames[baseName].length === 2) {
          duplicateFiles.push({
            baseName,
            files: [...fileBaseNames[baseName]]
          });
        }
      } else {
        fileBaseNames[baseName] = [filePath];
      }
    });

    return duplicateFiles;
  }

  /**
   * Verifica se um novo arquivo tem semelhanças com arquivos existentes
   * @param {string} newFilePath - Caminho do novo arquivo
   * @param {string} content - Conteúdo do novo arquivo
   * @param {string} type - Tipo do arquivo (js, jsx, css, scss, etc)
   * @returns {Object} - Resultado da análise
   */
  checkNewFile(newFilePath, content, type) {
    const result = {
      duplicateContent: [],
      similarDirectories: [],
      similarFiles: [],
      styleDuplicates: []
    };

    // Verificar conteúdo semelhante
    const hash = this.generateContentHash(content);
    if (this.contentHashes[hash]) {
      result.duplicateContent = this.contentHashes[hash];
    }

    // Verificar diretórios semelhantes
    const dirPath = newFilePath.substring(0, newFilePath.lastIndexOf('/'));
    const dirBaseName = dirPath.split('/').pop();
    
    Object.entries(this.directoryRegistry).forEach(([existingDirPath, info]) => {
      if (existingDirPath.includes(dirBaseName) || dirBaseName.includes(info.baseName)) {
        result.similarDirectories.push(existingDirPath);
      }
    });

    // Verificar arquivos semelhantes
    const baseName = newFilePath.split('/').pop();
    const similarFiles = [];
    
    Object.keys(this.fileRegistry).forEach((existingFilePath) => {
      const existingBaseName = existingFilePath.split('/').pop();
      if (existingBaseName.includes(baseName) || baseName.includes(existingBaseName)) {
        similarFiles.push(existingFilePath);
      }
    });
    
    result.similarFiles = similarFiles;

    // Se for arquivo de estilo, verificar duplicações de estilo
    if (type === 'css' || type === 'scss') {
      const tempRegistry = { ...this.fileRegistry };
      tempRegistry[newFilePath] = { content, type };
      
      const styleSheets = {};
      Object.entries(tempRegistry).forEach(([path, info]) => {
        if (info.type === 'css' || info.type === 'scss') {
          styleSheets[path] = info.content;
        }
      });
      
      const duplicateSelectors = styleChecker.checkForDuplicateSelectors(styleSheets);
      
      result.styleDuplicates = duplicateSelectors.filter(item => 
        item.files.some(file => file === newFilePath)
      );
    }

    return result;
  }

  /**
   * Executa verificações completas do projeto
   * @returns {Object} - Resultado da análise
   */
  runFullReview() {
    return {
      duplicateDirectories: this.checkDuplicateDirectories(),
      duplicateContent: this.checkDuplicateContent(),
      duplicateFileNames: this.checkDuplicateFileNames()
    };
  }
}

export default CodeReviewer; 