import { useCallback } from 'react';
import { gsap } from 'gsap';

const useGsapAnimations = () => {
  const animatePreloader = useCallback(() => {
    // Verifica se o preloader existe no DOM
    const preloaderEl = document.querySelector('.preloader h1');
    const preloaderDots = document.querySelector('.preloader-dots');
    const preloaderContent = document.querySelector('.preloader-content');
    if (!preloaderEl) return;

    // Configurar timeline mestre
    const masterTl = gsap.timeline();

    // Configurar timeline de entrada do preloader
    const enterTl = gsap.timeline({
      defaults: {
        ease: 'power3.out'
      }
    });

    // Preparar o conteúdo principal para a transição suave
    const content = document.getElementById('content');
    if (content) {
      // Deixa o conteúdo pronto, mas invisível, para a transição posterior
      content.style.display = 'block';
      content.style.opacity = '0';
      content.style.transform = 'translateY(25px) scale(0.98)';
      content.style.filter = 'blur(10px)';
      
      // Desfocar o conteúdo inicialmente
      gsap.set(content, { 
        opacity: 0, 
        y: 25, 
        scale: 0.98, 
        filter: 'blur(10px)'
      });
    }

    // Animação de entrada do preloader
    enterTl
      .from(preloaderContent, {
        opacity: 0,
        scale: 0.9,
        duration: 0.8
      })
      .from(preloaderEl, {
        opacity: 0,
        y: -30,
        duration: 0.8
      }, '-=0.5')
      .from(preloaderDots, {
        opacity: 0,
        y: 20,
        duration: 0.6
      }, '-=0.4');

    masterTl.add(enterTl);

    // Array de saudações com emojis modernos
    const greetings = [
      "•Olá", 
      "•Hi", 
      "•Ciao", 
      "•Salut", 
      "•Hej", 
      "•Hola", 
      "•Aloha", 
      "•Привет", 
      "•你好", 
      "•こんにちは", 
      "•Bonjour"
    ];
    
    let currentGreetingIndex = 0;
    const greetingElement = document.querySelector('.preloader h1');
    if (!greetingElement) return;

    // Alternar saudações com efeito de fade mais suave
    const interval = setInterval(() => {
      currentGreetingIndex++;
      if (currentGreetingIndex < greetings.length) {
        // Efeito de fade para a troca de saudações com 3D
        gsap.to(greetingElement, {
          opacity: 0.3,
          y: -10,
          rotateX: '10deg',
          duration: 0.4,
          ease: 'power2.out',
          onComplete: () => {
            greetingElement.textContent = greetings[currentGreetingIndex];
            gsap.to(greetingElement, {
              opacity: 1,
              y: 0,
              rotateX: '0deg',
              duration: 0.4,
              ease: 'power2.out'
            });
          }
        });
      } else {
        clearInterval(interval);
        
        const preloader = document.getElementById('preloader');
        const footer = document.querySelector('footer');
        
        if (!preloader) return;

        // Adiciona classe de transição ao body
        document.body.classList.add('transitioning');

        // Animação de saída do preloader com sequência avançada
        const exitTl = gsap.timeline({
          defaults: {
            ease: 'power2.inOut',
          }
        });
        
        // Primeiro anima o conteúdo interno do preloader
        if (preloaderContent) {
          exitTl.to(preloaderContent, {
            opacity: 0,
            y: -30,
            scale: 0.92,
            rotateX: '5deg',
            duration: 0.7,
            ease: 'back.in(1.4)'
          });
        }
        
        // Adiciona efeito de blur e perspectiva ao preloader enquanto desaparece
        exitTl.to(preloader, {
          backdropFilter: 'blur(12px)',
          '-webkit-backdrop-filter': 'blur(12px)',
          perspective: 800,
          duration: 0.8,
          ease: 'power3.inOut'
        }, '-=0.5');
        
        // Depois anima o fundo do preloader com transformação
        exitTl.to(preloader, {
          opacity: 0,
          scale: 1.05,
          duration: 1.2,
          ease: 'power3.inOut',
          onStart: () => {
            // Começa a mostrar o conteúdo enquanto o preloader ainda está desaparecendo
            if (content) {
              // Cria um efeito de "revelar" mais suave para o conteúdo
              gsap.to(content, {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: 'blur(0px)',
                duration: 1.4,
                ease: 'power2.out',
                delay: 0.2,
                onComplete: () => {
                  // Certifica-se de que qualquer transformação inline seja removida
                  content.style.transform = '';
                  content.style.filter = '';
                }
              });
            }
          },
          onComplete: () => {
            if (preloader) preloader.style.display = 'none';
            
            // Mostrar o footer com um efeito de revelar
            if (footer) {
              footer.style.display = 'block';
              
              // Anima os elementos do footer individualmente para um efeito mais refinado
              const footerElements = {
                logo: footer.querySelector('.footer-logo'),
                links: footer.querySelectorAll('.footer-link'),
                social: footer.querySelectorAll('.social-icon')
              };
              
              const footerTl = gsap.timeline({
                onComplete: () => {
                  // Remove a classe de transição quando tudo estiver carregado
                  setTimeout(() => {
                    document.body.classList.remove('transitioning');
                  }, 300);
                }
              });
              
              footerTl
                .fromTo(footer, 
                  { opacity: 0 }, 
                  { opacity: 1, duration: 0.6, ease: 'power2.out' }
                )
                .fromTo(footerElements.logo,
                  { opacity: 0, y: 15, filter: 'blur(5px)' },
                  { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, ease: 'power2.out' },
                  '-=0.2'
                );
                
              if (footerElements.links.length) {
                footerTl.fromTo(footerElements.links,
                  { opacity: 0, y: 10, filter: 'blur(3px)' },
                  { 
                    opacity: 1, 
                    y: 0, 
                    filter: 'blur(0px)', 
                    duration: 0.4, 
                    stagger: 0.05,
                    ease: 'power2.out'
                  },
                  '-=0.2'
                );
              }
              
              if (footerElements.social.length) {
                footerTl.fromTo(footerElements.social,
                  { opacity: 0, y: 10, scale: 0.8 },
                  { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    duration: 0.4, 
                    stagger: 0.05,
                    ease: 'back.out(1.2)'
                  },
                  '-=0.3'
                );
              }
            } else {
              // Remove a classe de transição se não houver footer
              setTimeout(() => {
                document.body.classList.remove('transitioning');
              }, 500);
            }
          }
        });
        
        masterTl.add(exitTl);
      }
    }, 450); // Aumentado ligeiramente o intervalo entre saudações para melhor legibilidade

    // Cleanup function
    return () => {
      clearInterval(interval);
      masterTl.kill();
    };
  }, []);

  const animateHeroSection = useCallback(() => {
    const heroPic = document.querySelector('.hero-pic');
    const heroTexts = document.querySelectorAll('.hero-text h5, .hero-text h1, .hero-text p');
    const buttons = document.querySelectorAll('.btn-group a, .social a');
    
    if (!heroPic || heroTexts.length === 0) return;

    const tl = gsap.timeline({
      defaults: {
        ease: 'power3.out',
        duration: 0.8
      }
    });

    // Animar a foto com um efeito mais suave
    tl.from(heroPic, {
      opacity: 0,
      x: -50,
      scale: 0.95,
      filter: 'blur(5px)',
      duration: 1.2
    });

    // Animar textos com efeito cascata refinado
    if (heroTexts.length > 0) {
      tl.from(heroTexts, {
        opacity: 0,
        y: 30,
        filter: 'blur(3px)',
        stagger: 0.15,
        duration: 0.8
      }, '-=0.7');
    }

    // Animar botões com efeito de escala
    if (buttons.length > 0) {
      tl.from(buttons, {
        opacity: 0,
        y: 20,
        scale: 0.9,
        stagger: 0.08,
        duration: 0.6,
        ease: 'back.out(1.5)'
      }, '-=0.5');
    }

    return tl;
  }, []);

  return {
    animatePreloader,
    animateHeroSection
  };
};

export default useGsapAnimations; 