import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/config";
import { adminAuth } from "@/firebase/admin";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Faltan credenciales");
        }
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          );
          if (userCredential.user) {
            const firebaseUser = userCredential.user;
            return {
              id: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName,
              image: firebaseUser.photoURL,
            };
          }
          return null;
        } catch (error: any) {
          console.error("Error de autenticación de Firebase:", error.code);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!adminAuth) {
          console.warn(
            "Admin SDK not initialized. Skipping user sync with Firebase."
          );
          return true;
        }
        try {
          const firebaseUser = await adminAuth.getUser(user.id);

          if (firebaseUser) {
            await adminAuth.updateUser(user.id, {
              email: user.email ?? undefined,
              displayName: user.name ?? undefined,
              photoURL: user.image ?? undefined,
            });
            console.log("¡Usuario actualizado con éxito!");
          }
        } catch (error: any) {
          console.error(
            "Error al intentar obtener/actualizar usuario:",
            error.code
          );
          if (error.code === "auth/user-not-found") {
            console.log(
              `Usuario con UID ${user.id} no encontrado. Creando nuevo usuario...`
            );
            await adminAuth.createUser({
              uid: user.id,
              email: user.email ?? undefined,
              displayName: user.name ?? undefined,
              photoURL: user.image ?? undefined,
            });
            console.log(
              "¡Nuevo usuario de Google creado con éxito en Firebase!"
            );
          } else {
            console.error(
              "Ocurrió un error inesperado en el callback signIn:",
              error
            );
          }
        }
      }
      console.log("--- Callback signIn FINALIZADO ---");
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
