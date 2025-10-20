"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaAngleRight } from "react-icons/fa";
import { auth } from "@/src/firebase/config";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
      await createUserWithEmailAndPassword(auth, email, password);

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.ok) {
        router.push("/admin");
      } else {
        setError(
          "No se pudo iniciar sesión después del registro. Por favor, intente ingresar manualmente."
        );
        setIsLoading(false);
      }
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

  return (
    <div className="w-full">
      <h2 className="text-center mb-6 text-xl text-gray-500 font-black">
        Formulario de registro
      </h2>
      <form onSubmit={registerUser}>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="mb-6">
          <input
            type="email"
            className="input"
            placeholder="Correo"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <input
            type="password"
            className="input"
            placeholder="Contraseña"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            className="input"
            placeholder="Repetir contraseña"
            required
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
          />
        </div>

        <div className="flex justify-between mb-6 text-sm">
          <Link href="/auth/login" className="text-violet-900 hover:underline">
            ¿Ya tienes cuenta? Ingresa
          </Link>
        </div>

        <div className="text-center">
          <button type="submit" className="btn" disabled={isLoading}>
            {isLoading ? (
              "Registrando..."
            ) : (
              <>
                Registrarse <FaAngleRight className="ml-2" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
