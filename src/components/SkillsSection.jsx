import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSection } from "../contexts/SectionContext";
import SkillPreviewModal from "./SkillPreviewModal";

// Registrando o plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Lista de ícones para as categorias
const categoryIcons = {
  "Front-end": "fas fa-laptop-code",
  "Back-end": "fas fa-server",
  Ferramentas: "fas fa-tools",
  Design: "fas fa-paint-brush",
};

// Ícones para cada habilidade com estilos melhorados
const skillIcons = {
  HTML5: {
    icon: "fab fa-html5",
    color: "#E34F26", // Cor oficial do HTML5
  },
  CSS3: {
    icon: "fab fa-css3-alt",
    color: "#1572B6", // Cor oficial do CSS3
  },
  Sass: {
    icon: "fab fa-sass",
    color: "#CC6699", // Cor oficial do Sass
  },
  JavaScript: {
    icon: "fab fa-js",
    color: "#F7DF1E", // Cor oficial do JavaScript
  },
  TypeScript: {
    icon: "fab fa-js",
    color: "#3178C6", // Cor oficial do TypeScript
  },
  React: {
    icon: "fab fa-react",
    color: "#61DAFB", // Cor oficial do React
  },
  "Node.js": {
    icon: "fab fa-node-js",
    color: "#339933", // Cor oficial do Node.js
  },
  SQL: {
    icon: "fas fa-database",
    color: "#4479A1", // Cor para SQL
  },
  Git: {
    icon: "fab fa-git-alt",
    color: "#F05032", // Cor oficial do Git
  },
  Figma: {
    icon: "fab fa-figma",
    color: "#F24E1E", // Cor oficial do Figma
  },
};

