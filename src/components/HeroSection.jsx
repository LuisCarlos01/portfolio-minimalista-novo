import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { useSection } from '../contexts/SectionContext';
import Header from './Header';
import '../styles/components/HeroSection.scss';

// Registra o plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const typedEl = useRef(null);
  const profileRef = useRef(null);
  const textRef = useRef(null);
  const btnGroupRef = useRef(null);
  const socialRef = useRef(null);
  const { showSection } = useSection();

  // Efeito de digitação
  useEffect(() => {
    const typed = new Typed(typedEl.current, {
      strings: ['Freelancer', 'Front-end Developer', 'Web Developer'],
      typeSpeed: 100,
      backSpeed: 60,
      loop: true,
      cursorChar: '|',
      backDelay: 2000,
    });

    return () => {
      typed.destroy();
    };
  }, []);

  // Animações iniciais
  useEffect(() => {
    // Animação inicial - fade in
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
      profileRef.current,
      { scale: 0.8, opacity: 0, y: 30 },
      { scale: 1, opacity: 1, y: 0, duration: 1.2, delay: 0.3 }
    )
      .fromTo(
        textRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.2 },
        '-=0.8'
      )
      .fromTo(
        btnGroupRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15 },
        '-=0.6'
      )
      .fromTo(
        socialRef.current.children,
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.6, 
          stagger: 0.1,
          onComplete: () => {
            // Adiciona um efeito sutil de flutuação ao perfil
            gsap.to(profileRef.current, {
              y: -10,
              duration: 2,
              repeat: -1,
              yoyo: true,
              ease: 'power1.inOut'
            });
          }
        },
        '-=0.4'
      );

    // Efeito parallax sutil ao rolar
    gsap.to(textRef.current, {
      y: 100,
      scrollTrigger: {
        trigger: '.hero-header',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }, []);

  // Função para download do CV
  const handleDownload = (e) => {
    e.preventDefault();
    // Alerta para CV não disponível ou abrir em nova aba quando disponível
    alert("O CV estará disponível em breve!");
  };

  // Função para ir para contato
  const navigateToContact = (e) => {
    e.preventDefault();
    showSection("contact");
  };

  // Lidar com erro de carregamento da imagem
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    const placeholder = e.target.parentNode.querySelector('.avatar-placeholder');
    if (placeholder) {
      placeholder.style.display = 'flex';
    }
  };

  return (
    <div className="hero-header" id="home">
      <div className="wrapper">
        <Header />
        <div className="container">
          <div className="hero-pic" ref={profileRef}>
            <img
              src="/images/photos/perfil.jpg"
              alt="Profile"
              onError={handleImageError}
            />
            <div className="avatar-placeholder" style={{ display: 'none' }}>
              <i className="fa fa-user"></i>
            </div>
          </div>
          <div className="hero-text" ref={textRef}>
            <h5>
              Olá, eu sou <span ref={typedEl}></span>
            </h5>
            <h1>Luís Carlos</h1>
            <p>
              Desenvolvedor front-end apaixonado por criar interfaces interativas e responsivas que proporcionam experiências excepcionais aos usuários.
            </p>
            <div className="btn-group" ref={btnGroupRef}>
              <a
                href="#"
                onClick={handleDownload}
                className="btn active"
                aria-label="Download CV"
              >
                Download CV
              </a>
              <a
                href="#contact"
                onClick={navigateToContact}
                className="btn"
                aria-label="Ir para seção de contato"
              >
                Contato
              </a>
            </div>
            <div className="social" ref={socialRef}>
              <a href="https://github.com/LuisCarlos01" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <i><FaGithub /></i>
              </a>
              <a href="https://www.linkedin.com/in/luiz-carlos-vitoriano-neto-56a58321b/?trk=opento_sprofile_topcard" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <i><FaLinkedin /></i>
              </a>
              <a href="mailto:your.email@example.com" aria-label="Email">
                <i><FaEnvelope /></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
