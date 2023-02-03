import axios from "axios";
import { getSession } from "next-auth/react";
import { useState } from "react";
import Header from "../../components/Header";

export function Blocks() {
  const [blockTitle, setBlockTitle] = useState([]);

  async function createBlock(event) {
    try {
      await axios.post("https://web-production-2ecf.up.railway.app/blocks", {
        titulo: blockTitle,
      });
      return (
        alert("Bloco criado com sucesso!"), location.reload(false) //atualiza a pagina
      );
    } catch (error) {
      console.log(error);
      return alert("Erro ao criar o bloco!");
    }
  }

  return (
    <div>
      <Header />
      <div className="flex justify-center gap-8">
        <div className="flex flex-col m-8  w-full md:w-2/5 ">
          <span className="flex justify-center font-bold text-3xl mb-8">
            Criar um novo bloco
          </span>
          <input
            className="w-full h-10 px-3 placeholder-white bg-transparent mb-4
              block py-2.5 text-sm text-gray-900  border-2  appearance-none dark:text-white dark:border-yellow-500
             dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            type="text"
            placeholder="Título"
            name="titulo"
            id="titulo"
            onChange={(e) => setBlockTitle(e.target.value)}
          />
          <div className="flex justify-center p-4">
            <button
              onClick={createBlock}
              className=" bg-yellow-300 hover:bg-yellow-500 p-2 rounded-lg text-black"
            >
              Criar Bloco
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  console.log(session);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
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

export default Blocks;
