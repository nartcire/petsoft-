import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "./server-utils";
import { authSchema } from "./validations";

const config = {
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        // validate the object using zod
        const validatedFormData = authSchema.safeParse(credentials);
        if (!validatedFormData.success) {
          return null;
        }

        const { email, password } = validatedFormData.data;

        const user = await getUserByEmail(email);

        if (!user) {
          console.log("No user found");
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          password,
          user.hashedPassword
        );

        if (!passwordMatch) {
          console.log("Invalid credentials");
          return null;
        }

        return user;
      },
    }),
  ],
  callbacks: {
    authorized: ({ auth, request }) => {
      const isLoggedIn = Boolean(auth?.user);
      const isTryingToAccessApp = request.nextUrl.pathname.includes("/app");

      if (isTryingToAccessApp && !isLoggedIn) {
        return false;
      }

      if (isLoggedIn && isTryingToAccessApp) {
        return true;
      }

      if (!isLoggedIn && !isTryingToAccessApp) {
        return true;
      }

      if (isLoggedIn && !isTryingToAccessApp) {
        return Response.redirect(new URL("/app/dashboard", request.nextUrl));
      }

      return false;
    },
    jwt: ({ token, user }) => {
      if (user) {
        token.userId = user.id;
      }

      return token;
    },
    session: ({ session, token }) => {
      if (session.user) {
        session.user.id = token.userId;
      }

      return session;
    },
  },
} satisfies NextAuthConfig;

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(config);
