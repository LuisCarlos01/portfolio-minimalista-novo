import React, { useEffect } from 'react';
import '../styles/preloader.css';
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
      <h1>•olá</h1>
    </div>
  );
};

export default Preloader; 