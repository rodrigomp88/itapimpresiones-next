"use client";

import React from "react";

interface InkBlobProps {
  color?: string;
  className?: string;
  variant?: "top" | "bottom" | "left" | "right" | "center";
  opacity?: number;
}

/**
 * InkBlob — Componente de mancha de tinta SVG para transiciones orgánicas
 * Se usa para romper las líneas rectas entre secciones
 */
const InkBlob: React.FC<InkBlobProps> = ({
  color = "var(--color-primary)",
  className = "",
  variant = "bottom",
  opacity = 0.15,
}) => {
  const getTransform = () => {
    switch (variant) {
      case "top":
        return "rotate(180deg)";
      case "left":
        return "rotate(90deg)";
      case "right":
        return "rotate(-90deg)";
      case "center":
        return "rotate(45deg)";
      default:
        return "none";
    }
  };

  return (
    <div
      className={`absolute pointer-events-none ${className}`}
      style={{
        transform: getTransform(),
        opacity,
      }}
    >
      <svg
        viewBox="0 0 1200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        preserveAspectRatio="none"
      >
        <path
          d="M0,100 C150,180 350,0 600,100 C850,200 1050,20 1200,100 L1200,200 L0,200 Z"
          fill={color}
        />
        <path
          d="M0,120 C200,60 400,180 700,80 C900,20 1100,140 1200,80 L1200,200 L0,200 Z"
          fill={color}
          opacity="0.5"
        />
      </svg>
    </div>
  );
};

export default InkBlob;
