import React, { useRef, useEffect } from "react";
import Typed from "typed.js";

const Profile = () => {
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
    <div className="hero-pic">
      <img src="/images/photos/perfil.jpg" alt="Luis Carlos profile" />
    </div>
  );
};

export default Profile;
