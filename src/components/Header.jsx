import React, { useState, useEffect, useCallback, useRef } from 'react';
import { gsap } from 'gsap';
import { useSection } from '../contexts/SectionContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { showSection } = useSection();
  const headerRef = useRef(null);
  const navLinksRef = useRef(null);
  const logoRef = useRef(null);

  // Efeito para animar o header na entrada
  useEffect(() => {
    const header = headerRef.current;
    const logo = logoRef.current;
    
    if (header && logo) {
      // Animação do logo mais suave, sem deslocamento vertical
      gsap.fromTo(
        logo,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
      
      // Removendo a configuração de forçar visibilidade do texto do logo
      // O texto agora será controlado pelos estilos CSS:hover
    }
  }, []);

  const reloadPage = () => {
    window.location.reload();
  };

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prevState => !prevState);
    const nav = navLinksRef.current;
    
    if (!isMenuOpen && nav) {
      // Mostrar o menu
      nav.style.display = 'flex';
      document.body.style.overflow = 'hidden'; // Impede rolagem do body
      
      gsap.fromTo(nav, 
        { opacity: 0, right: '-100%' }, 
        { opacity: 1, right: '0', duration: 0.5, ease: 'power3.out' }
      );
      
      // Animar os itens do menu
      const items = nav.querySelectorAll('li');
      gsap.fromTo(
        items,
        { x: 20, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.1, duration: 0.4, delay: 0.2 }
      );
    } else if (nav) {
      // Esconder o menu
      document.body.style.overflow = ''; // Restaura rolagem do body
      
      gsap.to(nav, { 
        opacity: 0, 
        right: '-100%', 
        duration: 0.5, 
        ease: 'power2.in',
        onComplete: () => {
          if (nav) {
            nav.style.display = 'none';
          }
        }
      });
    }
  }, [isMenuOpen]);

  // Manipulador de navegação
  const handleNavigation = (e, sectionId) => {
    e.preventDefault();
    
    // Atualiza a URL com hash
    window.history.pushState(null, null, `#${sectionId}`);
    
    // Mostra a seção
    showSection(sectionId);
    
    // Fecha o menu móvel se estiver aberto
    if (isMenuOpen) {
      toggleMenu();
    }
  };

  // Fecha o menu ao clicar em algum link
  useEffect(() => {
    const handleLinkClick = () => {
      if (isMenuOpen) {
        toggleMenu();
      }
    };

    const links = document.querySelectorAll('.navlinks a');
    links.forEach(link => link.addEventListener('click', handleLinkClick));

    return () => {
      links.forEach(link => link.removeEventListener('click', handleLinkClick));
    };
  }, [isMenuOpen, toggleMenu]);

  // Efeito para adicionar classe ao header quando a página é rolada
  useEffect(() => {
    const handleScroll = () => {
      const header = headerRef.current;
      if (header) {
        if (window.scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fecha o menu ao pressionar a tecla ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        toggleMenu();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isMenuOpen, toggleMenu]);

  return (
    <header ref={headerRef}>
      <div className="logo clickable" onClick={reloadPage} ref={logoRef}>
        <span className="footer-copyright">©</span>
        <span className="logo-text">Code by Luís Carlos</span>
      </div>

      <nav>
        <div className={`togglebtn ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu} aria-label="Menu de navegação">
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
        <ul className={`navlinks ${isMenuOpen ? 'open' : ''}`} ref={navLinksRef}>
          <li><a href="#home" onClick={(e) => handleNavigation(e, 'home')}>Home</a></li>
          <li><a href="#resume" onClick={(e) => handleNavigation(e, 'resume')}>Resume</a></li>
          <li><a href="#skills" onClick={(e) => handleNavigation(e, 'skills')}>Skills</a></li>
          <li><a href="#contact" onClick={(e) => handleNavigation(e, 'contact')}>Contact</a></li>
          <li><a href="#portfolio" onClick={(e) => handleNavigation(e, 'portfolio')}>Portfolio</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header; 