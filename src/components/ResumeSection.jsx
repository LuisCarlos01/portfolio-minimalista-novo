import React, { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { useSection } from "../contexts/SectionContext";

const ResumeSection = () => {
  const { activeSection } = useSection();
  const [activeTab, setActiveTab] = useState("experience");
  const timelineRef = useRef(null);
  const sectionRef = useRef(null);
  const animationRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});

  // Toggle da expansão de um item
  const toggleExpand = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  // Verificar se o item está expandido
  const isExpanded = (itemId) => {
    return expandedItems[itemId] || false;
  };

  // Efeito para verificar a visibilidade da seção
  useEffect(() => {
    setIsVisible(activeSection === "resume");
  }, [activeSection]);

  // Construção da timeline interativa
  useEffect(() => {
    if (isVisible && timelineRef.current) {
      // Destaque das linhas conectando os itens da timeline
      const timelinePath =
        timelineRef.current.querySelectorAll(".timeline-line");
      gsap.fromTo(
        timelinePath,
        { height: 0 },
        {
          height: "100%",
          duration: 1.5,
          ease: "power3.out",
          stagger: 0.3,
        }
      );

      // Animação dos pontos na timeline
      const timelinePoints =
        timelineRef.current.querySelectorAll(".timeline-point");
      gsap.fromTo(
        timelinePoints,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          stagger: 0.3,
          ease: "back.out(1.7)",
          delay: 0.2,
        }
      );
    }
  }, [isVisible, activeTab]);

  // Animação para os itens do resume
  useEffect(() => {
    if (activeSection === "resume") {
      if (animationRef.current) {
        animationRef.current.kill();
      }

      const tl = gsap.timeline();
      animationRef.current = tl;

      // Animar o cabeçalho
      tl.fromTo(
        ".resume-header",
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );

      // Animar as tabs
      tl.fromTo(
        ".resume-tabs",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        "-=0.3"
      );

      // Animar os itens ativos
      tl.fromTo(
        `.resume-content-${activeTab} .resume-item`,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.15,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.2"
      );
    }
  }, [activeSection, activeTab]);

  // Dados de experiência profissional
  const experienceData = [
    {
      id: "exp1",
      title: "Desenvolvedor Backend",
      company: "TechSolutions Brasil",
      period: "2021 - Presente",
      description:
        "Desenvolvimento de APIs RESTful, implementação de microserviços, integração com bancos de dados, otimização de desempenho e segurança de sistemas web.",
      achievements: [
        "Reduzi o tempo de resposta das APIs em 40% através de otimizações de banco de dados.",
        "Implementei autenticação JWT e autorização baseada em roles para todas as APIs.",
        "Desenvolvi uma arquitetura de microserviços escalável usando Node.js e Docker.",
      ],
      skills: ["Node.js", "Express", "MongoDB", "Docker", "REST API"],
    },
    {
      id: "exp2",
      title: "Desenvolvedor Web Freelancer",
      company: "Autônomo",
      period: "2019 - 2021",
      description:
        "Desenvolvimento de sites responsivos e aplicações web para pequenas e médias empresas, utilizando HTML5, CSS3, JavaScript e React.",
      achievements: [
        "Criei mais de 15 sites responsivos para clientes em diversos setores.",
        "Desenvolvi soluções de e-commerce personalizadas para 5 lojas virtuais.",
      ],
      skills: ["React", "JavaScript", "HTML/CSS", "UI/UX", "Wordpress"],
    },
  ];

  // Dados de educação
  const educationData = [
    {
      id: "edu1",
      title: "Bacharelado em Ciência da Computação",
      institution: "Universidade Federal de São Paulo",
      period: "2017 - 2021",
      description:
        "Formação completa em Ciência da Computação, com foco em desenvolvimento de software, algoritmos e estruturas de dados, redes de computadores e inteligência artificial.",
      achievements: [
        "TCC: 'Implementação de algoritmos de aprendizado de máquina para detecção de fraudes'",
        "Participação em projetos de iniciação científica na área de IA",
      ],
      courses: [
        "Algoritmos Avançados",
        "Desenvolvimento Web",
        "Inteligência Artificial",
        "Segurança da Informação",
      ],
    },
  ];

  // Dados de certificações
  const certificationsData = [
    {
      id: "cert1",
      title: "AWS Certified Developer - Associate",
      institution: "Amazon Web Services",
      period: "2022",
      description:
        "Certificação que valida habilidades em desenvolvimento, implantação e depuração de aplicativos baseados na nuvem AWS.",
      skills: ["Lambda", "API Gateway", "DynamoDB", "S3", "CloudFormation"],
    },
    {
      id: "cert2",
      title: "Node.js Application Developer",
      institution: "OpenJS Foundation",
      period: "2021",
      description:
        "Certificação da OpenJS Foundation que valida conhecimentos avançados em desenvolvimento de aplicações com Node.js.",
      skills: [
        "Express.js",
        "RESTful APIs",
        "Autenticação",
        "MongoDB",
        "Websockets",
      ],
    },
    {
      id: "cert3",
      title: "React Developer",
      institution: "Meta (Facebook)",
      period: "2020",
      description:
        "Certificação que valida habilidades em desenvolvimento de interfaces de usuário modernas com React.",
      skills: ["React", "Redux", "Hooks", "React Router", "Context API"],
    },
  ];

  // Renderizar a lista de itens baseado na tab ativa
  const renderItems = () => {
    let data = [];

    switch (activeTab) {
      case "experience":
        data = experienceData;
        break;
      case "education":
        data = educationData;
        break;
      case "certifications":
        data = certificationsData;
        break;
      default:
        data = experienceData;
    }

    return (
      <div className={`resume-timeline-container`} ref={timelineRef}>
        {data.map((item, index) => (
          <div
            className={`resume-item ${isExpanded(item.id) ? "expanded" : ""}`}
            key={item.id}
          >
            <div className="timeline-marker">
              <div className="timeline-point"></div>
              {index < data.length - 1 && <div className="timeline-line"></div>}
            </div>

            <div
              className="resume-content"
              onClick={() => toggleExpand(item.id)}
            >
              <div className="resume-header">
                <div className="resume-title">
                  <h4>{item.title}</h4>
                  <h5>{item.company || item.institution}</h5>
                </div>
                <span className="resume-date">{item.period}</span>
              </div>

              <p className="resume-description">{item.description}</p>

              {isExpanded(item.id) && (
                <div className="resume-details">
                  {item.achievements && (
                    <div className="achievements-section">
                      <h5 className="detail-title">Conquistas</h5>
                      <ul className="resume-achievements">
                        {item.achievements.map((achievement, i) => (
                          <li key={i}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {item.courses && (
                    <div className="courses-section">
                      <h5 className="detail-title">Disciplinas Principais</h5>
                      <ul className="resume-courses">
                        {item.courses.map((course, i) => (
                          <li key={i}>{course}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {item.skills && (
                    <div className="skills-section">
                      <h5 className="detail-title">Habilidades</h5>
                      <div className="resume-skills">
                        {item.skills.map((skill, i) => (
                          <span key={i} className="skill-tag">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="toggle-details">
                <button
                  className="toggle-button"
                  aria-label={
                    isExpanded(item.id)
                      ? "Ocultar detalhes"
                      : "Mostrar detalhes"
                  }
                >
                  {isExpanded(item.id) ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="16"></line>
                      <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="resume-section" id="resume-section" ref={sectionRef}>
      <div className="resume-container">
      <h2 className="resume-header">Meu Currículo</h2>
      <p className="section-description">
        Minha trajetória profissional e acadêmica até o momento.
      </p>

        <div className="resume-tabs">
          <button
            className={`tab-button ${
              activeTab === "experience" ? "active" : ""
            }`}
            onClick={() => setActiveTab("experience")}
          >
            <svg
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
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
            <span>Experiência</span>
          </button>

          <button
            className={`tab-button ${
              activeTab === "education" ? "active" : ""
            }`}
            onClick={() => setActiveTab("education")}
          >
            <svg
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
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
            </svg>
            <span>Educação</span>
          </button>

          <button
            className={`tab-button ${
              activeTab === "certifications" ? "active" : ""
            }`}
            onClick={() => setActiveTab("certifications")}
          >
            <svg
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
              <rect x="3" y="5" width="18" height="14" rx="2"></rect>
              <path d="M3 7l9 6 9-6"></path>
              <line x1="8" y1="14" x2="10" y2="14"></line>
              <line x1="8" y1="16" x2="15" y2="16"></line>
            </svg>
            <span>Certificações</span>
          </button>
        </div>

        <div className="resume-content-wrapper">
          <div className={`resume-content resume-content-${activeTab}`}>
            {renderItems()}
          </div>
        </div>

        <div className="resume-download">
          <a href="#" className="download-button" download>
            <svg
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
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>Baixar Currículo PDF</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ResumeSection;
