import * as Dialog from "@radix-ui/react-dialog";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import HtmlReactParser from "html-react-parser";
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

export function ModalViewText(props) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black/60 inset-0 fixed" />
      <Dialog.Content className="fixed h-[100vh] z-[1000] overflow-y-auto bg-gray-500 py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[70%] shadow-lg shadow-black/25">
        <Dialog.Title className="flex justify-center items-center text-2xl font-black mb-8">
          {props.text.titulo}
        </Dialog.Title>
        <div className="flex flex-col font-bold text-xl justify-center ">
          <span className=" w-[297mm] min-h-[210mm] px-8 py-8 bg-white text-black rounded-lg">
            {HtmlReactParser(String(props.text.texto))}
          </span>
        </div>
        <Dialog.Description />
        <Dialog.Close />
      </Dialog.Content>
    </Dialog.Portal>
  );
}

export default ModalViewText;
