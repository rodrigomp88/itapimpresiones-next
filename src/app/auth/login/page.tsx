"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaGoogle, FaAngleRight, FaEnvelope, FaLock } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectPreviousURL, SAVE_URL } from "@/redux/slice/cartSlice";
import { motion } from "framer-motion";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const previousURL = useAppSelector(selectPreviousURL);
  const dispatch = useAppDispatch();

  const redirectUser = () => {
    const redirectPath = previousURL || "/";
    router.push(redirectPath);
    dispatch(SAVE_URL(""));
  };

  const loginWithCredentials = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setIsLoading(false);

    if (result?.ok) {
      redirectUser();
    } else {
      setError(
        "Correo o contraseña incorrectos. Por favor, inténtelo de nuevo."
      );
    }
  };

  const loginWithGoogle = () => {
    setIsLoading(true);
    setError(null);

    const callbackUrl = previousURL || "/";
    dispatch(SAVE_URL(""));
    signIn("google", { callbackUrl });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-8 border border-zinc-100 dark:border-zinc-800"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
            Bienvenido de nuevo
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Ingresa a tu cuenta para continuar
          </p>
        </div>

        <button
          onClick={loginWithGoogle}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-white border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700/80 py-3.5 rounded-xl font-medium transition-all duration-200 group"
        >
          <FaGoogle className="text-red-500 text-lg group-hover:scale-110 transition-transform" />
          <span>Continuar con Google</span>
        </button>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-zinc-900 text-zinc-500">
              o ingresa con tu email
            </span>
          </div>
        </div>

        <form onSubmit={loginWithCredentials} className="space-y-5">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="email"
                placeholder="Correo electrónico"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>

            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="password"
                placeholder="Contraseña"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Link
              href="/auth/register"
              className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
            >
              ¿No tienes cuenta? Regístrate
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary-dark text-white py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Ingresar
                <FaAngleRight />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
