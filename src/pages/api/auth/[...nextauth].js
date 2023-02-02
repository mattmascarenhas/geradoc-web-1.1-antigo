import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { redirect } from "next/dist/server/api-utils";

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials, req, res) {
        const { email, password } = credentials;

        if (email !== "mattmascarenhas7@gmail.com" || password !== "123456") {
          throw new Error("Invalid credentials");
        }

        return {
          id: "1234",
          name: "Matheus Mascarenhas",
          email: "mattmascarenhas7@gmail.com",
        };
      },
    }),
  ],
  // callbacks: {
  //   jwt: async ({ token, user }) => {
  //     if (user) token.id = user.id;
  //     return token;
  //   },
  //   session: ({ session, token }) => {
  //     if (token) session.id = token.id;
  //     return session;
  //   },
  // },
  // secret: "test",
  // jwt: {
  //   secret: "test",
  //   encryption: true,
  // },
  pages: {
    signIn: "auth/signin",
    // error: "auth/error",
    // signOut: "auth/signout",
  },
};

export default NextAuth(authOptions);
