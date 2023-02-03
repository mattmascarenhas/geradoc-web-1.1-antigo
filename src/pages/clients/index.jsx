import axios from "axios";
import { Eye, PencilSimple, Plus, Trash } from "phosphor-react";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import * as Dialog from "@radix-ui/react-dialog";
import ModalViewClient from "../../components/ModalViewClient";
import { getSession } from "next-auth/react";
import Link from "next/link";

export function Clients() {
  const [clients, setClients] = useState([]);
  const [clientModal, setClientModal] = useState([]);
  //estados para fazer a paginação da tabela
  const [page, setPage] = useState(1);
  const pageSize = 8;
  //estado para o mecanismo de busca
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios("https://web-production-2ecf.up.railway.app/clients").then((res) =>
      setClients(res.data)
    );
  }, []);

  async function deleteClient(id) {
    let conf = confirm("Deseja apagar o cliente?");
    if (conf === true) {
      await axios
        .delete(`https://web-production-2ecf.up.railway.app/clients/${id}`)
        .then(setClients(clients.filter((client) => client.id != id)))
        .catch((err) => console.error(err));
    } else {
      return;
    }
  }

  return (
    <div>
      <Header />
      <div className="flex justify-between px-20">
        <div className="m-16"></div>
        <div className="flex items-center m-8 font-bold text-4xl">
          <span>Clientes Cadastrados</span>
        </div>
        <div className=" m-8 items-center rounded-xl ">
          <button>
            <Link href="/clients/register">
              <Plus className="w-20 h-20" />
            </Link>
          </button>
        </div>
      </div>
      <div className=" mx-12 rounded-lg  px-20">
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
              placeholder="Pesquisar por nome"
              className="p-2 mr-2 mb-2 rounded-lg bg-neutral-800 "
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <table className="border-yellow-500 rounded-xl border-2 border-separate overflow-hidden w-full grid grid-cols-1 grid-rows-1 ">
          <thead className="bg-zinc-800 text-xl border-b-2 border-yellow-500">
            <tr className="grid grid-cols-10 justify-items-start">
              <th scope="col" className="pl-16 pr-6 py-3 col-span-3">
                Nome Completo
              </th>
              <th className="px-6 py-3 col-span-2">Telefone</th>
              <th className="px-6 py-3 col-span-2">Email</th>
              <th className="px-6 py-3 col-span-2">Cidade/Estado</th>
              <th className="px-6 py-3 col-span-1">Ações</th>
            </tr>
          </thead>
          <tbody className=" bg-zinc-700 text-xl">
            {clients
              .filter((client) =>
                client.nome.toLowerCase().includes(search.toLowerCase())
              )
              .slice((page - 1) * pageSize, page * pageSize)

              .map((client) => {
                return (
                  <tr key={client.id} className="grid grid-cols-10">
                    <td className="py-4 px-6  col-span-3">{client.nome}</td>
                    <td className="py-4 px-6 col-span-2">{client.telefone}</td>
                    <td className="py-4 px-6  col-span-2">{client.email}</td>
                    <td className="py-4 px-6  col-span-2">
                      {client.cidade} - {client.estado}
                    </td>
                    <td className="flex py-4 justify-center text-2xl gap-4 col-span-1">
                      <Dialog.Root>
                        <Dialog.Trigger asChild>
                          <button
                            type="button"
                            onClick={() => {
                              setClientModal(client);
                            }}
                          >
                            <Eye size={26} />
                          </button>
                        </Dialog.Trigger>
                        <ModalViewClient client={clientModal} />
                      </Dialog.Root>
                      <Link href={`/clients/${client.id}`}>
                        <PencilSimple size={26} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          deleteClient(client.id);
                        }}
                      >
                        <Trash size={26} />
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
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

export default Clients;
