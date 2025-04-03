import React from "react";

const SocialLinks = () => {
  return (
    <div className="social">
      <a
        href="https://www.linkedin.com/in/luiz-carlos-vitoriano-neto-56a58321b/?trk=opento_sprofile_topcard"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
      >
        <i className="fa-brands fa-linkedin"></i>
      </a>
      <a
        href="https://github.com/LuisCarlos01"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
      >
        <i className="fa-brands fa-github"></i>
      </a>
    </div>
  );
};

export default SocialLinks;
