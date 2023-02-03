import { useEffect, useState, useCallback } from "react";
import Logo from "../../components/Logo";
import { getSession, signIn } from "next-auth/react";
import Router from "next/router";
import Link from "next/link";

export function SignIn() {
  const [errorMessage, setErrorMessage] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = useCallback(() => {
    if (data.email !== "" && data.password.length >= 6) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [data]);

  useEffect(() => {
    handleChange();
  }, [data, handleChange]);

  async function onSubmit(e) {
    e.preventDefault();
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    if (res.error === "Invalid credentials") {
      setErrorMessage(true);
    } else {
      setErrorMessage(false);
      Router.push("/");
    }
    console.log(res);
  }

  return (
    <div className="w-full max-w-sm mx-auto mt-40 ">
      <form onSubmit={onSubmit}>
        <div className="bg-zinc-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 border-2 border-yellow-500 ">
          <div className="mb-4 flex justify-center">
            <Logo />
          </div>
          <div
            className="flex bg-red-600 rounded-lg items-center justify-center"
            value={errorMessage}
          >
            {errorMessage && <span>e-mail ou senha incorreta.</span>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="email">
              E-mail
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="E-mail"
              value={data.email}
              onChange={(e) =>
                setData((prevState) => ({
                  ...prevState,
                  email: e.target.value,
                }))
              }
            />
          </div>
          <div className="mb-6">
            <label className="block  text-sm font-bold mb-2" htmlFor="password">
              Senha
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Senha"
              value={data.password}
              onChange={(e) =>
                setData((prevState) => ({
                  ...prevState,
                  password: e.target.value,
                }))
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={isDisabled}
              type="submit"
            >
              Login
            </button>
            <Link
              className="inline-block align-baseline font-bold text-sm text-yellow-500 hover:text-yellow-600"
              href="#"
            >
              Esqueceu a senha?
            </Link>
          </div>
        </div>
      </form>
      <p className="text-center text-gray-500 text-xs">
        &copy;2023 GeraDoc Corp. Todos os direitos reservados.
      </p>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  console.log(session);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      session,
    },
  };
}

export default SignIn;
