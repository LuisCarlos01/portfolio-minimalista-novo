/**
 * Arquivo de entrada para todos os estilos da aplicação
 * Centraliza a importação de estilos para evitar duplicações e conflitos
 */

// Estilos globais - devem ser importados primeiro
import './variables.css';
import './style.css';

// Estilos de componentes específicos
import './components/HeroSection.scss';
import './components/SkillsSection.scss';
import './components/PortfolioSection.scss';
import './components/ContactSection.scss';
import './components/ResumeSection.scss';
import './components/ProjectCard.scss';

// Utilitários e estilos funcionais
import './skill-modal.css';
import './preloader.css';
import './responsive-menu.css';
import './menu-animation.css';
import './modern-footer.css';

// Estilos personalizados (deve ser o último para ter prioridade)
import './custom.css';

/**
 * Função para validar estilos em desenvolvimento
 * @param {boolean} isDev - Se é ambiente de desenvolvimento
 */
export const validateStyles = async (isDev = process.env.NODE_ENV === 'development') => {
  if (isDev) {
    try {
      // Importação dinâmica para não afetar o bundle de produção
      const { default: StyleValidator } = await import('../utils/styleValidator');
      
      // Importar o fs usando importação dinâmica
      const fs = await import('fs');
      const path = await import('path');
      
      const validator = new StyleValidator();
      
      // Registrar estilos globais
      const globalStylePath = path.resolve(__dirname, 'style.css');
      if (fs.existsSync(globalStylePath)) {
        const globalStyles = fs.readFileSync(globalStylePath, 'utf8');
        validator.setGlobalStyles(globalStyles);
      }
      
      // Validar estilos
      validator.run();
    } catch (error) {
      console.error('Erro ao validar estilos:', error);
    }
  }
};

// Executar validação em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  // Apenas mostra a mensagem para não bloquear o carregamento
  console.log('\n💅 Verificando estilos para possíveis conflitos...');
  setTimeout(() => {
    validateStyles();
  }, 1000);
}

// Exportação padrão para facilitar a importação
export default {
  validateStyles,
}; 