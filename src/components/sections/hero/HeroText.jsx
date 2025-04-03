import React, { useRef, useEffect } from "react";
import Typed from "typed.js";

const HeroText = () => {
  const typedElement = useRef(null);

  // Usando Typed.js para efeito de digitação
  useEffect(() => {
    if (!typedElement.current) return;

    const typed = new Typed(typedElement.current, {
      strings: ["Freelancer", "Front-end Developer", "Web Developer"],
      typeSpeed: 100,
      backSpeed: 100,
      backDelay: 1000,
      loop: true,
    });

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <div className="hero-text">
      <h5>
        Hi I'm{" "}
        <span className="input" ref={typedElement}>
          Freelancer
        </span>
      </h5>
      <h1>Luís Carlos</h1>
      <p id="passionText">
        Creating robust and efficient backend architectures is not just my
        profession; It's my passion!
      </p>
    </div>
  );
};

export default HeroText;
