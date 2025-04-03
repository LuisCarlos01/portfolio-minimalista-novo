import React from "react";

const FormInput = ({
  type,
  id,
  name,
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  required,
  disabled,
  pattern,
  title,
  minLength,
  icon,
  label,
  error,
  isFocused,
}) => {
  const isTextArea = type === "textarea";
  const InputComponent = isTextArea ? "textarea" : "input";
  const containerClass = isTextArea ? "textarea-container" : "input-container";

  return (
    <div
      className={`form-group ${error ? "has-error" : ""} ${
        isFocused ? "focused" : ""
      }`}
    >
      <label htmlFor={id}>{label}</label>
      <div className={containerClass}>
        {icon}
        <InputComponent
          type={isTextArea ? undefined : type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          aria-required={required}
          disabled={disabled}
          pattern={pattern}
          title={title}
          minLength={minLength}
        />
        <div className="field-animation"></div>
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default FormInput;
