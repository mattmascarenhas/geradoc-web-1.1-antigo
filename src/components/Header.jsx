import { signOut } from "next-auth/react";
import { useState } from "react";
import Logo from "./Logo";

export function Header() {
  const [isOpenClient, setIsOpenClient] = useState(false);
  const [isOpenText, setIsOpenText] = useState(false);
  const [isOpenBlock, setIsOpenBlock] = useState(false);

  return (
    <header className="grid grid-cols-2 items-center bg-zinc-800 border-b-2  border-yellow-500 px-24">
      <div className="flex mx-8 justify-start my-5">
        <a href="/">
          <Logo />
        </a>
      </div>
      <div>
        <ul className="flex gap-8  mx-8 text-2xl justify-end ">
          <li>
            <a href="/">Início</a>
          </li>
          <li>
            <div
              onClick={() => setIsOpenClient(!isOpenClient)}
              onMouseLeave={() => setIsOpenClient(false)}
            >
              <span>Clientes</span>
              {isOpenClient && (
                <div className="max-w-10rem bg-gray-500 absolute rounded-lg border-2 border-white ">
                  <a href="/clients" className="block p-2 text-white">
                    Exibir Clientes
                  </a>
                  <a href="/clients/register" className="block p-2 text-white">
                    Cadastrar Cliente
                  </a>
                </div>
              )}
            </div>
          </li>
          <li>
            <div
              onClick={() => setIsOpenText(!isOpenText)}
              onMouseLeave={() => setIsOpenText(false)}
            >
              <span>Textos</span>
              {isOpenText && (
                <div className="max-w-10rem bg-gray-500 absolute rounded-lg border-2 border-white">
                  <a href="/texts" className="block p-2 text-white">
                    Exibir Textos
                  </a>
                  <a href="/texts/register" className="block p-2 text-white">
                    Cadastrar Texto
                  </a>
                </div>
              )}
            </div>
          </li>
          <li>
            <div
              onClick={() => setIsOpenBlock(!isOpenBlock)}
              onMouseLeave={() => setIsOpenBlock(false)}
            >
              <span>Blocos</span>
              {isOpenBlock && (
                <div className="max-w-10rem bg-gray-500 absolute rounded-lg border-2 border-white">
                  <a href="/blocks" className="block p-2 text-white">
                    Exibir Blocos
                  </a>
                  <a href="/blocks/register" className="block p-2 text-white">
                    Cadastrar Bloco
                  </a>
                  <a
                    href="/blocks/associate-text"
                    className="block p-2 text-white"
                  >
                    Associar Texto a um Bloco
                  </a>
                  <a
                    href="/blocks/associate-client"
                    className="block p-2 text-white"
                  >
                    Associar Bloco a um Cliente
                  </a>
                </div>
              )}
            </div>
          </li>
          <li>
            <button
              className="bg-yellow-500 text-black px-8 rounded-lg ml-20 text-lg font-bold"
              onClick={() => signOut()}
            >
              Sair
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
