import axios from "axios";
import { DownloadSimple, Eye, PencilSimple, Trash } from "phosphor-react";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import * as Dialog from "@radix-ui/react-dialog";
import ModalViewText from "../components/ModalViewText";
import ModalViewBlock from "../components/ModalViewBlock";
import ModalViewClient from "../components/ModalViewClient";
import ModalEditText from "../components/ModalEditText";
import * as HtmlDocx from "html-docx-js/dist/html-docx";
import { getSession, useSession } from "next-auth/react";

export function index() {
  //constante para capturar os dados da sessão
  const session = useSession();
  //lista de clientes, blocos e textos
  const [clients, setClients] = useState([]);
  const [texts, setTexts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  //tabelas de relacionamento
  const [clientsBlocks, setClientsBlocks] = useState([]);
  const [blocksTexts, setBlocksTexts] = useState([]);
  //blocos exibidos no modal
  const [blockModal, setBlockModal] = useState([]);

  const [clientSelected, setClientSelected] = useState([]);
  const [blockSelected, setBlockSelected] = useState([]);
  //estado das tabelas blocos e textos, para aparecerem de forma dinamica
  const [stateBlock, setStateBlock] = useState([]);
  const [stateText, setStateText] = useState([]);

  //===========================CLIENTES===============================
  //estados para fazer a paginação da tabela
  const [pageClients, setPageClients] = useState(1);
  const pageSizeClient = 8;
  const pageClient = clients.slice(
    (pageClients - 1) * pageSizeClient,
    pageClients * pageSizeClient
  );
  //estado para o mecanismo de busca
  const [searchClient, setSearchClient] = useState("");

  useEffect(() => {
    axios("https://web-production-2ecf.up.railway.app/clients").then((res) =>
      setClients(res.data)
    );
    axios("https://web-production-2ecf.up.railway.app/texts").then((res) =>
      setTexts(res.data)
    );
    axios("https://web-production-2ecf.up.railway.app/blocks").then((res) =>
      setBlocks(res.data)
    );
    axios("https://web-production-2ecf.up.railway.app/clients-blocks").then(
      (res) => setClientsBlocks(res.data)
    );
    axios("https://web-production-2ecf.up.railway.app/blocks-texts").then(
      (res) => setBlocksTexts(res.data)
    );
  }, []);
  //faz aparecer a tabela de blocos na tela
  function showBlock(id) {
    //limpa os textos anteriores ao selecionar um novo cliente
    setBlockSelected([]);
    setStateText([]);
    //aciona a tabela de blocos a tela
    setStateBlock((state) => [[]]);
    //busca os blocos de acordo com o cliente passado como paremetro de função
    let blockFilter = clientsBlocks.filter(
      (client) => client.cliente_id === id
    );
    //array que armazena os blocos do cliente
    let array = [];
    //faz a busca dos blocos com base na tabela de relacionamento cliente/bloco na tebela principal de bloco
    blockFilter.map((block, index) => {
      array[index] = blocks.find((item) => item.id === block.bloco_id);
    });
    if (array.length === 0) array = [{ titulo: "Sem bloco cadastrado" }];
    setClientSelected(array);
  }

  //faz aparecer a tabela de textos na tela
  function showTexts(id) {
    console.log(id);
    //aciona a tabela de textos a tela
    if (id === undefined) setStateText([]);
    else setStateText((state) => [[]]);

    //busca os textos de acordo com o bloco passado como paremetro de função
    let textFilter = blocksTexts.filter((block) => block.bloco_id === id);
    //array que armazena os textos do bloco para fazer o map
    let array = [];
    textFilter.map((text, index) => {
      array[index] = texts.find((item) => item.id === text.texto_id);
    });
    if (array.length === 0) array = [{ titulo: "Sem texto cadastrado" }];

    setBlockSelected(array);
  }

  //função para capturar os textos referente a um bloco
  function captureTexts(id) {
    const result = [];
    let idTextsOfBlock = [];
    let finalResult = [];

    idTextsOfBlock = blocksTexts.filter((text) => text.bloco_id === id);

    idTextsOfBlock.map((text, index) => {
      result[index] = text.texto_id;
    });
    finalResult = texts.filter((elemento) => result.includes(elemento.id));
    setBlockModal(texts.filter((elemento) => result.includes(elemento.id)));

    return finalResult;
  }

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

  //função para deletar o bloco e as associoções feitas referente ao bloco
  async function deleteAssociation(id) {
    let conf = confirm("Deseja apagar o bloco?");
    const updatedBlocksTexts = blocksTexts.filter(
      (block) => block.bloco_id === id
    );
    if (conf === true) {
      //VERIFICAÇÃO PARA SABER SE O BLOCO CONTEM TEXTOS ASSOCIADOS, CASO TENHA, DEVERÁ SER REMOVIDO, POIS FICARÁ REGISTRO NA TABELA DE RELACIONAMENTO
      if (blocksTexts.some((block) => block.bloco_id === id)) {
        //PARA CADA TEXTO ASSOCIADO COM O BLOCO, O FOR IRÁ PERCORRER O ARRAY ONDE TEM OS ID DOS TEXTOS A APAGAR DE UM A UM
        for (let i = 0, l = updatedBlocksTexts.length; i < l; i++) {
          await axios
            .delete(
              `https://web-production-2ecf.up.railway.app/blocks-texts/${id}`
            )
            .catch((err) => console.error(err));
        }
      }
      //VERIFICAÇÃO PARA SABER SE O BLOCO CONTEM UM CLIENTE ASSOCIADO, POIS O BLOCO SO PODERÁ SER EXCLUIDO CASO ELE NAO ESTEJA EM NENHUMA TABELA DE RELACIONAMENTO
      if (clientsBlocks.some((block) => block.bloco_id === id)) {
        await axios
          .delete(
            `https://web-production-2ecf.up.railway.app/clients-blocks/${id}`
          )
          .then()
          .catch((err) => console.error(err));
      }
      await axios
        .delete(`https://web-production-2ecf.up.railway.app/blocks/${id}`)
        .then(setBlocks(blocks.filter((block) => block.id != id)))
        .then(
          setClientSelected(clientSelected.filter((block) => block.id != id))
        )
        .then(console.log(blocks))
        .catch((err) => console.error(err));
      // location.reload(false);
    } else {
      return;
    }
  }

  //função para transformar a string em um blob
  function getDocxBlob(block, title, id) {
    let html = ` ${title} <br/>`;
    // console.log(block);
    block.map((text, index) => {
      html += `${text.texto}<br/>`;
    });

    let filterClient = clientsBlocks.filter(
      (association) => association.bloco_id === id
    );
    let finalClient = clients.filter(
      (client) => client.id === filterClient[0].cliente_id
    );

    html = html.replace(/{nome}/g, finalClient[0].nome);
    html = html.replace(/{cpf}/g, finalClient[0].cpf);
    html = html.replace(/{rg}/g, finalClient[0].rg);
    html = html.replace(/{nacionalidade}/g, finalClient[0].nacionalidade);
    html = html.replace(/{estadoCivil}/g, finalClient[0].estado_civil);
    html = html.replace(/{orgaoEmissor}/g, finalClient[0].orgao_emissor);
    html = html.replace(/{telefone}/g, finalClient[0].telefone);
    html = html.replace(/{email}/g, finalClient[0].email);
    html = html.replace(/{profissao}/g, finalClient[0].profissao);
    html = html.replace(/{endereco}/g, finalClient[0].endereco);
    html = html.replace(/{numero}/g, finalClient[0].numero);
    html = html.replace(/{cidade}/g, finalClient[0].cidade);
    html = html.replace(/{cep}/g, finalClient[0].cep);
    html = html.replace(/{estado}/g, finalClient[0].estado);

    return HtmlDocx.asBlob(html);
  }

  //função para transformar o blob num .doc e baixar
  function downloadFile(title, blob) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  //função para buscar o cliente dono do bloco
  function findClient(id) {
    let filterClient = clientsBlocks.filter(
      (association) => association.bloco_id === id
    );
    let finalClient = clients.filter(
      (client) => client.id === filterClient[0].cliente_id
    );
    return finalClient;
  }

  //função para limpar as tabelas ao mudar de página na tabela de clientes
  function clearTable() {
    setStateBlock([]);
    setStateText([]);
  }
  console.log(session);

  return (
    <div>
      <Header />
      <div className="flex w-full flex-col p-4">
        <div className="flex items-center justify-between">
          <div>
            <button
              className="p-2 mb-2 ml-2 rounded-lg bg-yellow-800 mr-2"
              onClick={() => {
                setPageClients(pageClients - 1);
                clearTable();
              }}
              disabled={pageClients === 1}
            >
              Anterior
            </button>
            <button
              className="p-2 mb-2 rounded-lg bg-yellow-800 mr-2"
              onClick={() => {
                setPageClients(pageClients + 1);
                clearTable();
              }}
            >
              Próximo
            </button>
          </div>
          <div>
            <input
              type="text"
              placeholder="Pesquisar cliente por nome..."
              className="py-2 pl-2 pr-[6rem] mr-2 mb-2 rounded-lg bg-neutral-800 "
              value={searchClient}
              onChange={(e) => {
                setSearchClient(e.target.value);
                clearTable();
              }}
            />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-[90%] 2xl:w-3/12">
            <table className="border-yellow-500 rounded-xl border-2 border-separate overflow-hidden w-full grid grid-cols-1 grid-rows-1 ">
              <thead className="bg-zinc-800 text-xl border-b-2 border-yellow-500">
                <tr className="flex justify-between px-[2rem] ">
                  <th className="text-center">Nome Completo</th>
                  <th className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody className=" bg-zinc-700 text-xl">
                {pageClient.length >= 1 ? (
                  pageClient
                    .filter((client) =>
                      client.nome
                        .toLowerCase()
                        .includes(searchClient.toLowerCase())
                    )
                    .map((client) => {
                      return (
                        <tr key={client.id} className="flex justify-between">
                          <td>
                            <button
                              className="px-2"
                              onClick={() => showBlock(client.id)}
                            >
                              {client.nome}
                            </button>
                          </td>
                          <td>
                            <div className="flex items-center gap-1 pr-2 justify-center">
                              <Dialog.Root>
                                <Dialog.Trigger asChild>
                                  <button type="button">
                                    <Eye size={26} />
                                  </button>
                                </Dialog.Trigger>
                                <ModalViewClient client={client} />
                              </Dialog.Root>
                              <a href={`/clients/${client.id}`}>
                                <PencilSimple size={26} />
                              </a>
                              <button
                                type="button"
                                onClick={() => {
                                  deleteClient(client.id);
                                }}
                              >
                                <Trash size={26} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                ) : (
                  <tr className="flex justify-between">
                    <td className="px-2">Sem cliente cadastrado</td>
                    <td>
                      <div className="flex items-center gap-1 pr-2 justify-center">
                        <button type="button">
                          <Eye size={26} />
                        </button>
                        <button>
                          <PencilSimple size={26} />
                        </button>
                        <button type="button">
                          <Trash size={26} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex w-[90%] 2xl:w-5/12">
            <div className="w-full">
              {stateBlock.map((blocks, index) => {
                return (
                  <table
                    key={index}
                    className=" border-yellow-500 rounded-xl border-2 border-separate overflow-hidden w-full grid grid-cols-1 grid-rows-1 "
                  >
                    <thead className="bg-zinc-800 text-xl border-b-2 border-yellow-500  w-full">
                      <tr className="flex justify-between px-[2rem] ">
                        <th className="text-center">Título do Bloco</th>
                        <th className="text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className=" bg-zinc-700 text-xl">
                      {clientSelected.map((blocks, index) => {
                        return (
                          <tr key={index} className="flex justify-between">
                            <td>
                              <button
                                onClick={() => showTexts(blocks.id)}
                                className="px-2 "
                              >
                                {blocks.titulo}
                              </button>
                            </td>
                            <td>
                              {blocks.titulo === "Sem bloco cadastrado" ? (
                                <div className="flex items-center gap-1 pr-2 justify-center">
                                  <button type="button">
                                    <Eye size={26} />
                                  </button>
                                  <button>
                                    <DownloadSimple size={26} />
                                  </button>
                                  <button>
                                    <Trash size={26} />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 pr-2 justify-center">
                                  <Dialog.Root>
                                    <Dialog.Trigger asChild>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          captureTexts(blocks.id);
                                        }}
                                      >
                                        <Eye size={26} />
                                      </button>
                                    </Dialog.Trigger>
                                    <ModalViewBlock
                                      block={blockModal}
                                      title={blocks.titulo}
                                      client={findClient(blocks.id)}
                                    />
                                  </Dialog.Root>
                                  <button
                                    onClick={() => {
                                      downloadFile(
                                        blocks.titulo,
                                        getDocxBlob(
                                          captureTexts(blocks.id),
                                          blocks.titulo,
                                          blocks.id
                                        )
                                      );
                                    }}
                                  >
                                    <DownloadSimple size={26} />
                                  </button>
                                  <button
                                    onClick={() => deleteAssociation(blocks.id)}
                                  >
                                    <Trash size={26} />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                );
              })}
            </div>
          </div>
          <div className="flex w-[90%] 2xl:w-4/12">
            <div className="w-full">
              {stateText.map((blocks, index) => {
                return (
                  <table
                    key={index}
                    className=" border-yellow-500 rounded-xl border-2 border-separate overflow-hidden w-full grid grid-cols-1 grid-rows-1 "
                  >
                    <thead className="bg-zinc-800 text-xl border-b-2 border-yellow-500  w-full">
                      <tr className="flex justify-between px-[2rem] ">
                        <th className="text-center">Título do texto</th>
                        <th className="text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className=" bg-zinc-700 text-xl">
                      {blockSelected.map((text) => {
                        return (
                          <tr key={text.id} className="flex justify-between">
                            <td className="flex justify-between px-2">
                              {text.titulo}
                            </td>
                            <td>
                              <div className="flex items-center gap-1 pr-2 justify-center">
                                <Dialog.Root>
                                  <Dialog.Trigger asChild>
                                    <button type="button">
                                      <Eye size={26} />
                                    </button>
                                  </Dialog.Trigger>
                                  <ModalViewText text={text} />
                                </Dialog.Root>
                                <Dialog.Root>
                                  <Dialog.Trigger asChild>
                                    <button type="button">
                                      <PencilSimple size={26} />
                                    </button>
                                  </Dialog.Trigger>
                                  <ModalEditText text={text} />
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
                );
              })}
            </div>
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

export default index;
