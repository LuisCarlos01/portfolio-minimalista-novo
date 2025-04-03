import React, { useState, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { useSection } from "../../contexts/SectionContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { showSection } = useSection();

  const reloadPage = () => {
    window.location.reload();
  };

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prevState) => !prevState);
    const nav = document.querySelector(".navlinks");

    if (!isMenuOpen && nav) {
      nav.style.display = "block";
      gsap.fromTo(
        nav,
        { opacity: 0, right: "-100%" },
        { opacity: 1, right: "0", duration: 0.5 }
      );
    } else if (nav) {
      gsap.to(nav, {
        opacity: 0,
        right: "-100%",
        duration: 0.5,
        onComplete: () => {
          if (nav) {
            nav.style.display = "none";
          }
        },
      });
    }
  }, [isMenuOpen]);

  // Manipulador de navegação
  const handleNavigation = (e, sectionId) => {
    e.preventDefault();

    console.log(`Navegando para a seção: ${sectionId}`);

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

    const links = document.querySelectorAll(".navlinks a");
    links.forEach((link) => link.addEventListener("click", handleLinkClick));

    return () => {
      links.forEach((link) =>
        link.removeEventListener("click", handleLinkClick)
      );
    };
  }, [isMenuOpen, toggleMenu]);

  return (
    <header>
      <div className="logo clickable" onClick={reloadPage}>
        <span className="copyright">©</span>
        <span className="logo-text">Code by Luís Carlos</span>
      </div>

      <nav>
        <div
          className={`togglebtn ${isMenuOpen ? "active" : ""}`}
          onClick={toggleMenu}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
        <ul className={`navlinks ${isMenuOpen ? "open" : ""}`}>
          <li>
            <a
              href="#home"
              onClick={(e) => handleNavigation(e, "home")}
              aria-label="Ir para Home"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#resume"
              onClick={(e) => handleNavigation(e, "resume")}
              aria-label="Ver currículo"
            >
              Resume
            </a>
          </li>
          <li>
            <a
              href="#skills"
              onClick={(e) => handleNavigation(e, "skills")}
              aria-label="Ver habilidades"
            >
              Skills
            </a>
          </li>
          <li>
            <a
              href="#contact"
              onClick={(e) => handleNavigation(e, "contact")}
              aria-label="Entre em contato"
            >
              Contact
            </a>
          </li>
          <li>
            <a
              href="#portfolio"
              onClick={(e) => handleNavigation(e, "portfolio")}
              aria-label="Ver portfólio"
            >
              Portfolio
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
