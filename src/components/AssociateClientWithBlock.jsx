import axios from "axios";
import { useEffect, useState } from "react";

export function AssociateClientWithBlock() {
  // clientes e blocos buscados do banco de dados
  const [clients, setClients] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [existsAssociate, setExistsAssociate] = useState([]);

  useEffect(() => {
    axios("https://web-production-2ecf.up.railway.app/clients").then((res) =>
      setClients(res.data)
    );
    axios("https://web-production-2ecf.up.railway.app/blocks").then((res) =>
      setBlocks(res.data)
    );
    axios("https://web-production-2ecf.up.railway.app/clients-blocks").then(
      (res) => setExistsAssociate(res.data)
    );
  }, []);

  //armazena o id do cliente e bloco selecionado
  const [clientSelected, setClientSelected] = useState([]);
  const [blockSelected, setBlockSelected] = useState([]);

  //verificar se já existe na tabela de relacionamento a associação entre cliente e bloco
  function exists(array, cliente_id, bloco_id) {
    return array.some((item) => {
      var dataBase = String(item.cliente_id) + String(item.bloco_id);
      var dataFront = String(cliente_id) + String(bloco_id);
      return dataBase === dataFront;
    });
  }
  //verificar se o bloco ja está associado a outro cliente
  function existsBlock(array, bloco_id) {
    return array.some((item) => {
      return item.bloco_id === parseInt(bloco_id);
    });
  }

  async function associateClient() {
    var alreadyExist = false;
    var alreadyExistBlock = false;

    alreadyExist = exists(existsAssociate, clientSelected, blockSelected);
    alreadyExistBlock = existsBlock(existsAssociate, blockSelected);

    if (alreadyExist == true) {
      alert("O cliente já está associado ao bloco !");
    } else if (alreadyExistBlock == true) {
      alert("O bloco já está associado!");
    } else if (String(blockSelected) === "" || String(clientSelected) === "") {
      alert("Selecione um cliente/bloco!");
    } else {
      try {
        await axios.post(
          "https://web-production-2ecf.up.railway.app/clients-blocks",
          {
            cliente_id: clientSelected,
            bloco_id: blockSelected,
          }
        );
        return (
          alert("Bloco associado ao cliente com sucesso!"),
          location.reload(false) //atualiza a pagina
        );
      } catch (error) {
        console.log(error);
        return alert("Erro ao associar o cliente ao bloco!");
      }
    }
  }

  return (
    <div className="flex justify-center">
      <div className="flex flex-col m-8 p-8 w-full md:w-2/5 border-2 rounded-lg ">
        <span className="flex justify-center font-bold text-3xl mb-8 ">
          Associar Cliente com Bloco
        </span>
        <select
          name="client"
          className="w-full h-10 px-3 placeholder-gray-600  block py-2.5 text-sm text-gray-900 bg-transparent border-0 border-b-2
                  border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0
                  focus:border-blue-600 peer mb-8"
          onChange={(e) => setClientSelected(e.target.value)}
        >
          <option value="">Selecione o Cliente</option>
          {clients.map((client) => {
            return (
              <option value={client.id} key={client.id}>
                {client.nome}
              </option>
            );
          })}
        </select>
        <select
          name="block"
          className="w-full h-10 px-3 placeholder-gray-600  block py-2.5 text-sm text-gray-900 bg-transparent border-0 border-b-2
                  border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0
                  focus:border-blue-600 peer mb-8"
          onChange={(e) => setBlockSelected(e.target.value)}
        >
          <option value="">Selecione o Bloco</option>
          {blocks.map((block) => {
            return (
              <option value={block.id} key={block.id}>
                {block.titulo}
              </option>
            );
          })}
        </select>
        <div className="flex justify-center">
          <button
            onClick={associateClient}
            className=" bg-yellow-300 hover:bg-yellow-500 p-2 rounded-lg text-black"
          >
            Associar Cliente
          </button>
        </div>
      </div>
    </div>
  );
}
export default AssociateClientWithBlock;
