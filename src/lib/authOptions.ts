import { AuthOptions } from "next-auth";
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
        if (!adminAuth) return true;

        try {
          // 1. Intentar obtener usuario por su UID de Google
          await adminAuth.getUser(user.id);

          // Si existe, actualizamos datos básicos
          await adminAuth.updateUser(user.id, {
            email: user.email ?? undefined,
            displayName: user.name ?? undefined,
            photoURL: user.image ?? undefined,
          });
        } catch (error: any) {
          if (error.code === "auth/user-not-found") {
            // 2. Si no existe por UID, verificamos si existe por EMAIL
            // (Caso: Usuario registrado con contraseña intenta entrar con Google)
            try {
              const existingUser = await adminAuth.getUserByEmail(user.email!);
              console.log(
                `Usuario ya existe con email ${user.email} (UID: ${existingUser.uid}). Se vinculará en JWT.`
              );
              // No hacemos nada, dejaremos que el callback JWT unifique el ID.
            } catch (emailError: any) {
              // 3. Si no existe ni por UID ni por Email, lo CREAMOS
              if (emailError.code === "auth/user-not-found") {
                console.log(
                  `Creando nuevo usuario para Google UID: ${user.id}`
                );
                await adminAuth.createUser({
                  uid: user.id, // Usamos el ID de Google como UID de Firebase
                  email: user.email ?? undefined,
                  displayName: user.name ?? undefined,
                  photoURL: user.image ?? undefined,
                  emailVerified: true, // Google ya verificó el email
                });
              }
            }
          } else {
            console.error("Error en signIn callback:", error);
          }
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        // Lógica de Unificación:
        // Siempre intentamos buscar el UID real de Firebase usando el email.
        // Esto garantiza que si el usuario se registró con contraseña (UID 'ABC')
        // y entra con Google (ID '123'), el sistema use 'ABC' para todo.
        try {
          if (user.email && adminAuth) {
            const firebaseUser = await adminAuth.getUserByEmail(user.email);
            token.id = firebaseUser.uid;
          } else {
            token.id = user.id;
          }
        } catch (error) {
          // Si falla (o es un registro nuevo puro), usamos el ID que viene de NextAuth
          token.id = user.id;
        }
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
