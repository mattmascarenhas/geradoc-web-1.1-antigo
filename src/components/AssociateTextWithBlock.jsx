import axios from "axios";
import { Plus } from "phosphor-react";
import { useEffect, useState } from "react";

export function AssociateTextWithBlock() {
  // dados dos blocos, textos e tabela de relacionamento
  const [blocks, setBlocks] = useState([]);
  const [texts, setTexts] = useState([]);
  const [existsAssociate, setExistsAssociate] = useState([]);

  useEffect(() => {
    axios("https://web-production-2ecf.up.railway.app/texts").then((res) =>
      setTexts(res.data)
    );
    axios("https://web-production-2ecf.up.railway.app/blocks").then((res) =>
      setBlocks(res.data)
    );
    axios("https://web-production-2ecf.up.railway.app/blocks-texts").then(
      (res) => setExistsAssociate(res.data)
    );
  }, []);

  // estados para poder gerar os inputs dinamicos e armazenar os id dos textos
  const [newText, setNewText] = useState([[]]);
  // capturar os dados do bloco no front para assosciar
  const [blockAssociate, setBlockAssociate] = useState([]);

  //capturando os textos para salvar no bloco
  function handleChange(e, index) {
    const { value } = e;
    let values = [...newText];
    values[index] = value;
    setNewText((state) => [...values]);
  }

  //adicionar novo campo de texto
  function addTextForBlock() {
    setNewText((state) => [...state, []]);
  }
  //verificar se já existe na tabela de relacionamento a associação entre bloco e texto
  function exists(array, bloco_id, texto_id) {
    return array.some((item) => {
      var dataBase = String(item.bloco_id) + String(item.texto_id);
      var dataFront = String(bloco_id) + String(texto_id);
      return dataBase === dataFront;
    });
  }

  //associa na tabela de relacionamento o bloco com os textos
  async function associateText() {
    const data = [];
    var alreadyExist = false;
    newText.map((text, index) => {
      data[index] = {
        bloco_id: parseInt(blockAssociate),
        texto_id: parseInt(text),
      };
      //chama a função que verifica se há uma associação ja feita igual a que foi solicitada pelo usuario
      alreadyExist = exists(
        existsAssociate,
        data[index].bloco_id,
        data[index].texto_id
      );
    });
    if (alreadyExist == true) {
      alert("Um dos textos selecionados já está associoado ao bloco atual!");
    } else {
      try {
        await axios.post(
          "https://web-production-2ecf.up.railway.app/blocks-texts",
          data
        );
        return alert("Bloco associado com sucesso!"), location.reload(false); //atualiza a pagina
      } catch (error) {
        console.log(error);
        return alert("Erro ao associar o bloco!");
      }
    }
    //  console.log(data);
  }
  return (
    <div className="flex justify-center">
      <div className="flex flex-col m-8 p-8 w-full md:w-2/5 border-2 rounded-lg ">
        <span className="flex justify-center font-bold text-3xl mb-8">
          Associar Textos a um bloco
        </span>
        <div className="flex flex-col">
          <select
            name="block"
            className="w-full h-10 px-3 placeholder-gray-600  block py-2.5 text-sm text-gray-900 bg-transparent border-0 border-b-2
                  border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0
                  focus:border-blue-600 peer mb-8"
            onChange={(e) => setBlockAssociate(e.target.value)}
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
          {newText.map((textMap, index) => {
            return (
              <div key={index}>
                <span className="flex justify-center text-2xl">
                  Texto {index + 1}
                </span>
                <select
                  name="text"
                  className="w-full h-10 px-3 placeholder-gray-600  block py-2.5 text-sm text-gray-900 bg-transparent border-0 border-b-2
                    border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0
                    focus:border-blue-600 peer m-3"
                  onChange={(e) => {
                    handleChange(e.target, index);
                  }}
                >
                  <option value={null}>Selecione o texto...</option>
                  {texts.map((text) => {
                    return (
                      <option value={text.id} key={text.id}>
                        {text.titulo}
                      </option>
                    );
                  })}
                  {newText}
                </select>
              </div>
            );
          })}
          <button
            onClick={addTextForBlock}
            className="flex m-4 justify-center items-center font-bold text-3xl"
          >
            <Plus />
          </button>
          <div className="flex justify-center pt-8">
            <button
              onClick={associateText}
              className=" bg-yellow-300 hover:bg-yellow-500 p-2 rounded-lg text-black"
            >
              Associar Bloco
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssociateTextWithBlock;
