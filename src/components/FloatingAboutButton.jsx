import React, { useState, useEffect } from "react";
import { gsap } from "gsap";
import { useSection } from "../contexts/SectionContext";

const FloatingAboutButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { showSection, activeSection } = useSection();

  // Verificar em qual seção estamos e mostrar/esconder o botão
  useEffect(() => {
    // Se não estivermos na seção home, mostrar o botão
    if (activeSection !== "home" && !isVisible) {
      setIsVisible(true);
      const button = document.getElementById("floatingAboutButton");
      if (button) {
        button.style.display = "flex";
        gsap.fromTo(
          button,
          { opacity: 0, scale: 0.5, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "power3.out" }
        );
      }
    }
    // Se estivermos na seção home, esconder o botão
    else if (activeSection === "home" && isVisible) {
      setIsVisible(false);
      const button = document.getElementById("floatingAboutButton");
      if (button) {
        gsap.to(button, {
          opacity: 0,
          scale: 0.5,
          y: 20,
          duration: 0.3,
          ease: "power3.in",
          onComplete: () => {
            if (button) button.style.display = "none";
          },
        });
      }
    }
  }, [activeSection, isVisible]);

  // Função para voltar à seção home
  const navigateToHome = () => {
    showSection("home");

    // Atualiza o hash da URL
    window.history.pushState(null, null, "#home");
  };

  return (
    <div
      className="floating-button"
      id="floatingAboutButton"
      onClick={navigateToHome}
      role="button"
      tabIndex="0"
      aria-label="Voltar para About me"
      style={{ display: "none" }}
    >
      <span>About me</span>
    </div>
  );
};

export default FloatingAboutButton;
