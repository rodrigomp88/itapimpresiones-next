"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import SkeletonLoader from "./SkeletonLoader";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
  sizes?: string;
  loading?: "lazy" | "eager";
}

/**
 * Componente OptimizedImage con blur placeholder y lazy loading
 * para mejorar la percepción de carga y rendimiento
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  fill = false,
  className = "",
  priority = false,
  quality = 85,
  placeholder = "empty", // Cambiado de "blur" a "empty" por defecto
  blurDataURL,
  onLoad,
  onError,
  sizes,
  loading = "lazy",
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer para lazy loading
  useEffect(() => {
    if (!imgRef.current || priority || loading === "eager") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "50px 0px", // Precarga antes de que sea visible
        threshold: 0.1,
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [src, priority, loading]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Si es lazy loading y no está visible aún, mostrar skeleton
  if (loading === "lazy" && !priority && imageSrc === "" && imgRef.current) {
    return (
      <div
        ref={imgRef}
        className={`relative overflow-hidden ${fill ? "w-full h-full" : ""}`}
        style={!fill ? { width, height } : undefined}
      >
        <SkeletonLoader
          variant={fill ? "product" : "banner"}
          className={className}
          animated={true}
        />
      </div>
    );
  }

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${fill ? "w-full h-full" : ""} ${className}`}
      style={!fill ? { width, height } : undefined}
    >
      {/* Blur placeholder solo si hay blurDataURL */}
      {!isLoaded && !hasError && placeholder === "blur" && blurDataURL && (
        <motion.div
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={imageSrc}
            alt={alt}
            width={width}
            height={height}
            fill={fill}
            quality={20}
            placeholder="blur"
            blurDataURL={blurDataURL}
            className="filter blur-md scale-110"
            sizes={sizes}
            loading="eager"
            onError={handleError}
          />
        </motion.div>
      )}

      {/* Imagen principal */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{
          opacity: isLoaded ? 1 : 0,
          scale: isLoaded ? 1 : 1.1,
        }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
        }}
      >
        <Image
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          fill={fill}
          quality={quality}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          sizes={sizes}
          loading={loading}
          priority={priority}
          onLoad={handleLoad}
          onError={handleError}
          className={`object-contain transition-all duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          } ${fill ? "object-cover" : "object-contain"}`}
        />
      </motion.div>

      {/* Estados de error */}
      {hasError && (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-100 dark:bg-zinc-800">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-2 opacity-50">
              <svg
                className="w-full h-full"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Imagen no disponible
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