const SkillsSection = () => {
  const { activeSection } = useSection();
  const [activeCategory, setActiveCategory] = useState("Todas");
  const skillsSectionRef = useRef(null);
  const shapesRef = useRef(null);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);

  // Debug: verificar as habilidades disponíveis
  useEffect(() => {
    console.log("Habilidades carregadas:", skills);
    console.log("Categoria ativa:", activeCategory);
    console.log(
      "Habilidades filtradas:",
      activeCategory === "Todas"
        ? skills
        : skills.filter((skill) => skill.category === activeCategory)
    );
  }, [activeCategory]);

  const skills = [
    {
      id: 1,
      name: "HTML5",
      level: 90,
      category: "Front-end",
      description:
        "Domínio avançado de HTML5, incluindo tags semânticas, formulários e APIs modernas.",
    },
    {
      id: 2,
      name: "CSS3",
      level: 85,
      category: "Front-end",
      description:
        "Forte conhecimento em CSS3, incluindo Flexbox, Grid e animações.",
    },
    {
      id: 3,
      name: "Sass",
      level: 80,
      category: "Front-end",
      description:
        "Utilização de pré-processadores para criar estilos mais organizados e reutilizáveis.",
    },
    {
      id: 4,
      name: "JavaScript",
      level: 85,
      category: "Front-end",
      description: "Proficiente em JavaScript ES6+, DOM, Promises e módulos.",
    },
    {
      id: 5,
      name: "TypeScript",
      level: 78,
      category: "Front-end",
      description:
        "Desenvolvimento com tipagem estática para melhor manutenção e escalabilidade de código.",
    },
    {
      id: 6,
      name: "React",
      level: 80,
      category: "Front-end",
      description:
        "Experiência com hooks, estado global, roteamento e otimização de performance.",
    },
    {
      id: 7,
      name: "Node.js",
      level: 75,
      category: "Back-end",
      description: "Construção de APIs REST e aplicações em tempo real.",
    },
    {
      id: 8,
      name: "SQL",
      level: 70,
      category: "Back-end",
      description:
        "Consultas complexas, otimização de performance e design de banco de dados.",
    },
    {
      id: 9,
      name: "Git",
      level: 85,
      category: "Ferramentas",
      description:
        "Controle de versão com Git, branching, merging e resolução de conflitos.",
    },
    {
      id: 10,
      name: "Figma",
      level: 75,
      category: "Design",
      description:
        "Design de interfaces, criação de protótipos e sistemas de design.",
    },
  ];

  // Filtrar habilidades baseado na categoria ativa
  const filteredSkills =
    activeCategory === "Todas"
      ? skills
      : skills.filter((skill) => skill.category === activeCategory);

  // Efeito para animação quando a seção se torna ativa
  useEffect(() => {
    if (activeSection === "skills") {
      console.log("Seção skills ativada - iniciando animações");

      // Animar título, descrição e categorias entrando
      const tl = gsap.timeline();
      tl.fromTo(
        ".skills-section h2",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      )
        .fromTo(
          ".section-description",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "-=0.4"
        )
        .fromTo(
          ".skills-categories",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "-=0.6"
        );

      // Animar cards de habilidades entrando em sequência
      const cards = document.querySelectorAll(".skill-card");
      console.log("Cards de habilidades encontrados:", cards.length);

      tl.fromTo(
        cards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
        },
        "-=0.4"
      );

      // Animar as barras de progresso
      setTimeout(() => {
        cards.forEach((card) => {
          const level = card.getAttribute("data-level");
          const progressBar = card.querySelector(".progress-bar");
          if (progressBar) {
            gsap.to(progressBar, {
              width: `${level}%`,
              duration: 1.5,
              ease: "power3.out",
            });
          } else {
            console.error(
              `Barra de progresso não encontrada para o card ${card.textContent}`
            );
          }
        });
      }, 800);
    }
  }, [activeSection]);

  // Configurar formas no fundo e efeitos de paralaxe
  useEffect(() => {
    // Animação das formas no fundo
    if (shapesRef.current) {
      // Adicionar formas dinamicamente
      const shapes = [
        { class: "shape shape-circle", size: "80px" },
        { class: "shape shape-square", size: "70px" },
        { class: "shape shape-triangle", size: "90px" },
        { class: "shape shape-plus", size: "50px" },
        { class: "shape shape-dot", size: "10px" },
        { class: "shape shape-dot", size: "15px" },
        { class: "shape shape-dot", size: "8px" },
        { class: "shape shape-dot", size: "12px" },
      ];

      // Limpar o container primeiro
      shapesRef.current.innerHTML = "";

      shapes.forEach((shape) => {
        const element = document.createElement("div");
        element.className = shape.class;
        element.style.width = shape.size;
        element.style.height = shape.size;

        // Posições aleatórias para cada forma
        const randomTop = Math.random() * 100;
        const randomLeft = Math.random() * 100;

        element.style.top = `${randomTop}%`;
        element.style.left = `${randomLeft}%`;

        shapesRef.current.appendChild(element);
      });

      // Animar as formas
      const shapeElements = shapesRef.current.querySelectorAll(".shape");
      gsap.set(shapeElements, { opacity: 0, scale: 0 });

      ScrollTrigger.create({
        trigger: skillsSectionRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.to(shapeElements, {
            opacity: 0.6,
            scale: 1,
            duration: 1,
            stagger: 0.2,
            ease: "elastic.out(1, 0.8)",
          });
        },
      });

      // Efeito de paralaxe ao mover o mouse
      const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        shapeElements.forEach((element, index) => {
          const depth = ((index % 4) + 1) * 15;
          const moveX = (clientX - windowWidth / 2) / depth;
          const moveY = (clientY - windowHeight / 2) / depth;

          gsap.to(element, {
            x: moveX,
            y: moveY,
            duration: 1,
            ease: "power1.out",
          });
        });
      };

      window.addEventListener("mousemove", handleMouseMove);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, []);

  // Efeito de hover para os cards de habilidades
  const handleSkillHover = (skillId) => {
    setHoveredSkill(skillId);
  };

  const handleSkillLeave = () => {
    setHoveredSkill(null);
  };

  // Abrir modal de detalhes da habilidade
  const openSkillModal = (skill) => {
    console.log("Abrindo modal para:", skill.name);
    setSelectedSkill(skill);
  };

  // Fechar modal
  const closeSkillModal = () => {
    setSelectedSkill(null);
  };

  // Estilos inline para garantir a renderização
  const styles = {
    skillsContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: "1.5rem",
      justifyContent: "center",
      padding: "1rem",
      marginBottom: "3rem",
    },
    skillCard: {
      backgroundColor: "rgba(30, 30, 30, 0.6)",
      borderRadius: "12px",
      padding: "1.5rem",
      width: "280px",
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      border: "1px solid rgba(155, 89, 182, 0.2)",
      backdropFilter: "blur(5px)",
      display: "flex",
      flexDirection: "column",
      cursor: "pointer",
      position: "relative",
      overflow: "hidden",
      zIndex: 2,
    },
    hoveredCard: {
      transform: "translateY(-10px)",
      boxShadow: "0 15px 30px rgba(0, 0, 0, 0.3)",
      border: "1px solid rgba(155, 89, 182, 0.5)",
    },
    skillIcon: {
      fontSize: "2.5rem",
      marginBottom: "1rem",
      textAlign: "center",
    },
    skillHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "0.8rem",
    },
    skillTitle: {
      fontSize: "1.25rem",
      fontWeight: "600",
      color: "white",
      margin: 0,
    },
    skillLevel: {
      fontSize: "0.9rem",
      fontWeight: "500",
      color: "rgba(255, 255, 255, 0.7)",
      padding: "2px 8px",
      backgroundColor: "rgba(155, 89, 182, 0.2)",
      borderRadius: "20px",
    },
    progressContainer: {
      width: "100%",
      height: "8px",
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderRadius: "4px",
      marginBottom: "1rem",
      overflow: "hidden",
    },
    progressBar: {
      height: "100%",
      width: "0%", // Será animado via GSAP
      borderRadius: "4px",
    },
    description: {
      fontSize: "0.9rem",
      color: "rgba(255, 255, 255, 0.7)",
      marginBottom: "1rem",
      lineHeight: "1.5",
    },
    categoryTag: {
      marginTop: "auto",
      display: "inline-block",
      fontSize: "0.8rem",
      padding: "5px 10px",
      borderRadius: "20px",
      backgroundColor: "rgba(155, 89, 182, 0.2)",
      color: "rgba(255, 255, 255, 0.8)",
    },
    sectionHeader: {
      textAlign: "center",
      position: "relative",
      zIndex: 5,
      maxWidth: "900px",
      margin: "0 auto",
      padding: "2rem 1.5rem 6rem",
    },
    sectionTitle: {
      fontSize: "3.5rem",
      fontWeight: "700",
      color: "white",
      marginBottom: "2.5rem",
      position: "relative",
      display: "inline-block",
      letterSpacing: "1px",
      textTransform: "uppercase",
    },
    titleUnderline: {
      content: '""',
      position: "absolute",
      width: "80px",
      height: "4px",
      bottom: "-15px",
      left: "50%",
      transform: "translateX(-50%)",
      background: "#9b59b6",
      borderRadius: "2px",
    },
    sectionDescription: {
      fontSize: "1.1rem",
      lineHeight: "1.8",
      color: "rgba(255, 255, 255, 0.85)",
      maxWidth: "700px",
      margin: "0 auto",
      position: "relative",
      textAlign: "center",
      letterSpacing: "0.3px",
      fontWeight: "300",
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      borderRadius: "10px",
      padding: "15px 25px",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
      backdropFilter: "blur(5px)",
      border: "1px solid rgba(155, 89, 182, 0.2)",
    },
    descriptionHighlight: {
      color: "#9b59b6",
      fontWeight: "400",
    },
    categoriesContainer: {
      marginTop: "-2rem",
    },
  };

  return (
    <section id="skills" ref={skillsSectionRef} className="skills-section">
      <div className="shapes-background" ref={shapesRef}></div>

      <div style={styles.sectionHeader} className="skills-header">
        <h2
          style={styles.sectionTitle}
          data-text="Minhas Habilidades"
          className="section-title"
        >
          Minhas Habilidades
          <span style={styles.titleUnderline}></span>
        </h2>
        <p style={styles.sectionDescription} className="section-description">
          <span style={styles.descriptionHighlight}>Tecnologias</span> e{" "}
          <span style={styles.descriptionHighlight}>ferramentas</span> que uso
          para criar soluções{" "}
          <span style={styles.descriptionHighlight}>robustas</span> e{" "}
          <span style={styles.descriptionHighlight}>eficientes</span> para os
          mais diversos desafios de desenvolvimento.
        </p>
      </div>

      <div style={styles.categoriesContainer} className="skills-categories">
        <button
          className={`category-btn ${
            activeCategory === "Todas" ? "active" : ""
          }`}
          onClick={() => setActiveCategory("Todas")}
        >
          <i className="fas fa-globe"></i> Todas
        </button>
        {Object.keys(categoryIcons).map((category) => (
          <button
            key={category}
            className={`category-btn ${
              activeCategory === category ? "active" : ""
            }`}
            onClick={() => setActiveCategory(category)}
          >
            <i className={categoryIcons[category]}></i> {category}
          </button>
        ))}
      </div>

      <div style={styles.skillsContainer} className="skills-container">
        {filteredSkills.map((skill) => (
          <div
            key={skill.id}
            className={`skill-card`}
            style={{
              ...styles.skillCard,
              ...(hoveredSkill === skill.id ? styles.hoveredCard : {}),
            }}
            data-level={skill.level}
            onMouseEnter={() => handleSkillHover(skill.id)}
            onMouseLeave={handleSkillLeave}
            onClick={() => openSkillModal(skill)}
          >
            <div style={styles.skillIcon} className="skill-icon">
              {skillIcons[skill.name] ? (
                <i
                  className={skillIcons[skill.name].icon}
                  style={{ color: skillIcons[skill.name].color }}
                ></i>
              ) : (
                <i className="fas fa-code"></i>
              )}
            </div>
            <div className="skill-content">
              <div style={styles.skillHeader} className="skill-header">
                <h3 style={styles.skillTitle}>{skill.name}</h3>
                <span style={styles.skillLevel} className="skill-level">
                  {skill.level}%
                </span>
              </div>
              <div style={styles.progressContainer} className="skill-progress">
                <div
                  className="progress-bar"
                  style={{
                    ...styles.progressBar,
                    backgroundColor:
                      skillIcons[skill.name]?.color || "var(--accent-color)",
                  }}
                ></div>
              </div>
              <p style={styles.description} className="skill-description">
                {skill.description}
              </p>
              <div className="skill-category-tag">
                <span style={styles.categoryTag}>{skill.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de detalhes da habilidade */}
      <SkillPreviewModal skill={selectedSkill} onClose={closeSkillModal} />

      {/* Botão para ir para a seção de projetos */}
      <div className="explore-more-btn">
        <a href="#portfolio">
          <span>Ver meus projetos</span>
          <i className="fas fa-arrow-right"></i>
        </a>
      </div>
    </section>
  );
};

export default SkillsSection;
