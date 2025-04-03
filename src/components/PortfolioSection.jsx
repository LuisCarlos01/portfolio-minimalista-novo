import React, { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSection } from "../contexts/SectionContext";
import { projects } from "../data/projectsData";
import ProjectCard from "./ProjectCard";

// Registrar o plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const PortfolioSection = () => {
  const { activeSection } = useSection();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [displayCount, setDisplayCount] = useState(6);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [filterAnimation, setFilterAnimation] = useState(false);
  const sectionRef = useRef(null);
  const modalRef = useRef(null);
  const parallaxRef = useRef(null);
  const containerRef = useRef(null);
  const projectRefs = useRef({});

  // Criar elementos de paralaxe para o fundo mais dinâmicos
  useEffect(() => {
    if (!parallaxRef.current) return;

    const container = parallaxRef.current;
    container.innerHTML = "";

    // Criar 5 elementos de paralaxe com diferentes tamanhos e posições
    for (let i = 0; i < 5; i++) {
      const parallaxElement = document.createElement("div");
      parallaxElement.className = "portfolio-parallax";

      // Posições e tamanhos aleatórios
      const size = 150 + Math.random() * 300;
      const top = Math.random() * 80;
      const left = Math.random() * 80;

      parallaxElement.style.width = `${size}px`;
      parallaxElement.style.height = `${size}px`;
      parallaxElement.style.top = `${top}%`;
      parallaxElement.style.left = `${left}%`;
      parallaxElement.style.animationDelay = `${i * 0.7}s`;

      container.appendChild(parallaxElement);
    }

    // Adicionar efeito de movimento na paralaxe com o mouse
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const elements = container.querySelectorAll(".portfolio-parallax");
      elements.forEach((element, index) => {
        const depth = (index + 1) * 5;
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
  }, []);

  // Efeitos de animação quando a seção fica ativa
  useEffect(() => {
    if (activeSection === "portfolio" && sectionRef.current) {
      // Animar o título e descrição
      gsap.fromTo(
        [
          sectionRef.current.querySelector("h2"),
          sectionRef.current.querySelector(".portfolio-description"),
        ],
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: 0.2 }
      );

      // Animar os botões de filtro
      const filterBtns = sectionRef.current.querySelectorAll(".filter-btn");
      gsap.fromTo(
        filterBtns,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.3,
        }
      );

      // Animar os cards
      const portfolioCards = document.querySelectorAll(".portfolio-card");
      gsap.fromTo(
        portfolioCards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
        }
      );
    }
  }, [activeSection]);

  // Animar os cards quando filtrar por categoria
  useEffect(() => {
    if (containerRef.current && filterAnimation) {
      // Animar saída dos cards antigos
      const portfolioCards = Array.from(
        containerRef.current.querySelectorAll(".portfolio-card")
      );

      if (portfolioCards.length > 0) {
        gsap.to(portfolioCards, {
          opacity: 0,
          y: 30,
          scale: 0.9,
          stagger: 0.05,
          duration: 0.3,
          onComplete: () => {
            // Animar entrada dos novos cards depois da filtragem
            const newCards = Array.from(
              containerRef.current.querySelectorAll(".portfolio-card")
            );

            if (newCards.length > 0) {
              gsap.fromTo(
                newCards,
                { opacity: 0, y: 30, scale: 0.9 },
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  stagger: 0.1,
                  duration: 0.5,
                  ease: "back.out(1.7)",
                }
              );
            }

            setFilterAnimation(false);
          },
        });
      }
    }
  }, [selectedCategory, filterAnimation]);

  // Categorias de projetos
  const categories = [
    { id: "all", name: "Todos", icon: "fas fa-border-all" },
    { id: "web", name: "Web", icon: "fas fa-globe" },
    { id: "app", name: "App", icon: "fas fa-mobile-screen" },
    { id: "design", name: "Design", icon: "fas fa-palette" },
  ];

  // Filtrar projetos por categoria
  const filteredProjects =
    selectedCategory === "all"
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  // Projetos atualmente exibidos
  const displayedProjects = filteredProjects.slice(0, displayCount);

  // Função para mudar a categoria
  const handleCategoryChange = (categoryId) => {
    if (categoryId !== selectedCategory) {
      setFilterAnimation(true);
      setSelectedCategory(categoryId);
    }
  };

  // Função para aplicar o efeito 3D no hover
  const handleCardMouseMove = (e, id) => {
    setHoveredCard(id);

    const card = e.currentTarget;
    const cardRect = card.getBoundingClientRect();
    const cardWidth = cardRect.width;
    const cardHeight = cardRect.height;

    // Calcular posição relativa do mouse dentro do card
    const x = e.clientX - cardRect.left;
    const y = e.clientY - cardRect.top;

    // Calcular rotação com base na posição do mouse
    const rotateY = (x / cardWidth - 0.5) * 10; // -5 a 5 graus
    const rotateX = (y / cardHeight - 0.5) * -10; // -5 a 5 graus

    // Aplicar a transformação
    gsap.to(card, {
      rotateY: rotateY,
      rotateX: rotateX,
      scale: 1.05,
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  // Função para resetar o efeito 3D ao sair do hover
  const handleCardMouseLeave = (e) => {
    setHoveredCard(null);

    const card = e.currentTarget;

    gsap.to(card, {
      rotateY: 0,
      rotateX: 0,
      scale: 1,
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
      duration: 0.5,
      ease: "power3.out",
    });
  };

  // Função para abrir o modal com detalhes do projeto
  const openProjectModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // Prevenir rolagem de fundo
  };

  // Função para fechar o modal
  const closeProjectModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = ""; // Restaurar rolagem de fundo

    // Adicionar um pequeno atraso antes de limpar o projeto selecionado para garantir animação de saída
    setTimeout(() => {
      setSelectedProject(null);
    }, 300);
  };

  // Carregar mais projetos com animação
  const loadMoreProjects = () => {
    setIsLoading(true);

    // Simular um tempo de carregamento
    setTimeout(() => {
      setDisplayCount((prev) => prev + 3);
      setIsLoading(false);

      // Animar os novos cards
      setTimeout(() => {
        const newCards = Array.from(
          document.querySelectorAll(".portfolio-card.new-card")
        );

        if (newCards.length > 0) {
          gsap.fromTo(
            newCards,
            { opacity: 0, y: 50, scale: 0.9 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.7,
              stagger: 0.15,
              ease: "back.out(1.7)",
            }
          );
        }
      }, 100);
    }, 1000);
  };

  // Fechar o modal ao pressionar Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isModalOpen) {
        closeProjectModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  // Aplicar efeito de desfoque ao fundo quando o modal está aberto
  useEffect(() => {
    if (isModalOpen) {
      gsap.to(sectionRef.current, {
        filter: "blur(5px)",
        duration: 0.3,
      });
    } else {
      gsap.to(sectionRef.current, {
        filter: "blur(0px)",
        duration: 0.3,
      });
    }
  }, [isModalOpen]);

  // Renderizar os projetos filtrados
  const renderProjects = () => {
    if (!filteredProjects.length) {
      return (
        <div className="no-projects">
          <p>Nenhum projeto encontrado nesta categoria.</p>
        </div>
      );
    }

    return filteredProjects.slice(0, displayCount).map((project, index) => (
      <div
        key={project.id}
        className="js-tilt"
        data-aos="fade-up"
        data-aos-delay={100 + index * 50}
        data-aos-duration="800"
        onMouseEnter={() => setHoveredCard(project.id)}
        onMouseLeave={() => setHoveredCard(null)}
        style={{ "--order": index % 3 }}
        ref={(el) => (projectRefs.current[index] = el)}
      >
        <ProjectCard
          project={project}
          onClick={() => openProjectModal(project)}
          isHovered={hoveredCard === project.id}
        />
      </div>
    ));
  };

  return (
    <section id="portfolio" className="portfolio-section" ref={sectionRef}>
      <div ref={parallaxRef} className="parallax-container"></div>

      <h2>Meu Portfolio</h2>
      <p className="portfolio-description">
        Aqui estão alguns dos meus projetos mais recentes. Cada projeto
        demonstra diferentes aspectos do desenvolvimento web moderno e design
        responsivo.
      </p>

      <div className="portfolio-filter">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`filter-btn ${
              selectedCategory === category.id ? "active" : ""
            }`}
            onClick={() => handleCategoryChange(category.id)}
          >
            <i className={category.icon}></i>
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      <div className="portfolio-container" ref={containerRef}>
        {renderProjects()}
      </div>

      {displayCount < filteredProjects.length && (
        <div className="load-more-container">
          <button
            className="load-more-btn"
            onClick={loadMoreProjects}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                <span>Carregando...</span>
              </>
            ) : (
              <>
                <span>Carregar Mais</span>
                <svg
                  className="btn-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </>
            )}
          </button>
        </div>
      )}

      {/* Modal para exibição detalhada do projeto */}
      {isModalOpen && selectedProject && (
        <div className="modal-backdrop" onClick={closeProjectModal}>
          <div
            className="modal"
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>{selectedProject.title}</h3>
              <button
                className="close-modal"
                onClick={closeProjectModal}
                aria-label="Fechar modal"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-content">
              <div className="modal-image">
                <img
                  src={selectedProject.image}
                  alt={`Captura de tela do projeto ${selectedProject.title}`}
                  loading="lazy"
                />
              </div>

              <div className="modal-description">
                {selectedProject.longDescription || selectedProject.description}
              </div>

              <div className="modal-details">
                <div className="detail-item">
                  <h4>Cliente</h4>
                  <p>{selectedProject.client || "Projeto Pessoal"}</p>
                </div>
                <div className="detail-item">
                  <h4>Data</h4>
                  <p>{selectedProject.date || "Em andamento"}</p>
                </div>
                <div className="detail-item">
                  <h4>Tipo</h4>
                  <p>{selectedProject.type || "Desenvolvimento Web"}</p>
                </div>
              </div>

              <div className="technologies">
                <h4>Tecnologias</h4>
                <div className="tech-tags">
                  {selectedProject.technologies &&
                    selectedProject.technologies.map((tech, index) => (
                      <span key={index} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                </div>
              </div>

              <div className="modal-actions">
                {selectedProject.demoUrl && (
                  <a
                    href={selectedProject.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="modal-btn primary"
                  >
                    <span>Ver Demo</span>
                    <i className="fas fa-external-link-alt"></i>
                  </a>
                )}
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="modal-btn secondary"
                  >
                    <span>Ver Código</span>
                    <i className="fab fa-github"></i>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PortfolioSection;
