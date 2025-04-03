import React from "react";
import { useSection } from "../../../contexts/SectionContext";

const ActionButtons = () => {
  const { showSection } = useSection();

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

  return (
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
  );
};

export default ActionButtons;
