import axios from "axios";
import { DownloadSimple, Eye, Trash } from "phosphor-react";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import * as Dialog from "@radix-ui/react-dialog";
import ModalViewBlock from "../../components/ModalViewBlock";
import * as HtmlDocx from "html-docx-js/dist/html-docx";
import { getSession } from "next-auth/react";

export function ShowBlocks() {
  const [texts, setTexts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [clients, setClients] = useState([]);
  const [clientsBlocks, setClientsBlocks] = useState([]);
  const [blocksTexts, setBlocksTexts] = useState([]);
  //resultado final de como irá aparecer na tabela
  const [result, setResult] = useState([]);
  //estado para interagir com o modal
  const [blockModal, setBlockModal] = useState([]);
  //estados para fazer a paginação da tabela
  const [page, setPage] = useState(1);
  const pageSize = 6;
  //estado para o mecanismo de busca
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios("https://web-production-2ecf.up.railway.app/blocks").then((res) =>
      setBlocks(res.data)
    );
    axios("https://web-production-2ecf.up.railway.app/clients").then((res) =>
      setClients(res.data)
    );
    axios("https://web-production-2ecf.up.railway.app/clients-blocks").then(
      (res) => setClientsBlocks(res.data)
    );
    axios("https://web-production-2ecf.up.railway.app/blocks-texts").then(
      (res) => setBlocksTexts(res.data)
    );
    axios("https://web-production-2ecf.up.railway.app/texts").then((res) =>
      setTexts(res.data)
    );
  }, []);
  // função para juntar o nome do cliente com o titulo do bloco para aparecer em tela
  function associateToSave() {
    const result = [];
    if (blocks.length > 0) {
      blocks.forEach((block) => {
        // Adicione um novo objeto ao resultado com o título do bloco e um nome vazio
        result.push({
          titulo: block.titulo,
          nome: "",
          bloco_id: block.id,
        });
      });
    }
    clientsBlocks.forEach((clientBlock) => {
      // Encontre o cliente correspondente usando o id do cliente em clientBlock
      const client = clients.find(
        (client) => client.id === clientBlock.cliente_id
      );
      // Encontre o objeto de bloco correspondente usando o id do bloco em clientBlock
      const block = blocks.find((block) => block.id === clientBlock.bloco_id);
      if (block) {
        if (client) {
          // Encontre o índice do objeto de bloco no array result
          const index = result.findIndex(
            (item) => item.titulo === block.titulo
          );
          // Atualize o objeto no array result com o nome do cliente
          if (
            client.nome === "" ||
            client.nome === undefined ||
            client.nome === null
          ) {
            result[index] = {
              titulo: block.titulo,
              bloco_id: block.id,
            };
          } else {
            result[index] = {
              titulo: block.titulo,
              nome: client.nome,
              bloco_id: block.id,
            };
          }
        }
      }
    });
    setResult(result);
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
            .then()
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
        .catch((err) => console.error(err));
      // location.reload(false);
    } else {
      return;
    }
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
    if (filterClient[0]) {
      let finalClient = clients.filter(
        (client) => client.id === filterClient[0].cliente_id
      );
      return finalClient;
    } else {
      return;
    }
  }

  return (
    <div>
      {useEffect(() => {
        associateToSave();
      }, [blocks, clients, clientsBlocks, blocksTexts])}
      <Header />
      <div className="flex justify-center gap-20 ">
        <div className="flex flex-col m-8  w-full md:w-3/5 ">
          <span className="flex justify-center font-bold text-3xl mb-8">
            Blocos Cadastrados
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
          <table className="border-yellow-500 rounded-xl border-2 border-separate overflow-hidden w-full grid grid-cols-1 grid-rows-1">
            <thead className="bg-zinc-800 text-xl border-b-2 border-yellow-500">
              <tr className=" grid grid-cols-7 justify-items-start">
                <th className="px-6 py-3 col-span-3">Título</th>
                <th className="px-6 py-3 col-span-3">Cliente</th>
                <th className="px-10 py-3 col-span-1">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-zinc-700 text-xl">
              {result
                .filter((block) =>
                  block.titulo.toLowerCase().includes(search.toLowerCase())
                )
                .slice((page - 1) * pageSize, page * pageSize)
                .map((association, index) => {
                  return (
                    <tr className="grid grid-cols-7" key={index}>
                      <td className="px-6 my-4 col-span-3 line-clamp-2">
                        {association.titulo}
                      </td>
                      <td className="px-6 my-4 col-span-3 line-clamp-2">
                        {association.nome}
                      </td>
                      <td className="flex py-4 justify-center text-2xl gap-4 col-span-1">
                        <Dialog.Root>
                          <Dialog.Trigger asChild>
                            <button
                              type="button"
                              onClick={() => {
                                captureTexts(association.bloco_id);
                              }}
                            >
                              <Eye size={26} />
                            </button>
                          </Dialog.Trigger>
                          <ModalViewBlock
                            block={blockModal}
                            title={association.titulo}
                            client={findClient(association.bloco_id)}
                          />
                        </Dialog.Root>
                        <button
                          onClick={() => {
                            downloadFile(
                              getDocxBlob(
                                captureTexts(association.bloco_id),
                                association.titulo,
                                association.bloco_id
                              ),
                              association.titulo
                            );
                          }}
                        >
                          <DownloadSimple size={26} />
                        </button>
                        <button
                          onClick={() =>
                            deleteAssociation(association.bloco_id)
                          }
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
export default ShowBlocks;
