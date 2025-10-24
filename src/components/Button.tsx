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
  const base =
    "inline-flex items-center justify-center px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";

  const classes = `${base} ${btnVariants[variant]} ${className}`;

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
