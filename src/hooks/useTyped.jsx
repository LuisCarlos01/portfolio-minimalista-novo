import { useEffect, useRef } from "react";
import Typed from "typed.js";

const useTyped = (strings, options = {}) => {
  const element = useRef(null);

  useEffect(() => {
    const typed = new Typed(element.current, {
      strings,
      typeSpeed: 100,
      backSpeed: 80,
      backDelay: 1500,
      loop: true,
      ...options,
    });

    return () => {
      typed.destroy();
    };
  }, [strings, options]);

  return element;
};

export default useTyped;
