"use client";

import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaAngleRight,
  FaEnvelope,
  FaLock,
  FaCheckCircle,
  FaEnvelopeOpenText,
} from "react-icons/fa";
import { auth } from "@/firebase/config";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectPreviousURL, SAVE_URL } from "@/redux/slice/cartSlice";
import { motion } from "framer-motion";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const router = useRouter();

  const previousURL = useAppSelector(selectPreviousURL);
  const dispatch = useAppDispatch();

  const registerUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Las contraseñas no coinciden.");
      setIsLoading(false);
      return;
    }

    try {
      // 1. Crear usuario en Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // 2. Enviar correo de verificación
      await sendEmailVerification(userCredential.user);

      // 3. Cambiar estado para mostrar la UI de verificación
      setIsVerificationSent(true);
      setIsLoading(false);

      // No iniciamos sesión en NextAuth automáticamente aquí.
      // Forzamos al usuario a verificar y luego loguearse.
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setError("Este correo electrónico ya está registrado.");
      } else if (error.code === "auth/weak-password") {
        setError("La contraseña debe tener al menos 6 caracteres.");
      } else {
        setError("Ocurrió un error inesperado. Por favor, inténtelo de nuevo.");
      }
      setIsLoading(false);
    }
  };

  // --- VISTA DE EMAIL ENVIADO ---
  if (isVerificationSent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8 text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-primary/10 p-4 rounded-full">
            <FaEnvelopeOpenText className="text-4xl text-primary" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          ¡Verifica tu correo!
        </h1>

        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
          Hemos enviado un enlace de confirmación a: <br />
          <span className="font-semibold text-zinc-900 dark:text-zinc-200">
            {email}
          </span>
        </p>

        <p className="text-sm text-zinc-500 dark:text-zinc-500 mb-8">
          Por favor, revisa tu bandeja de entrada (y spam) y haz clic en el
          enlace para activar tu cuenta.
        </p>

        <Link
          href="/auth/login"
          className="w-full bg-primary hover:bg-primary/90 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-200 flex items-center justify-center gap-2"
        >
          Ya verifiqué, ir a Iniciar Sesión
          <FaAngleRight />
        </Link>
      </motion.div>
    );
  }

  // --- VISTA DE FORMULARIO (NORMAL) ---
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8"
    >
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
          Crea tu cuenta
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Únete a nosotros en pocos pasos
        </p>
      </div>

      <form onSubmit={registerUser} className="space-y-5">
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm text-center border border-red-100 dark:border-red-900/30"
          >
            {error}
          </motion.div>
        )}

        <div className="space-y-4">
          <div className="relative group">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary transition-colors" />
            <input
              type="email"
              placeholder="Correo electrónico"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-zinc-900 dark:text-white placeholder-zinc-400"
            />
          </div>

          <div className="relative group">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary transition-colors" />
            <input
              type="password"
              placeholder="Contraseña"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-zinc-900 dark:text-white placeholder-zinc-400"
            />
          </div>

          <div className="relative group">
            <FaCheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary transition-colors" />
            <input
              type="password"
              placeholder="Repetir contraseña"
              required
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-zinc-900 dark:text-white placeholder-zinc-400"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Link
            href="/auth/login"
            className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
          >
            ¿Ya tienes cuenta? <span className="underline">Inicia sesión</span>
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary/90 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Registrarse
              <FaAngleRight />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default RegisterPage;
