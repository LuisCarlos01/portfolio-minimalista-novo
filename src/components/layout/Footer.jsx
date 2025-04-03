import React from "react";
import { useSection } from "../../contexts/SectionContext";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  const { showSection } = useSection();

  // Manipulador de navegação
  const handleNavigation = (e, sectionId) => {
    e.preventDefault();
    showSection(sectionId);

    // Atualiza a URL com hash
    window.history.pushState(null, null, `#${sectionId}`);
  };

  return (
    <footer>
      <div className="footer-container">
        <div className="footer-logo">
          <span>© 2024 Luís Carlos</span>
        </div>
        <div className="footer-links">
          <a href="#home" onClick={(e) => handleNavigation(e, "home")}>
            Home
          </a>
          <a href="#resume" onClick={(e) => handleNavigation(e, "resume")}>
            Resume
          </a>
          <a href="#skills" onClick={(e) => handleNavigation(e, "skills")}>
            Skills
          </a>
          <a
            href="#portfolio"
            onClick={(e) => handleNavigation(e, "portfolio")}
          >
            Portfolio
          </a>
          <a href="#contact" onClick={(e) => handleNavigation(e, "contact")}>
            Contato
          </a>
        </div>
        <div className="footer-social">
          <a
            href="https://www.linkedin.com/in/luis-carlos-vitoriano-neto-56a58321b/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://github.com/LuisCarlos01"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <FaGithub />
          </a>
          <a href="mailto:luizcarlosvitorianoneto@gmail.com" aria-label="Email">
            <FaEnvelope />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
