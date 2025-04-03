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
      
      // Nota: Removida a parte que usa fs e path, pois não funcionam no navegador
      // Vamos usar apenas a validação básica que não depende de I/O
      
      console.log('Validação de estilos deve ser executada via npm run check-styles');
    } catch (error) {
      console.error('Erro ao validar estilos:', error);
    }
  }
};

// Executar validação em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  // Apenas mostra a mensagem para não bloquear o carregamento
  console.log('\n💅 O verificador de estilos está disponível via npm run check-styles');
}

// Exportação padrão para facilitar a importação
export default {
  validateStyles,
}; 