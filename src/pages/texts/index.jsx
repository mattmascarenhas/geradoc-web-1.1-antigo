import axios from "axios";
import { Eye, PencilSimple, Trash } from "phosphor-react";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import * as Dialog from "@radix-ui/react-dialog";
import ModalViewText from "../../components/ModalViewText";
import ModalEditText from "../../components/ModalEditText";
import HtmlReactParser from "html-react-parser";
import { getSession } from "next-auth/react";

export function Texts() {
  const [texts, setTexts] = useState([]);
  const [textModal, setTextModal] = useState([]);
  //estados para fazer a paginação da tabela
  const [page, setPage] = useState(1);
  const pageSize = 6;
  //estado para o mecanismo de busca
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios("https://web-production-2ecf.up.railway.app/texts").then((res) =>
      setTexts(res.data)
    );
  }, []);

  async function deleteText(id) {
    let conf = confirm("Deseja apagar o texto?");
    if (conf === true) {
      await axios
        .delete(`https://web-production-2ecf.up.railway.app/texts/${id}`)
        .then(setTexts(texts.filter((text) => text.id != id)))
        .catch((err) => console.log(err));
    } else {
      return;
    }
  }

  return (
    <div>
      <Header />
      <div className="flex justify-center">
        <div className="flex flex-col  w-full md:w-3/5 m-8 ">
          <span className=" flex justify-center font-bold text-3xl mb-8">
            Textos Cadastrados
          </span>
          <div className="flex items-center justify-between mb-2">
            <div>
              <button
                className="p-2 mb-2 ml-2 rounded-lg bg-yellow-800 mr-2"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Anterior
              </button>
              <button
                className="p-2 mb-2 rounded-lg bg-yellow-800 mr-2"
                onClick={() => setPage(page + 1)}
              >
                Próximo
              </button>
            </div>
            <div>
              <input
                type="text"
                placeholder="Pesquisar por título"
                className="p-2 mr-2 mb-2 rounded-lg bg-neutral-800 "
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <table className="border-yellow-500 rounded-xl border-2 border-separate overflow-hidden w-full grid grid-cols-1 grid-rows-1 ">
            <thead className="bg-zinc-800 text-xl border-b-2 border-yellow-500">
              <tr className="grid grid-cols-7 justify-items-start">
                <th className="px-6 py-3 col-span-3">Título</th>
                <th className="px-6 py-3 col-span-3">Texto</th>
                <th className="px-10 py-3 col-span-1">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-zinc-700 text-xl">
              {texts
                .filter((text) =>
                  text.titulo.toLowerCase().includes(search.toLowerCase())
                )
                .slice((page - 1) * pageSize, page * pageSize)
                .map((text) => {
                  return (
                    <tr key={text.id} className="grid grid-cols-7">
                      <td className="px-6 my-4 col-span-3 line-clamp-2">
                        {text.titulo}
                      </td>
                      <td className="px-6 my-4 col-span-3 line-clamp-2">
                        {HtmlReactParser(text.texto)}
                      </td>
                      <td className="">
                        <div className="flex py-4 justify-center text-2xl gap-4 col-span-1">
                          <Dialog.Root>
                            <Dialog.Trigger asChild>
                              <button
                                type="button"
                                onClick={() => {
                                  setTextModal(text);
                                }}
                              >
                                <Eye size={26} />
                              </button>
                            </Dialog.Trigger>
                            <ModalViewText text={textModal} />
                          </Dialog.Root>
                          <Dialog.Root>
                            <Dialog.Trigger asChild>
                              <button
                                type="button"
                                onClick={() => {
                                  setTextModal(text);
                                }}
                              >
                                <PencilSimple size={26} />
                              </button>
                            </Dialog.Trigger>
                            <ModalEditText text={textModal} />
                          </Dialog.Root>
                          <button onClick={() => deleteText(text.id)}>
                            <Trash size={26} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export async function GetServerSideProps(context) {
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

export default Texts;
