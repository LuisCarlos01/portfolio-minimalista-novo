import React, { useEffect, useRef, useState } from "react";
import { useSection } from "../contexts/SectionContext";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import '../styles/modern-footer.css';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const { showSection } = useSection();
  const footerRef = useRef(null);
  const particlesRef = useRef(null);
  const yearRef = useRef(new Date().getFullYear());
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 900);
    };
    
    checkMobile();
    
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleNavigation = (e, sectionId) => {
    e.preventDefault();
    showSection(sectionId);

    setMenuOpen(false);

    const ripple = document.createElement("div");
    ripple.className = "footer-link-ripple";
    e.currentTarget.appendChild(ripple);

    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

    setTimeout(() => {
      ripple.remove();
    }, 600);

    window.history.pushState(null, null, `#${sectionId}`);
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && footerRef.current && !footerRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const goToHome = () => {
    showSection("home");
    window.history.pushState(null, null, "#home");
  };

  useEffect(() => {
    if (!particlesRef.current) return;
    
    const container = particlesRef.current;
    
    container.innerHTML = '';
    
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.className = 'footer-particle';
      
      const size = 5 + Math.random() * 15;
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const delay = Math.random() * 4;
      const duration = 10 + Math.random() * 20;
      
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${posX}%`;
      particle.style.top = `${posY}%`;
      particle.style.animationDelay = `${delay}s`;
      particle.style.animationDuration = `${duration}s`;
      
      container.appendChild(particle);
    }
  }, []);

  useEffect(() => {
    if (!footerRef.current) return;
    
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top bottom-=50",
        toggleActions: "play none none none"
      }
    });
    
    const elements = footerRef.current.querySelectorAll('.footer-logo, .footer-links a, .footer-social a');
    
    timeline.fromTo(
      elements,
      { y: 15, opacity: 0 }, 
      { y: 0, opacity: 1, stagger: 0.05, duration: 0.4, ease: "power2.out" }
    );
  }, []);

  return (
    <footer ref={footerRef}>
      <div className="footer-particles-container" ref={particlesRef}></div>
      
      <div className="footer-container">
        <div className="footer-logo" onClick={goToHome}>
          <span className="logo-text">LC</span>
          <span className="footer-copyright">
            &copy; <span className="year-number">{yearRef.current}</span> Luís Carlos
          </span>
        </div>
        
        <div className={`footer-links ${menuOpen ? 'open' : ''}`}>
          <a 
            href="#home" 
            onClick={(e) => handleNavigation(e, "home")}
            className="footer-link"
          >
            <span className="footer-link-hover"></span>
            Home
          </a>
          <a 
            href="#resume" 
            onClick={(e) => handleNavigation(e, "resume")}
            className="footer-link"
          >
            <span className="footer-link-hover"></span>
            Resume
          </a>
          <a 
            href="#skills" 
            onClick={(e) => handleNavigation(e, "skills")}
            className="footer-link"
          >
            <span className="footer-link-hover"></span>
            Skills
          </a>
          <a
            href="#portfolio"
            onClick={(e) => handleNavigation(e, "portfolio")}
            className="footer-link"
          >
            <span className="footer-link-hover"></span>
            Portfolio
          </a>
          <a 
            href="#contact" 
            onClick={(e) => handleNavigation(e, "contact")}
            className="footer-link"
          >
            <span className="footer-link-hover"></span>
            Contato
          </a>
        </div>
        
        <div 
          className={`footer-toggle ${menuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          title="Menu de navegação"
        >
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        <div className="footer-social">
          <a
            href="https://www.linkedin.com/in/luis-carlos-vitoriano-neto-56a58321b/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="social-icon"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://github.com/LuisCarlos01"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="social-icon"
          >
            <FaGithub />
          </a>
          <a 
            href="mailto:luizcarlosvitorianoneto@gmail.com" 
            aria-label="Email"
            className="social-icon"
          >
            <FaEnvelope />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
