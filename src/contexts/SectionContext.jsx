import React, { createContext, useState, useContext, useEffect } from "react";
import { gsap } from "gsap";

// Criando o contexto
const SectionContext = createContext();

// Hook personalizado para usar o contexto
export const useSection = () => useContext(SectionContext);

// Provedor do contexto
export const SectionProvider = ({ children }) => {
  // Estado para controlar qual seção está ativa
  const [activeSection, setActiveSection] = useState("home");

  // Função para mostrar uma seção específica
  const showSection = (sectionId) => {
    console.log(`SectionContext: Mostrando seção ${sectionId}`);
    setActiveSection(sectionId);

    // Forçar atualização visual para seção de skills
    if (sectionId === "skills") {
      const skillsSection = document.querySelector(".skills-section");
      if (skillsSection) {
        console.log("Atualizando visualização da seção de skills");
        skillsSection.style.display = "block";
      }
    }

    // Ocultar todas as seções
    document.querySelectorAll(".section-container").forEach((section) => {
      if (section.id !== sectionId) {
        console.log(`SectionContext: Ocultando seção ${section.id}`);
        gsap.to(section, {
          opacity: 0,
          y: 20,
          duration: 0.3,
          onComplete: () => {
            section.style.display = "none";
          },
        });
      }
    });

    // Mostrar a seção alvo
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      console.log(`SectionContext: Encontrada seção alvo ${sectionId}`);
      // Garantir que a seção esteja visível antes de animar
      targetSection.style.display = "block";
      targetSection.style.opacity = "1";

      // Animar a entrada da seção
      gsap.fromTo(
        targetSection,
        { opacity: 0, y: -20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          onComplete: () => {
            console.log(
              `SectionContext: Animação da seção ${sectionId} concluída`
            );
            // Rolar para a seção se não for a home
            if (sectionId !== "home") {
              targetSection.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }

            // Verificar se é a seção de skills para ativar as animações
            if (sectionId === "skills") {
              console.log("SectionContext: Animando seção de skills");
              animateSkillsSection();
            }

            // Verificar se é a seção de portfolio para ativar as animações
            if (sectionId === "portfolio") {
              animatePortfolioSection();
            }

            // Verificar se é a seção de contato para ativar as animações
            if (sectionId === "contact") {
              animateContactSection();
            }

            // Verificar se é a seção de currículo para ativar as animações
            if (sectionId === "resume") {
              animateResumeSection();
            }
          },
        }
      );
    } else {
      console.error(
        `SectionContext: Seção com ID ${sectionId} não encontrada!`
      );
    }
  };

  // Função para animar a seção de skills
  const animateSkillsSection = () => {
    const section = document.getElementById("skills");
    if (section) {
      // Animar título
      gsap.fromTo(
        section.querySelector("h2"),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }
      );

      // Animar cards de habilidades com efeito stagger
      gsap.fromTo(
        section.querySelectorAll(".skill-card"),
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "back.out(1.2)",
          onComplete: () => {
            // Animar as barras de progresso após os cards aparecerem
            const progressBars = section.querySelectorAll(".progress-bar");
            progressBars.forEach((bar, index) => {
              const skillCards = section.querySelectorAll(".skill-card");
              if (index < skillCards.length) {
                const skillLevel = skillCards[index].getAttribute("data-level");
                setTimeout(() => {
                  bar.style.width = `${skillLevel}%`;
                }, 200 + index * 100); // Escalonar a animação das barras
              }
            });
          },
        }
      );

      // Forçar a visibilidade da seção
      section.style.display = "block";
      section.style.opacity = "1";

      // Verificar se o conteúdo está visível
      console.log(
        "Dimensões da seção skills:",
        section.getBoundingClientRect()
      );
      console.log(
        "Número de skill cards:",
        section.querySelectorAll(".skill-card").length
      );
    } else {
      console.error("Seção de skills não encontrada!");
    }
  };

  // Função para animar a seção de portfolio
  const animatePortfolioSection = () => {
    const section = document.getElementById("portfolio");
    if (section) {
      // Animar o título e descrição
      gsap.fromTo(
        section.querySelectorAll("h2, .portfolio-description"),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: 0.2 }
      );

      // Animar os cards
      gsap.fromTo(
        section.querySelectorAll(".portfolio-card"),
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.2,
          ease: "power2.out",
          delay: 0.3,
        }
      );
    }
  };

  // Função para animar a seção de contato
  const animateContactSection = () => {
    const section = document.getElementById("contact");
    if (section) {
      gsap.fromTo(
        section.querySelectorAll(".animate-item"),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.2,
          duration: 0.7,
          ease: "power2.out",
        }
      );
    }
  };

  // Função para animar a seção de currículo
  const animateResumeSection = () => {
    const section = document.getElementById("resume");
    if (section) {
      // Animar cabeçalho
      gsap.fromTo(
        section.querySelectorAll("h2, .section-description"),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: 0.2 }
      );

      // Animar itens de currículo
      gsap.fromTo(
        section.querySelectorAll(".resume-item"),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.5,
          ease: "power1.out",
          delay: 0.4,
        }
      );
    }
  };

  // Inicializar: mostrar home por padrão ou seção do hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      // Lista de seções válidas
      const validSections = [
        "home",
        "skills",
        "portfolio",
        "contact",
        "resume",
      ];

      if (hash && validSections.includes(hash)) {
        showSection(hash);
      } else {
        showSection("home");
      }
    };

    // Ouvir mudanças de URL
    window.addEventListener("hashchange", handleHashChange);

    // Verificar hash inicial
    handleHashChange();

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  // Valores e funções a serem compartilhados com os componentes
  const value = {
    activeSection,
    showSection,
  };

  return (
    <SectionContext.Provider value={value}>{children}</SectionContext.Provider>
  );
};
