import React, { useEffect, useRef } from "react";
import Header from "../../layout/Header";
import { gsap } from "gsap";
import Profile from "./Profile";
import HeroText from "./HeroText";
import ActionButtons from "./ActionButtons";
import SocialLinks from "./SocialLinks";

const HeroSection = () => {
  const heroContainerRef = useRef(null);

  // Animação inicial para a hero section
  useEffect(() => {
    // Garantir que o componente esteja montado e os elementos existam
    if (!heroContainerRef.current) return;

    const timeline = gsap.timeline();

    // Usar querySelector a partir do ref para garantir que os elementos existam
    const heroPic = heroContainerRef.current.querySelector(".hero-pic");

    // Converter NodeList para array para evitar o erro
    const heroTextElementsArray = Array.from(
      heroContainerRef.current.querySelectorAll(
        ".hero-text h5, .hero-text h1, .hero-text p"
      )
    );

    const btnGroup = heroContainerRef.current.querySelector(".btn-group");
    const social = heroContainerRef.current.querySelector(".social");

    // Verificar se os elementos existem antes de animá-los
    if (heroPic) {
      timeline.fromTo(
        heroPic,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }
      );
    }

    if (heroTextElementsArray.length > 0) {
      timeline.fromTo(
        heroTextElementsArray,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.2, duration: 0.6, ease: "power2.out" }
      );
    }

    // Agrupar btnGroup e social em um array apenas se ambos existirem
    const animElements = [];
    if (btnGroup) animElements.push(btnGroup);
    if (social) animElements.push(social);

    if (animElements.length > 0) {
      timeline.fromTo(
        animElements,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.2, duration: 0.5, ease: "power2.out" }
      );
    }
  }, []);

  return (
    <div className="hero-header" ref={heroContainerRef}>
      <div className="wrapper">
        <Header />

        <div className="container">
          <Profile />
          <div className="hero-content">
            <HeroText />
            <ActionButtons />
            <SocialLinks />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
