import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useSection } from "../contexts/SectionContext";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' ou 'error'
  const { activeSection } = useSection();
  const formRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef(null);
  const [formErrors, setFormErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const backgroundRef = useRef(null);

  // Validar o formulário
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (value.trim().length < 3) {
          error = "Nome deve ter pelo menos 3 caracteres";
        }
        break;
      case "email":
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value)) {
          error = "Email inválido";
        }
        break;
      case "message":
        if (value.trim().length < 10) {
          error = "Mensagem deve ter pelo menos 10 caracteres";
        }
        break;
      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Validação em tempo real
    const error = validateField(name, value);
    setFormErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);

    // Animação quando um campo recebe foco
    if (formRef.current) {
      const inputField = formRef.current.querySelector(`#${fieldName}`);
      gsap.to(inputField, {
        borderColor: "#9b59b6",
        boxShadow: "0 0 10px rgba(155, 89, 182, 0.5)",
        duration: 0.3,
      });
    }
  };

  const handleBlur = (fieldName) => {
    setFocusedField(null);

    // Resetar a animação quando o campo perde o foco
    if (formRef.current) {
      const inputField = formRef.current.querySelector(`#${fieldName}`);
      gsap.to(inputField, {
        borderColor: formErrors[fieldName] ? "#e74c3c" : "#333",
        boxShadow: formErrors[fieldName]
          ? "0 0 5px rgba(231, 76, 60, 0.5)"
          : "none",
        duration: 0.3,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar todos os campos antes de enviar
    const errors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        errors[key] = error;
      }
    });

    setFormErrors(errors);

    // Se houver erros, não enviar o formulário
    if (Object.keys(errors).length > 0) {
      // Animar campos com erro
      Object.keys(errors).forEach((field) => {
        const element = formRef.current.querySelector(`#${field}`);
        gsap.fromTo(
          element,
          { x: -2 },
          { x: 2, duration: 0.1, repeat: 5, yoyo: true, ease: "power2.inOut" }
        );
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    // Animação de envio
    gsap.to(formRef.current, {
      y: -10,
      opacity: 0.8,
      duration: 0.3,
      onComplete: () => {
        gsap.to(formRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.3,
          delay: 1,
        });
      },
    });
    
    // Simulando o envio do formulário
    setTimeout(() => {
      console.log("Formulário enviado:", formData);
      // Em uma aplicação real, aqui enviaria para um servidor
      setFormData({ name: "", email: "", message: "" });
      setIsSubmitting(false);
      setSubmitStatus("success");
      setSubmitMessage(
        "Mensagem enviada com sucesso! Em breve entraremos em contato."
      );

      // Animação de sucesso com partículas
      createSuccessParticles();
      
      // Limpar a mensagem após 5 segundos
      setTimeout(() => {
        setSubmitMessage("");
        setSubmitStatus(null);

        // Limpar as partículas
        if (particlesRef.current) {
          particlesRef.current.innerHTML = "";
        }
      }, 5000);
    }, 1500);
  };

  // Criar partículas de celebração após o envio com sucesso
  const createSuccessParticles = () => {
    if (!particlesRef.current) return;

    particlesRef.current.innerHTML = "";

    for (let i = 0; i < 50; i++) {
      const particle = document.createElement("div");
      particle.className = "success-particle";

      // Posição aleatória
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;

      // Tamanho aleatório
      const size = Math.random() * 15 + 5;

      // Cor aleatória
      const colors = ["#9b59b6", "#3498db", "#2ecc71", "#f1c40f"];
      const color = colors[Math.floor(Math.random() * colors.length)];

      // Duração aleatória
      const duration = Math.random() * 2 + 1;

      // Atraso aleatório
      const delay = Math.random() * 0.5;

      // Ajustar propriedades CSS
      particle.style.left = `${posX}%`;
      particle.style.top = `${posY}%`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = color;
      particle.style.animation = `particle-animation ${duration}s ease-out ${delay}s`;

      particlesRef.current.appendChild(particle);
    }
  };

  // Efeito de background interativo
  useEffect(() => {
    if (backgroundRef.current && activeSection === "contact") {
      const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const rect = backgroundRef.current.getBoundingClientRect();

        // Calcular posição relativa do mouse dentro do elemento
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        // Mover o gradiente baseado na posição do mouse
        const gradientX = (x / rect.width) * 100;
        const gradientY = (y / rect.height) * 100;

        backgroundRef.current.style.background = `radial-gradient(circle at ${gradientX}% ${gradientY}%, rgba(155, 89, 182, 0.2) 0%, rgba(41, 128, 185, 0.1) 50%, rgba(0, 0, 0, 0) 100%)`;
      };

      backgroundRef.current.addEventListener("mousemove", handleMouseMove);

      return () => {
        if (backgroundRef.current) {
          backgroundRef.current.removeEventListener(
            "mousemove",
            handleMouseMove
          );
        }
      };
    }
  }, [activeSection]);

  // Animação de entrada quando a seção fica ativa
  useEffect(() => {
    if (activeSection === "contact") {
      const section = document.getElementById("contact");

      if (section && !animationRef.current) {
        // Cancelar animação anterior se existir
        if (animationRef.current) {
          animationRef.current.kill();
        }

        // Nova animação
        animationRef.current = gsap.timeline();

        // Animar o título
        animationRef.current.fromTo(
          section.querySelector("h2.section-title"),
          { opacity: 0, y: -30 },
          { opacity: 1, y: 0, duration: 0.7, ease: "back.out(1.7)" },
          0
        );

        // Animar o formulário
        animationRef.current.fromTo(
          section.querySelector(".contact-form"),
          { opacity: 0, x: -50 },
          { opacity: 1, x: 0, duration: 0.7, ease: "power2.out" },
          0.2
        );

        // Animar as informações de contato
        animationRef.current.fromTo(
          section.querySelector(".contact-info"),
          { opacity: 0, x: 50 },
          { opacity: 1, x: 0, duration: 0.7, ease: "power2.out" },
          0.2
        );

        // Animar os ícones de contato um por um
        animationRef.current.fromTo(
          section.querySelectorAll(".contact-info-item"),
          { opacity: 0, y: 20 },
          { 
            opacity: 1, 
            y: 0, 
            stagger: 0.1,
            duration: 0.5,
            ease: "power2.out",
          },
          0.4
        );
      }
    } else {
      // Resetar a referência da animação quando a seção não estiver ativa
      animationRef.current = null;
    }
  }, [activeSection]);

  return (
    <section className="contact-section" id="contact" ref={backgroundRef}>
      <h2 className="section-title animate-item">Entre em Contato</h2>

      <div className="contact-container">
        <div className="contact-form animate-item" ref={formRef}>
          {submitStatus && (
            <div className={`submit-message ${submitStatus}`} role="alert">
              <div className="submit-icon">
                {submitStatus === "success" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                )}
                {submitStatus === "error" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                )}
              </div>
              <p>{submitMessage}</p>
          </div>
        )}

          <div className="particles-container" ref={particlesRef}></div>

        <form onSubmit={handleSubmit} aria-label="Formulário de contato">
            <div
              className={`form-group ${formErrors.name ? "has-error" : ""} ${
                focusedField === "name" ? "focused" : ""
              }`}
            >
            <label htmlFor="name">Seu Nome</label>
              <div className="input-container">
                <svg
                  className="input-icon"
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
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name}
              onChange={handleChange}
                  onFocus={() => handleFocus("name")}
                  onBlur={() => handleBlur("name")}
              placeholder="Digite seu nome" 
              required 
              aria-required="true"
              disabled={isSubmitting}
            />
                <div className="field-animation"></div>
              </div>
              {formErrors.name && (
                <div className="error-message">{formErrors.name}</div>
              )}
          </div>

            <div
              className={`form-group ${formErrors.email ? "has-error" : ""} ${
                focusedField === "email" ? "focused" : ""
              }`}
            >
            <label htmlFor="email">Seu Email</label>
              <div className="input-container">
                <svg
                  className="input-icon"
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
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange}
                  onFocus={() => handleFocus("email")}
                  onBlur={() => handleBlur("email")}
              placeholder="Digite seu email" 
              required 
              aria-required="true"
              disabled={isSubmitting}
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              title="Digite um endereço de email válido"
            />
                <div className="field-animation"></div>
              </div>
              {formErrors.email && (
                <div className="error-message">{formErrors.email}</div>
              )}
          </div>

            <div
              className={`form-group ${formErrors.message ? "has-error" : ""} ${
                focusedField === "message" ? "focused" : ""
              }`}
            >
            <label htmlFor="message">Sua Mensagem</label>
              <div className="textarea-container">
                <svg
                  className="input-icon"
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
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            <textarea 
              id="message" 
              name="message" 
              value={formData.message}
              onChange={handleChange}
                  onFocus={() => handleFocus("message")}
                  onBlur={() => handleBlur("message")}
              placeholder="Escreva sua mensagem" 
              required
              aria-required="true"
              disabled={isSubmitting}
              minLength="10"
            ></textarea>
                <div className="field-animation"></div>
              </div>
              {formErrors.message && (
                <div className="error-message">{formErrors.message}</div>
              )}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            aria-busy={isSubmitting}
              className="submit-button"
            >
              {isSubmitting ? (
                <>
                  <span className="button-spinner"></span>
                  <span>Enviando...</span>
                </>
              ) : (
                <>
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
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                  <span>Enviar Mensagem</span>
                </>
              )}
          </button>
        </form>
      </div>

      <div className="contact-info animate-item">
          <h3>Meus Contatos</h3>

          <div className="contact-info-grid">
            <div className="contact-info-item">
              <div className="contact-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div className="contact-text">
                <h4>Email</h4>
                <a
                  href="mailto:luizcarlosvitorianoneto@gmail.com"
                  className="contact-link"
                >
                  luizcarlosvitorianoneto@gmail.com
                </a>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div className="contact-text">
                <h4>Telefone</h4>
                <a href="tel:+5535997080310" className="contact-link">
                  +55 (35) 99708-0310
                </a>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </div>
              <div className="contact-text">
                <h4>LinkedIn</h4>
                <a
                  href="https://www.linkedin.com/in/luiz-carlos-vitoriano-neto-56a58321b/?trk=opento_sprofile_topcard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                  linkedin.com/in/luiz-carlos
                </a>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </div>
              <div className="contact-text">
                <h4>GitHub</h4>
                <a
                  href="https://github.com/LuisCarlos01"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                  github.com/LuisCarlos01
                </a>
              </div>
            </div>
          </div>

          <div className="social-connect">
            <h4>Conecte-se Comigo</h4>
            <div className="social-icons">
              <a
                href="https://www.linkedin.com/in/luiz-carlos-vitoriano-neto-56a58321b/?trk=opento_sprofile_topcard"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="LinkedIn"
              >
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
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a
                href="https://github.com/LuisCarlos01"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="GitHub"
              >
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
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </a>
              <a
                href="mailto:luizcarlosvitorianoneto@gmail.com"
                className="social-icon"
                aria-label="Email"
              >
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
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </a>
              <a
                href="tel:+5535997080310"
                className="social-icon"
                aria-label="Telefone"
              >
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
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection; 
