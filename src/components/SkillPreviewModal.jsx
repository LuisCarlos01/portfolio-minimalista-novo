import React from "react";
import { gsap } from "gsap";
import { useEffect, useRef } from "react";

// Importar os ícones e cores para cada habilidade do SkillsSection
const skillIcons = {
  HTML5: {
    icon: "fab fa-html5",
    color: "#E34F26",
  },
  CSS3: {
    icon: "fab fa-css3-alt",
    color: "#1572B6",
  },
  Sass: {
    icon: "fab fa-sass",
    color: "#CC6699",
  },
  JavaScript: {
    icon: "fab fa-js",
    color: "#F7DF1E",
  },
  TypeScript: {
    icon: "fab fa-js",
    color: "#3178C6",
  },
  React: {
    icon: "fab fa-react",
    color: "#61DAFB",
  },
  "Node.js": {
    icon: "fab fa-node-js",
    color: "#339933",
  },
  SQL: {
    icon: "fas fa-database",
    color: "#4479A1",
  },
  Git: {
    icon: "fab fa-git-alt",
    color: "#F05032",
  },
  Figma: {
    icon: "fab fa-figma",
    color: "#F24E1E",
  },
};

const SkillPreviewModal = ({ skill, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (skill && modalRef.current) {
      // Animar a entrada do modal
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }
      );

      // Animar o conteúdo do modal
      const content = modalRef.current.querySelector(".modal-content");
      gsap.fromTo(
        content.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.2,
        }
      );

      // Fechar o modal quando pressionar ESC
      const handleEscKey = (e) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      document.addEventListener("keydown", handleEscKey);
      return () => {
        document.removeEventListener("keydown", handleEscKey);
      };
    }
  }, [skill, onClose]);

  // Função para animar a saída do modal
  const handleClose = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
        ease: "power2.in",
        onComplete: onClose,
      });
    } else {
      onClose();
    }
  };

  if (!skill) return null;

  // Escolher a cor de destaque com base na skill selecionada ou na categoria
  const getSkillColor = () => {
    if (skillIcons[skill.name]) {
      return skillIcons[skill.name].color;
    }

    // Fallback para cores baseadas na categoria
    switch (skill.category) {
      case "Front-end":
        return "#4aa3df";
      case "Back-end":
        return "#3498db";
      case "Ferramentas":
        return "#9b59b6";
      case "Design":
        return "#e74c3c";
      default:
        return "#2ecc71";
    }
  };

  const skillColor = getSkillColor();
  const iconClass = skillIcons[skill.name]?.icon || "fas fa-code";

  // Função para obter exemplos de uso e casos específicos para cada tecnologia
  const getSkillUseCases = (skillName) => {
    switch (skillName) {
      case "HTML5":
        return "Sites responsivos, formulários interativos e estruturação semântica de conteúdo.";
      case "CSS3":
        return "Layouts flexíveis, animações suaves e estilização de interfaces.";
      case "Sass":
        return "Projetos maiores com necessidade de variáveis, mixins e estrutura de estilos aninhados.";
      case "JavaScript":
        return "Interatividade em sites, validação de formulários e manipulação de dados.";
      case "TypeScript":
        return "Aplicações complexas que necessitam de tipagem forte e melhor detecção de erros.";
      case "React":
        return "SPAs (Single Page Applications), dashboards interativos e interfaces complexas.";
      case "Node.js":
        return "APIs RESTful, serviços em tempo real e aplicações backend.";
      case "SQL":
        return "Sistemas de gerenciamento de dados, relatórios e análises.";
      case "Git":
        return "Controle de versão em equipe, rastreamento de alterações e gerenciamento de branches.";
      case "Figma":
        return "Prototipagem, design UI/UX e sistemas de design.";
      default:
        return "Aplicação em projetos diversos com foco em performance e qualidade.";
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose} ref={modalRef}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{ backgroundColor: skillColor }}>
          <div className="modal-title">
            <h2>
              <i className={iconClass} style={{ marginRight: "10px" }}></i>{" "}
              {skill.name}
            </h2>
            <span className="skill-category">{skill.category}</span>
          </div>
          <button className="modal-close-btn" onClick={handleClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-body">
          <div className="skill-level-display">
            <div
              className="skill-progress-circle"
              style={{
                background: `conic-gradient(${skillColor} ${
                  skill.level * 3.6
                }deg, #f2f2f2 0deg)`,
              }}
            >
              <div className="skill-progress-inner">
                <span className="skill-percentage">{skill.level}%</span>
              </div>
            </div>
            <span className="skill-proficiency">
              {skill.level >= 90
                ? "Especialista"
                : skill.level >= 75
                ? "Avançado"
                : skill.level >= 60
                ? "Intermediário"
                : "Básico"}
            </span>
          </div>

          <div className="skill-details">
            <h3>Descrição</h3>
            <p>{skill.description}</p>

            <div className="skill-info-section">
              <div className="skill-info-card">
                <i className="fas fa-code" style={{ color: skillColor }}></i>
                <h4>Pontos Fortes</h4>
                <p>
                  Desenvolvimento de soluções eficientes utilizando {skill.name}
                </p>
              </div>

              <div className="skill-info-card">
                <i
                  className="fas fa-lightbulb"
                  style={{ color: skillColor }}
                ></i>
                <h4>Aplicações</h4>
                <p>{getSkillUseCases(skill.name)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-action-btn secondary" onClick={handleClose}>
            Fechar
          </button>
          <a
            href="#portfolio"
            className="modal-action-btn primary"
            style={{ backgroundColor: skillColor }}
          >
            Ver Projetos com {skill.name}
          </a>
        </div>
      </div>
    </div>
  );
};

export default SkillPreviewModal;
