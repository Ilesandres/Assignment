import React from "react";

type CardProps = {
  children?: React.ReactNode;
  className?: string;
  title?: string;
};

export default function Card({ children, className = "", title }: CardProps) {
  return (
    <div className={`bg-white border border-gray-100 shadow-sm rounded-lg p-4 ${className}`}>
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      <div>{children}</div>
    </div>
  );
}
