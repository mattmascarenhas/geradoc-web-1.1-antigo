import * as Dialog from "@radix-ui/react-dialog";

export function ModalViewClient(props) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black/60 inset-0 fixed" />
      <Dialog.Content
        className="fixed bg-gray-500 py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[90%]
        shadow-lg shadow-black/25"
      >
        <Dialog.Title className="flex justify-center items-center text-2xl font-black mb-8">
          Dados do Cliente
        </Dialog.Title>
        <div className="flex flex-col p-6 border-4 border-stone-50 font-bold text-xl">
          <div className=" flex gap-4 w-full mb-4">
            <div className="flex flex-col w-full md:w-1/2 ">
              <span>Nome: </span>
              <span className="text-yellow-400">{props.client.nome}</span>
            </div>
            <div className="flex flex-col w-full md:w-1/4">
              <span>CPF/CNPJ: </span>
              <span className="text-yellow-400">{props.client.cpf}</span>
            </div>
            <div className="flex flex-col w-full md:w-1/4">
              <span>RG: </span>
              <span className="text-yellow-400">{props.client.rg}</span>
            </div>
          </div>
          <div className=" flex gap-4 w-full my-4">
            <div className="flex flex-col w-full md:w-1/2 ">
              <span>Nacionalidade: </span>
              <span className="text-yellow-400">
                {props.client.nacionalidade}
              </span>
            </div>
            <div className="flex flex-col w-full md:w-1/4">
              <span>Estado Civil: </span>
              <span className="text-yellow-400">
                {props.client.estado_civil}
              </span>
            </div>
            <div className="flex flex-col w-full md:w-1/4">
              <span>Orgão Emissor: </span>
              <span className="text-yellow-400">
                {props.client.orgao_emissor}
              </span>
            </div>
          </div>
          <div className=" flex gap-4 w-full my-4">
            <div className="flex flex-col w-full md:w-1/2 ">
              <span>Número de Telefone: </span>
              <span className="text-yellow-400">{props.client.telefone}</span>
            </div>
            <div className="flex flex-col w-full md:w-1/4">
              <span>Email: </span>
              <span className="text-yellow-400">{props.client.email}</span>
            </div>
            <div className="flex flex-col w-full md:w-1/4">
              <span>Profissão: </span>
              <span className="text-yellow-400">{props.client.profissao}</span>
            </div>
          </div>
          <div className=" flex gap-8 w-full my-4">
            <div className="flex flex-col w-full md:w-1/2 ">
              <span>Endereço: </span>
              <span className="text-yellow-400">{props.client.endereco}</span>
            </div>
            <div className="flex flex-col w-full md:w-1/4 ">
              <span>Número: </span>
              <span className="text-yellow-400">{props.client.numero}</span>
            </div>
            <div className="flex flex-col w-full md:w-1/3">
              <span>Cidade/Estado: </span>
              <span className="text-yellow-400">
                {props.client.cidade} - {props.client.estado}
              </span>
            </div>
            <div className="flex flex-col w-full md:w-1/3">
              <span>CEP: </span>
              <span className="text-yellow-400">{props.client.cep}</span>
            </div>
          </div>
        </div>
        <Dialog.Description />
        <Dialog.Close />
      </Dialog.Content>
    </Dialog.Portal>
  );
}

export default ModalViewClient;
