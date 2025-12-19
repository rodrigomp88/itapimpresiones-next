"use client";

import React from "react";
import { motion } from "framer-motion";

interface SkeletonLoaderProps {
  className?: string;
  variant?: "product" | "banner" | "avatar" | "text" | "button";
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
  animated?: boolean;
}

/**
 * Componente SkeletonLoader con animación shimmer
 * para mejorar la percepción de carga en la aplicación
 */
const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className = "",
  variant = "product",
  width,
  height,
  rounded = true,
  animated = true,
}) => {
  const baseClasses = "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700";
  
  const variantClasses = {
    product: "w-full h-64",
    banner: "w-full h-48 md:h-64",
    avatar: "w-10 h-10",
    text: "h-4",
    button: "h-10 w-24"
  };

  const roundedClass = rounded ? "rounded-lg" : "";
  const animatedClass = animated ? "animate-pulse bg-[length:200%_100%] animate-shimmer" : "";

  const style = {
    width: width || (variantClasses[variant] as string).split(" ")[1]?.replace("h-", "w-"),
    height: height || (variantClasses[variant] as string).split(" ")[0],
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${roundedClass} ${animatedClass} ${className}`}
      style={width || height ? style : undefined}
    />
  );
};

export default SkeletonLoader;
