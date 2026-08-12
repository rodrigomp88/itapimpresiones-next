"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle,
} from "react-icons/fa";

interface ErrorFeedbackProps {
  error?: string;
  success?: string;
  info?: string;
  type?: "error" | "success" | "info";
  className?: string;
}

export const ErrorFeedback: React.FC<ErrorFeedbackProps> = ({
  error,
  success,
  info,
  type = "error",
  className = "",
}) => {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <FaCheckCircle className="w-4 h-4" />;
      case "info":
        return <FaInfoCircle className="w-4 h-4" />;
      default:
        return <FaExclamationTriangle className="w-4 h-4" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case "success":
        return "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800";
      case "info":
        return "bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800";
      default:
        return "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800";
    }
  };

  const message = error || success || info;

  if (!message) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className={`flex items-center gap-2 px-3 py-2 rounded-md border text-sm font-medium ${getColors()} ${className}`}
        role="alert"
        aria-live="polite"
      >
        {getIcon()}
        <span>{message}</span>
      </motion.div>
    </AnimatePresence>
  );
};

interface FieldErrorProps {
  error?: string;
  touched?: boolean;
}

export const FieldError: React.FC<FieldErrorProps> = ({
  error,
  touched = true,
}) => {
  if (!error || !touched) return null;

  return (
    <motion.p
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="text-red-600 dark:text-red-400 text-xs mt-1 flex items-center gap-1"
      role="alert"
      aria-live="polite"
    >
      <FaExclamationTriangle className="w-3 h-3 flex-shrink-0" />
      <span>{error}</span>
    </motion.p>
  );
};

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  touched?: boolean;
  icon?: React.ReactNode;
  success?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  touched = true,
  icon,
  success,
  className = "",
  ...props
}) => {
  const inputClasses = `
    w-full px-3 py-2 rounded-md border transition-all duration-200
    focus:ring-2 focus:ring-primary/50 focus:border-primary
    ${
      error && touched
        ? "border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/10"
        : success && touched
          ? "border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/10"
          : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
    }
    ${className}
  `.trim();

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span
              className={`text-gray-400 ${error ? "text-red-400" : success ? "text-green-400" : ""}`}
            >
              {icon}
            </span>
          </div>
        )}
        <input
          className={`${inputClasses} ${icon ? "pl-10" : ""}`}
          {...props}
          aria-invalid={error && touched ? "true" : "false"}
          aria-describedby={error && touched ? `${props.id}-error` : undefined}
        />
        {success && touched && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <FaCheckCircle className="w-4 h-4 text-green-500" />
          </div>
        )}
      </div>
      <FieldError error={error} touched={touched} />
    </div>
  );
};

interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  touched?: boolean;
  success?: boolean;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  error,
  touched = true,
  success,
  className = "",
  ...props
}) => {
  const inputClasses = `
    w-full px-3 py-2 rounded-md border transition-all duration-200 resize-none
    focus:ring-2 focus:ring-primary/50 focus:border-primary
    ${
      error && touched
        ? "border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/10"
        : success && touched
          ? "border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/10"
          : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
    }
    ${className}
  `.trim();

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <textarea
        className={inputClasses}
        {...props}
        aria-invalid={error && touched ? "true" : "false"}
        aria-describedby={error && touched ? `${props.id}-error` : undefined}
      />
      <FieldError error={error} touched={touched} />
    </div>
  );
};

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  touched?: boolean;
  success?: boolean;
  options: { value: string; label: string }[];
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  error,
  touched = true,
  success,
  options,
  className = "",
  ...props
}) => {
  const inputClasses = `
    w-full px-3 py-2 rounded-md border transition-all duration-200
    focus:ring-2 focus:ring-primary/50 focus:border-primary
    ${
      error && touched
        ? "border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/10"
        : success && touched
          ? "border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/10"
          : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
    }
    ${className}
  `.trim();

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <select
        className={inputClasses}
        {...props}
        aria-invalid={error && touched ? "true" : "false"}
        aria-describedby={error && touched ? `${props.id}-error` : undefined}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FieldError error={error} touched={touched} />
    </div>
  );
};
