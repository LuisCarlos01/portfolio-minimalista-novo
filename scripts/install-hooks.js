/**
 * Script para instalar hooks Git no projeto
 * Executado via: npm run install-hooks
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Caminho para o diretório .git/hooks
const getGitHooksPath = () => {
  try {
    // Obter o caminho para o diretório .git
    const gitDir = execSync('git rev-parse --git-dir').toString().trim();
    return path.resolve(gitDir, 'hooks');
  } catch (error) {
    console.error('Erro ao determinar o diretório Git:', error.message);
    process.exit(1);
  }
};

// Conteúdo para o hook pre-commit
const preCommitHook = `#!/bin/sh

# Hook de pre-commit para verificar conflitos e duplicações no código
echo "🔍 Executando revisão de código antes do commit..."

# Executar o script de revisão de código
npm run review-changes

# Verificar o resultado da revisão
if [ $? -ne 0 ]; then
  echo "❌ A revisão de código encontrou problemas que precisam ser corrigidos antes do commit."
  echo "   Para ignorar esta verificação, use 'git commit --no-verify'"
  exit 1
fi

echo "✅ Revisão de código concluída com sucesso!"
exit 0
`;

// Instalar hooks
const installHooks = () => {
  try {
    console.log('Instalando hooks Git...');
    
    // Obter o caminho dos hooks Git
    const hooksPath = getGitHooksPath();
    
    // Verificar se o diretório de hooks existe
    if (!fs.existsSync(hooksPath)) {
      console.log(`Criando diretório de hooks: ${hooksPath}`);
      fs.mkdirSync(hooksPath, { recursive: true });
    }
    
    // Caminho para o hook pre-commit
    const preCommitPath = path.join(hooksPath, 'pre-commit');
    
    // Escrever o hook pre-commit
    fs.writeFileSync(preCommitPath, preCommitHook);
    
    // Tornar o hook executável (chmod +x)
    execSync(`chmod +x "${preCommitPath}"`);
    
    console.log('✅ Hooks Git instalados com sucesso!');
    console.log('   O hook pre-commit agora verificará conflitos e duplicações no código antes de cada commit.');
  } catch (error) {
    console.error('Erro ao instalar hooks Git:', error.message);
    process.exit(1);
  }
};

// Executar instalação
installHooks(); 