import axios from "axios";
import {
  ArrowRight,
  DownloadSimple,
  Eye,
  PencilSimple,
  Trash,
} from "phosphor-react";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import * as Dialog from "@radix-ui/react-dialog";
import ModalViewText from "../components/ModalViewText";
import ModalViewBlock from "../components/ModalViewBlock";
import ModalViewClient from "../components/ModalViewClient";
import ModalEditText from "../components/ModalEditText";
import * as HtmlDocx from "html-docx-js/dist/html-docx";

export function newIndex() {
  const [clients, setClients] = useState([]);
  const [texts, setTexts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [clientsBlocks, setClientsBlocks] = useState([]);
  const [blocksTexts, setBlocksTexts] = useState([]);
  const [blockModal, setBlockModal] = useState([]);

  const [clientSelected, setClientSelected] = useState([]);
  const [blockSelected, setBlockSelected] = useState([]);

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
  function captureTexts(association) {
    const result = [];
    let idTextsOfBlock = [];

    idTextsOfBlock = blocksTexts.filter(
      (text) => text.bloco_id === association.id
    );
    idTextsOfBlock.map((text, index) => {
      result[index] = text.texto_id;
    });

    setBlockModal(texts.filter((elemento) => result.includes(elemento.id)));
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
  function downloadFile(blob, title) {
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
  function clearTable() {
    setBlockSelected([]);
    setStateText([]);
  }
  return (
    <div className="flex flex-col">
      <Header />
      <div className="flex w-full flex-col 2xl:flex-row">
        <div className=" w-[90%] 2xl:w-1/3 ml-8 ">
          <span className="text-3xl font-bold flex px-4 my-6">Clientes</span>
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
                placeholder="Pesquisar por nome"
                className="p-2 mr-2 mb-2 rounded-lg bg-neutral-800 "
                value={searchClient}
                onChange={(e) => setSearchClient(e.target.value)}
              />
            </div>
          </div>
          <table className="border-4 border-yellow-500 w-full">
            <thead>
              <tr className=" font-bold uppercase text-3xl bg-neutral-800 border-4 rounded-lg border-yellow-500 w-[8rem]">
                <th scope="col" className=" py-2 ">
                  Nome Completo
                </th>
              </tr>
            </thead>
            <tbody>
              {pageClient
                .filter((client) =>
                  client.nome.toLowerCase().includes(searchClient.toLowerCase())
                )
                .map((client) => {
                  return (
                    <tr key={client.id}>
                      <td className="flex justify-between text-2xl px-2 py-1">
                        <button
                          className="cursor-default "
                          onClick={() => showBlock(client.id)}
                        >
                          {client.nome}
                        </button>
                        <div className="flex items-center gap-3">
                          <Dialog.Root>
                            <Dialog.Trigger asChild>
                              <button type="button">
                                <Eye size={26} />
                              </button>
                            </Dialog.Trigger>
                            <ModalViewClient client={client} />
                          </Dialog.Root>
                          <a href={`/clients/${client.id}`}>
                            <PencilSimple />
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              deleteClient(client.id);
                            }}
                          >
                            <Trash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div className=" flex w-[90%] 2xl:w-1/3 ml-2 ">
          {stateBlock.map((blocks, index) => {
            return (
              <div className="flex" key={index}>
                <div className="flex items-center">
                  <ArrowRight color="#fcfcfc" className="w-20 h-20 mr-2" />
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold flex px-4 my-6">
                    Blocos
                  </span>
                  <table className="border-4 border-yellow-500  w-full">
                    <thead>
                      <tr className=" font-bold uppercase text-3xl bg-neutral-800 border-4 rounded-lg border-yellow-500 ">
                        <th scope="col" className="py-2 px-[6.8rem]">
                          Título do bloco
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {clientSelected.map((blocks, index) => {
                          return (
                            <td
                              key={index}
                              className="flex text-2xl px-2 py-1 justify-between max-"
                            >
                              <button
                                onClick={() => showTexts(blocks.id)}
                                className="cursor-auto w-[30ch] "
                              >
                                {blocks.titulo}
                              </button>
                              {blocks.titulo === "Sem bloco cadastrado" ? (
                                <div></div>
                              ) : (
                                <div className="flex items-center gap-3">
                                  <Dialog.Root>
                                    <Dialog.Trigger asChild>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          captureTexts(blocks);
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
                                      captureTexts(blocks);
                                      downloadFile(
                                        getDocxBlob(
                                          blockModal,
                                          blocks.titulo,
                                          blocks.id
                                        ),
                                        blocks.titulo
                                      );
                                    }}
                                  >
                                    <DownloadSimple />
                                  </button>
                                  <button
                                    onClick={() => deleteAssociation(blocks.id)}
                                  >
                                    <Trash />
                                  </button>
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
        <div className=" flex w-[90%] 2xl:w-1/3  mr-8 ml-2 ">
          {stateText.map((blocks, index) => {
            return (
              <div className="flex" key={index}>
                <div className="flex items-center">
                  <ArrowRight color="#fcfcfc" className="w-20 h-20 mr-2" />
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold flex px-4 my-6">
                    Textos
                  </span>
                  <table className="border-4 border-yellow-500 w-full  ">
                    <thead>
                      <tr className=" font-bold uppercase text-3xl bg-neutral-800 border-4 rounded-lg border-yellow-500">
                        <th scope="col" className="px-16 py-2 ">
                          Título do texto
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {blockSelected.map((text, index) => {
                        return (
                          <tr key={index}>
                            <td className="flex text-2xl px-2 py-1 justify-between">
                              {text.titulo}
                              <div className="flex items-center ml-2 gap-3">
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
                                      <PencilSimple />
                                    </button>
                                  </Dialog.Trigger>
                                  <ModalEditText text={text} />
                                </Dialog.Root>
                                <button onClick={() => deleteText(text.id)}>
                                  <Trash />
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
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default newIndex;
