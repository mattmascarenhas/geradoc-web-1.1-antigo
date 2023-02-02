import { createContext, useState } from "react";
import signInRequest from "../services/auth";
import { setCookie } from "nookies";
import Router from "next/router";

//contexto de autenticação, saber se o usuario está autenticado ou não

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const isAuthenticated = !!user; // true ou false dependendo da existencia do usuario

  async function signIn({ email, password }) {
    const { token, user } = await signInRequest({
      email,
      password,
    });
    //setando o tempo de duração do token para essa aplicação
    setCookie(undefined, "geradoc.token", token, {
      maxAge: 60 * 60 * 8, //8horas
    });

    setUser(user);

    Router.push("/inicio");
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
