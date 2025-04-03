import React from "react";
import ContactInfo from "./ContactInfo";
import ContactForm from "./ContactForm";
import "./contact.css";

const Contact = () => {
  return (
    <section id="contact" className="contact-section">
      <div className="section-heading">
        <h2 className="section-title">Entre em Contato</h2>
        <div className="section-divider"></div>
        <p className="section-subtitle">
          Vamos conversar sobre o seu projeto ou oportunidade de trabalho
        </p>
      </div>

      <div className="contact-container">
        <div className="contact-info-column">
          <ContactInfo />
        </div>
        <div className="contact-form-column">
          <ContactForm />
        </div>
      </div>
    </section>
  );
};

export default Contact;
