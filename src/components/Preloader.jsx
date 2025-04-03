import React, { useEffect } from 'react';
// Estilos são importados centralmente em src/styles/index.js
import useGsapAnimations from '../hooks/useGsapAnimations';

const Preloader = () => {
  const { animatePreloader } = useGsapAnimations();

  useEffect(() => {
    // Pequeno atraso para garantir que o DOM esteja pronto
    const timer = setTimeout(() => {
      animatePreloader();
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [animatePreloader]);

  return (
    <div className="preloader" id="preloader">
      <div className="preloader-content">
        <h1>•olá</h1>
        <div className="preloader-dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
    </div>
  );
};

export default Preloader; 