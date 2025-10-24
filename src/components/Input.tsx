import React from "react";
import type { InputPropsBase } from "src/shared";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & InputPropsBase;

export default function Input({
  id,
  name,
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  className = "",
  error,
  disabled = false,
  required = false,
  autoComplete,
}: InputProps) {
  const inputStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-text)',
    borderColor: 'var(--color-text-muted)',
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label htmlFor={id} className="mb-1 text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        style={inputStyle}
        className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors
          ${error 
            ? 'border-red-500 focus:ring-red-500' 
            : 'border-gray-200 focus:ring-blue-500'
          }
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
        `}
      />
      {error && (
        <span className="mt-1 text-sm text-red-500">{error}</span>
      )}
    </div>
  );
}
