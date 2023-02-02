import * as Dialog from "@radix-ui/react-dialog";
import HtmlReactParser from "html-react-parser";

export function ModalViewBlock(props) {
  let newText = "";
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black/60 inset-0 fixed" />
      <Dialog.Content
        className="fixed bg-gray-500 py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[70%]
        shadow-lg shadow-black/25 h-[100vh] z-[1000] overflow-y-auto"
      >
        <Dialog.Title className="flex justify-center items-center text-2xl font-black mb-8">
          <span>{props.title}</span>
        </Dialog.Title>
        <div className="flex flex-col font-bold text-xl w-[297mm] min-h-[210mm] px-8 py-8 bg-white text-black rounded-lg">
          {props.block.map((text, index) => {
            newText += text.texto;
            newText = newText.replace(/{nome}/g, props.client[0].nome);
            newText = newText.replace(/{cpf}/g, props.client[0].cpf);
            newText = newText.replace(/{rg}/g, props.client[0].rg);
            newText = newText.replace(
              /{nacionalidade}/g,
              props.client[0].nacionalidade
            );
            newText = newText.replace(
              /{estadoCivil}/g,
              props.client[0].estado_civil
            );
            newText = newText.replace(
              /{orgaoEmissor}/g,
              props.client[0].orgao_emissor
            );
            newText = newText.replace(/{telefone}/g, props.client[0].telefone);
            newText = newText.replace(/{email}/g, props.client[0].email);
            newText = newText.replace(
              /{profissao}/g,
              props.client[0].profissao
            );
            newText = newText.replace(/{endereco}/g, props.client[0].endereco);
            newText = newText.replace(/{numero}/g, props.client[0].numero);
            newText = newText.replace(/{cidade}/g, props.client[0].cidade);
            newText = newText.replace(/{cep}/g, props.client[0].cep);
            newText = newText.replace(/{estado}/g, props.client[0].estado);
            return <span key={index}>{HtmlReactParser(String(newText))}</span>;
          })}
        </div>
        <Dialog.Description />
        <Dialog.Close />
      </Dialog.Content>
    </Dialog.Portal>
  );
}

export default ModalViewBlock;
