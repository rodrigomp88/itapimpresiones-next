"use client";

import React from "react";
import { motion } from "framer-motion";

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Componente SkipLink para mejorar la accesibilidad
 * Permite saltar a secciones importantes del sitio
 */
const SkipLink: React.FC<SkipLinkProps> = ({
  href,
  children,
  className = "",
}) => {
  return (
    <motion.a
      href={href}
      className={`skip-link ${className}`}
      initial={{ top: "-40px" }}
      whileFocus={{ top: "6px" }}
      transition={{ duration: 0.3 }}
      whileHover={{ top: "6px" }}
    >
      {children}
    </motion.a>
  );
};

export default SkipLink;
