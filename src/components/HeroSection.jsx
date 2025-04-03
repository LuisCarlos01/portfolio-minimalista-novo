import React, { useEffect, useRef, useState } from "react";
import Header from "./Header";
import Typed from "typed.js";
import { gsap } from "gsap";
import { useSection } from "../contexts/SectionContext";

const HeroSection = () => {
  const typedElement = useRef(null);
  const heroContainerRef = useRef(null);
  const { showSection } = useSection();
  const [imageError, setImageError] = useState(false);

  // Usando Typed.js para efeito de digitação
  useEffect(() => {
    if (!typedElement.current) return;

    const typed = new Typed(typedElement.current, {
      strings: ["Freelancer", "Front-end Developer", "Web Developer"],
      typeSpeed: 100,
      backSpeed: 100,
      backDelay: 1000,
      loop: true,
    });

    return () => {
      typed.destroy();
    };
  }, []);

  // Função para Download CV
  const handleDownloadCV = (e) => {
    e.preventDefault();
    // Como o arquivo do CV não está disponível, mostrar um alerta
    alert("O CV estará disponível em breve!");
  };

  // Navegação para contato
  const navigateToContact = (e) => {
    e.preventDefault();
    showSection("contact");
  };

  // Handler para erro de carregamento da imagem
  const handleImageError = () => {
    console.log("Erro ao carregar a imagem de perfil");
    setImageError(true);
  };

  // Animação inicial para a hero section
  useEffect(() => {
    // Garantir que o componente esteja montado e os elementos existam
    if (!heroContainerRef.current) return;

    const timeline = gsap.timeline();

    // Usar querySelector a partir do ref para garantir que os elementos existam
    const heroPic = heroContainerRef.current.querySelector(".hero-pic");

    // Converter NodeList para array para evitar o erro
    const heroTextElementsArray = Array.from(
      heroContainerRef.current.querySelectorAll(
        ".hero-text h5, .hero-text h1, .hero-text p"
      )
    );

    const btnGroup = heroContainerRef.current.querySelector(".btn-group");
    const social = heroContainerRef.current.querySelector(".social");

    // Verificar se os elementos existem antes de animá-los
    if (heroPic) {
      timeline.fromTo(
        heroPic,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }
      );
    }

    if (heroTextElementsArray.length > 0) {
      timeline.fromTo(
        heroTextElementsArray,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.2, duration: 0.6, ease: "power2.out" }
      );
    }

    // Agrupar btnGroup e social em um array apenas se ambos existirem
    const animElements = [];
    if (btnGroup) animElements.push(btnGroup);
    if (social) animElements.push(social);

    if (animElements.length > 0) {
      timeline.fromTo(
        animElements,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.2, duration: 0.5, ease: "power2.out" }
      );
    }
  }, []);

  // Avatar placeholder para caso a imagem não carregue
  const avatarPlaceholder = (
    <div className="avatar-placeholder">
      <i className="fas fa-user-circle"></i>
    </div>
  );

  return (
    <div className="hero-header" ref={heroContainerRef}>
      <div className="wrapper">
        <Header />

        <div className="container">
          <div className="hero-pic">
            {imageError ? (
              avatarPlaceholder
            ) : (
              <img
                src="/images/photos/perfil.jpg"
                alt="Luis Carlos profile"
                onError={handleImageError}
              />
            )}
          </div>
          <div className="hero-text">
            <h5>
              Hi I'm{" "}
              <span className="input" ref={typedElement}>
                Freelancer
              </span>
            </h5>
            <h1>Luís Carlos</h1>
            <p id="passionText">
              Creating robust and efficient backend architectures is not just my
              profession; It's my passion!
            </p>
            <div className="btn-group">
              <a
                href="#"
                onClick={handleDownloadCV}
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
                Contact
              </a>
            </div>
            <div className="social">
              <a
                href="https://www.linkedin.com/in/luiz-carlos-vitoriano-neto-56a58321b/?trk=opento_sprofile_topcard"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <i className="fa-brands fa-linkedin"></i>
              </a>
              <a
                href="https://github.com/LuisCarlos01"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <i className="fa-brands fa-github"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
