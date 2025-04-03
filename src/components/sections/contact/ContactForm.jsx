import React, { useState, useEffect } from "react";
import FormInput from "./FormInput";
import { FaUser, FaEnvelope, FaPen, FaCommentAlt } from "react-icons/fa";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Limpa o erro do campo quando o usuário digita algo
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleFocus = (field) => {
    setFocused({
      ...focused,
      [field]: true,
    });
  };

  const handleBlur = (field) => {
    setFocused({
      ...focused,
      [field]: false,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Assunto é obrigatório";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Mensagem é obrigatória";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Mensagem deve ter pelo menos 10 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setFormStatus("sending");

    try {
      // Simular o envio do formulário (em um ambiente real, isso seria uma chamada de API)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simula sucesso
      setFormStatus("success");

      // Limpa o formulário
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      // Limpa o status após alguns segundos
      setTimeout(() => {
        setFormStatus(null);
      }, 5000);
    } catch (error) {
      setFormStatus("error");
      console.error("Erro ao enviar formulário:", error);

      // Limpa o status de erro após alguns segundos
      setTimeout(() => {
        setFormStatus(null);
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Para limpar os status de sucesso/erro após navegação
  useEffect(() => {
    return () => {
      if (formStatus) {
        setFormStatus(null);
      }
    };
  }, [formStatus]);

  return (
    <div className="contact-form-container">
      <h3 className="form-title">Envie-me uma mensagem</h3>
      <p className="form-subtitle">
        Preencha o formulário abaixo e entrarei em contato o mais breve
        possível.
      </p>

      {formStatus === "success" && (
        <div className="form-status success">
          Mensagem enviada com sucesso! Entrarei em contato em breve.
        </div>
      )}

      {formStatus === "error" && (
        <div className="form-status error">
          Houve um erro ao enviar sua mensagem. Por favor, tente novamente.
        </div>
      )}

      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-row">
          <FormInput
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onFocus={() => handleFocus("name")}
            onBlur={() => handleBlur("name")}
            placeholder="Seu nome"
            required
            icon={<FaUser />}
            label="Nome"
            error={errors.name}
            isFocused={focused.name}
          />

          <FormInput
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onFocus={() => handleFocus("email")}
            onBlur={() => handleBlur("email")}
            placeholder="Seu email"
            required
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            icon={<FaEnvelope />}
            label="Email"
            error={errors.email}
            isFocused={focused.email}
          />
        </div>

        <FormInput
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          onFocus={() => handleFocus("subject")}
          onBlur={() => handleBlur("subject")}
          placeholder="Assunto"
          required
          icon={<FaPen />}
          label="Assunto"
          error={errors.subject}
          isFocused={focused.subject}
        />

        <FormInput
          type="textarea"
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          onFocus={() => handleFocus("message")}
          onBlur={() => handleBlur("message")}
          placeholder="Sua mensagem"
          required
          minLength={10}
          icon={<FaCommentAlt />}
          label="Mensagem"
          error={errors.message}
          isFocused={focused.message}
        />

        <button
          type="submit"
          className={`submit-button ${isSubmitting ? "loading" : ""}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
