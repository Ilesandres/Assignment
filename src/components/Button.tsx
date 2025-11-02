import React from "react";
import { btnVariants } from "../shared/ui";
import type { ButtonVariant } from "../shared/types";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  const baseClass =
    "inline-flex items-center justify-center px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md";

  const style: React.CSSProperties = {
    backgroundColor: variant === "primary" ? 'var(--color-primary)' : 'var(--color-secondary)',
    color: variant === "primary" ? 'white' : 'black',
  };

  return (
    <button className={`${baseClass} ${className}`} style={style} {...rest}>
      {children}
    </button>
  );
}
