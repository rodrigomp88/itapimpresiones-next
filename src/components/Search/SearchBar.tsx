"use client";

import { useState, useEffect, useRef } from "react";
import { HiSearch, HiX, HiTrendingUp } from "react-icons/hi";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (query: string) => void;
  placeholder?: string;
  className?: string;
  suggestions?: string[];
  onSelectSuggestion?: (suggestion: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Buscar productos...",
  className = "",
  suggestions = [],
  onSelectSuggestion,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Búsquedas populares como fallback
  const popularSearches = [
    "Remeras personalizadas",
    "Bolsas ecológicas",
    "Gorras bordadas",
    "Buzos corporativos",
    "Indumentaria laboral",
  ];

  const allSuggestions = suggestions.length > 0 ? suggestions : popularSearches;

  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && onSubmit) {
      onSubmit(value.trim());
    }
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  // Manejar selección de sugerencia
  const handleSuggestionSelect = (suggestion: string) => {
    onChange(suggestion);
    if (onSelectSuggestion) {
      onSelectSuggestion(suggestion);
    }
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  // Manejar navegación con teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || allSuggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < allSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : allSuggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSuggestionSelect(allSuggestions[highlightedIndex]);
        } else {
          handleSubmit(e);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Cerrar sugerencias al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mostrar sugerencias cuando hay focus y texto
  useEffect(() => {
    if (isFocused && (value.length > 0 || allSuggestions.length > 0)) {
      setShowSuggestions(true);
      setHighlightedIndex(-1);
    } else {
      setShowSuggestions(false);
    }
  }, [isFocused, value, allSuggestions.length]);

  return (
    <div className={`relative w-full max-w-2xl ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`relative flex items-center bg-white dark:bg-zinc-800 border-2 rounded-xl transition-all duration-200 ${
            isFocused
              ? "border-blue-500 shadow-lg ring-2 ring-blue-500/20"
              : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
          }`}
        >
          {/* Icono de búsqueda */}
          <div className="pl-4 pr-2">
            <HiSearch
              className={`w-5 h-5 transition-colors ${
                isFocused ? "text-blue-500" : "text-zinc-400"
              }`}
            />
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 150)} // Delay para permitir clicks en sugerencias
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 py-3 pr-10 bg-transparent border-0 outline-none text-prussian-blue dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400"
            autoComplete="off"
          />

          {/* Botón limpiar */}
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange("");
                setShowSuggestions(false);
                inputRef.current?.focus();
              }}
              className="pr-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors min-h-[44px] min-w-[44px] flex items-center"
            >
              <HiX className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>

      {/* Panel de sugerencias */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto"
          >
            {/* Sugerencias de búsqueda */}
            {allSuggestions.length > 0 && (
              <div className="py-2">
                <div className="px-4 py-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                  {value.length > 0 ? "Sugerencias" : "Búsquedas populares"}
                </div>
                {allSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className={`w-full text-left px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors flex items-center gap-3 ${
                      highlightedIndex === index
                        ? "bg-primary/5 dark:bg-primary/20"
                        : ""
                    }`}
                  >
                    {value.length === 0 && (
                      <HiTrendingUp className="w-4 h-4 text-zinc-400" />
                    )}
                    <HiSearch className="w-4 h-4 text-zinc-400" />
                    <span className="text-prussian-blue dark:text-white flex-1">
                      {suggestion}
                    </span>
                    {value.length > 0 && (
                      <span className="text-xs text-zinc-400">Buscar</span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Enlaces rápidos */}
            {value.length === 0 && (
              <div className="border-t border-zinc-200 dark:border-zinc-700 py-2">
                <div className="px-4 py-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                  Categorías
                </div>
                <Link
                  href="/tienda?category=Remeras"
                  onClick={() => setShowSuggestions(false)}
                  className="block w-full text-left px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors text-zinc-700 dark:text-zinc-300"
                >
                  Remeras
                </Link>
                <Link
                  href="/tienda?category=Bolsas"
                  onClick={() => setShowSuggestions(false)}
                  className="block w-full text-left px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors text-zinc-700 dark:text-zinc-300"
                >
                  Bolsas
                </Link>
                <Link
                  href="/tienda?category=Gorras"
                  onClick={() => setShowSuggestions(false)}
                  className="block w-full text-left px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors text-zinc-700 dark:text-zinc-300"
                >
                  Gorras
                </Link>
                <Link
                  href="/tienda?category=Buzos"
                  onClick={() => setShowSuggestions(false)}
                  className="block w-full text-left px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors text-zinc-700 dark:text-zinc-300"
                >
                  Buzos
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
