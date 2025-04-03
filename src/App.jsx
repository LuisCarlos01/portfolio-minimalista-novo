import React, { useEffect } from "react";
import Preloader from "./components/Preloader";
import HeroSection from "./components/HeroSection";
import SkillsSection from "./components/SkillsSection";
import PortfolioSection from "./components/PortfolioSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import FloatingAboutButton from "./components/FloatingAboutButton";
import { SectionProvider } from "./contexts/SectionContext";
import ResumeSection from "./components/ResumeSection";
import "./styles/style.css";
import "./styles/skill-modal.css";

function App() {
  // Efeito para aplicar estilos iniciais às seções
  useEffect(() => {
    // Garantir que a seção home seja visível inicialmente
    const homeSection = document.getElementById("home");
    if (homeSection) {
      homeSection.style.display = "block";
      homeSection.style.opacity = "1";
    }

    // Garantir que as outras seções estejam ocultas inicialmente
    const otherSections = document.querySelectorAll(
      ".section-container:not(#home)"
    );
    otherSections.forEach((section) => {
      section.style.display = "none";
      section.style.opacity = "0";
    });

    // Verificar se há algum hash na URL e mostrar a seção correspondente
    const hash = window.location.hash.replace("#", "");
    if (
      hash &&
      ["home", "skills", "portfolio", "contact", "resume"].includes(hash)
    ) {
      const hashSection = document.getElementById(hash);
      if (hashSection) {
        // Ocultar todas as seções
        document.querySelectorAll(".section-container").forEach((section) => {
          section.style.display = "none";
          section.style.opacity = "0";
        });

        // Mostrar a seção do hash
        hashSection.style.display = "block";
        hashSection.style.opacity = "1";
      }
    }
  }, []);

  return (
    <SectionProvider>
      <div className="app-container">
        <Preloader />
        <div className="content" id="content">
          <div id="home" className="section-container">
            <HeroSection />
          </div>
          <div id="skills" className="section-container">
            <SkillsSection />
          </div>
          <div id="portfolio" className="section-container">
            <PortfolioSection />
          </div>
          <div id="contact" className="section-container">
            <ContactSection />
          </div>
          <div id="resume" className="section-container">
            <ResumeSection />
          </div>
        </div>
        <FloatingAboutButton />
        <Footer />
      </div>
    </SectionProvider>
  );
}

export default App;
