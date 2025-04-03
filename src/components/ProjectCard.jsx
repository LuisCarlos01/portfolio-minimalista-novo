import React, { useState, useEffect } from "react";

const ProjectCard = ({ project, onClick, isHovered }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Importante: Forçar o reload da imagem após a primeira montagem do componente
  useEffect(() => {
    // Solução para garantir que o navegador tente carregar a imagem novamente
    const preloadImage = new Image();
    preloadImage.src = project.imageUrl;
    preloadImage.onload = () => setImageLoaded(true);
    preloadImage.onerror = () => setImageError(true);

    return () => {
      preloadImage.onload = null;
      preloadImage.onerror = null;
    };
  }, [project.imageUrl]);

  // Monitorar mudanças na propriedade isHovered (controle do componente pai)
  useEffect(() => {
    if (isHovered) {
      setIsImageHovered(true);
    } else {
      setIsImageHovered(false);
    }
  }, [isHovered]);

  // Determinar a URL correta para o GitHub
  const getGithubUrl = () => {
    // Verificar se o título contém "Dashboard" ou "dashboard"
    if (project.title.toLowerCase().includes("dashboard")) {
      return "https://github.com/LuisCarlos01/Dashboard-interativa";
    }
    // Caso contrário, usar a URL fornecida no projeto
    return project.githubUrl;
  };

  // Função para navegar para o GitHub ao clicar na área da imagem
  const handleImageClick = () => {
    window.open(getGithubUrl(), "_blank", "noopener,noreferrer");
  };

  // Função para parar a propagação do evento para os botões
  const handleButtonClick = (e) => {
    e.stopPropagation();
  };

  // Função para abrir o link da demo ou GitHub se a demo não estiver disponível
  const handleDemoClick = (e) => {
    e.stopPropagation();
    const targetUrl = project.demoUrl || getGithubUrl();
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  // Fechar o modal ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalOpen && !e.target.closest(".preview-modal-content")) {
        setModalOpen(false);
      }
    };

    if (modalOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [modalOpen]);

  // Lidar com o carregamento da imagem
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Extrair as tecnologias do projeto ou usar padrão
  const technologies = project.technologies || ["HTML", "CSS", "JavaScript"];
  // Limitar a 3 tecnologias para o card
  const limitedTechnologies = technologies.slice(0, 3);

  return (
    <div
      className={`portfolio-card ${isImageHovered ? "hovered" : ""} ${
        imageLoaded ? "loaded" : "loading"
      }`}
      onClick={() => onClick && onClick(project)}
    >
      <div className="card-img-container">
        {!imageLoaded && (
          <div className="image-loading">
            <div className="loading-spinner"></div>
          </div>
        )}
        <img
          src={project.imageUrl}
          alt={project.title}
          onLoad={handleImageLoad}
          style={{ opacity: imageLoaded ? 1 : 0 }}
        />
        <div className="img-overlay"></div>
        <button
          className="enlarge-btn"
          onClick={(e) => {
            e.stopPropagation();
            onClick && onClick(project);
          }}
        >
          <i className="fa-solid fa-expand"></i>
        </button>
      </div>

      <div className="card-body">
        <span className="project-category">{project.category}</span>
        <h3 className="project-title">{project.title}</h3>
        <p className="project-description">
          {project.description && project.description.length > 100
            ? `${project.description.substring(0, 100)}...`
            : project.description}
        </p>

        <div className="card-footer">
          <div className="project-tech">
            {limitedTechnologies.map((tech, index) => (
              <span key={index} className="tech-tag">
                {tech}
              </span>
            ))}
            {technologies.length > 3 && (
              <span className="tech-tag more">+{technologies.length - 3}</span>
            )}
          </div>

          {project.demoUrl && (
            <a
              href={project.demoUrl}
              className="card-link-icon"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label="Ver demonstração"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* Efeitos de iluminação para o hover 3D */}
      <div className="card-3d-shine"></div>
      <div className="card-3d-edge"></div>
    </div>
  );
};

export default ProjectCard;
