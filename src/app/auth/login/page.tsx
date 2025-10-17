"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaGoogle, FaAngleRight } from "react-icons/fa";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
      router.push("/admin");
    } else {
      setError(
        "Correo o contraseña incorrectos. Por favor, inténtelo de nuevo."
      );
    }
  };

  const loginWithGoogle = () => {
    setIsLoading(true);
    setError(null);

    signIn("google", { callbackUrl: "/admin" });
  };

  return (
    <div className="w-full">
      <div className="text-center">
        <button
          onClick={loginWithGoogle}
          className="btn w-full place-content-center"
          disabled={isLoading}
        >
          <FaGoogle className="mr-2" />
          Ingresar con Google
        </button>
      </div>
      <div className="divider my-4">O</div>
      <h2 className="text-center mb-6 text-xl text-gray-500 font-black">
        Correo y contraseña
      </h2>
      <form onSubmit={loginWithCredentials}>
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

        <div className="mb-3">
          <input
            type="password"
            className="input"
            placeholder="Contraseña"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex justify-between mb-6 text-sm">
          <Link
            href="/auth/register"
            className="text-violet-900 hover:underline"
          >
            ¿No tienes cuenta? Regístrate
          </Link>
          <Link
            href="/auth/reset-password"
            className="text-violet-900 hover:underline"
          >
            Olvidé contraseña
          </Link>
        </div>

        <div className="text-center">
          <button type="submit" className="btn" disabled={isLoading}>
            {isLoading ? (
              "Ingresando..."
            ) : (
              <>
                Ingresar <FaAngleRight className="ml-2" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
