import * as Dialog from "@radix-ui/react-dialog";
import axios from "axios";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

export function ModalEditText(props) {
  const [valueText, setValueText] = useState("");

  useEffect(() => {
    if (valueText === "") {
      setValueText(props.text.texto);
    }
  }, [valueText, props.text.texto]);

  async function saveEditedText(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    const textEdited = {
      titulo: data.titulo,
      texto: valueText,
    };
    try {
      await axios.put(
        `https://web-production-2ecf.up.railway.app/texts/${props.text.id}`,
        {
          titulo: textEdited.titulo,
          texto: textEdited.texto,
        }
      );
      return alert("Texto atualizado com sucesso!"), location.reload(false);
    } catch (error) {
      console.log(error);
      return alert("Erro ao atualizar o texto!");
    }
  }

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { align: [] },
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
      [{ color: [] }, { background: [] }],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black/60 inset-0 fixed " />
      <Dialog.Content
        className="fixed h-[100vh] z-[1000] overflow-y-auto bg-gray-500 py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
        rounded-lg w-[90%] shadow-lg shadow-black/25"
      >
        <Dialog.Title className="flex justify-center items-center text-2xl font-black mb-8">
          {props.text.titulo}
        </Dialog.Title>
        <form onSubmit={saveEditedText}>
          <div className="flex flex-col p-6   font-bold text-xl">
            <input
              className="w-full h-10  px-3 placeholder-white bg-transparent mb-4
              block py-2.5 text-sm text-gray-900  border-2  appearance-none dark:text-white dark:border-gray-50
             dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              type="text"
              placeholder="Título"
              name="titulo"
              id="titulo"
              defaultValue={props.text.titulo}
            />
            <ReactQuill
              theme="snow"
              modules={modules}
              formats={formats}
              defaultValue={props.text.texto}
              onChange={(e) => setValueText(e)}
              placeholder="Texto..."
            />
          </div>
          <div className="flex justify-center pt-8">
            <button
              type="submit"
              className="bg-yellow-300 hover:bg-yellow-500 p-2 rounded-lg text-black"
            >
              Salvar Texto
            </button>
          </div>
        </form>
        <Dialog.Description />
        <Dialog.Close />
      </Dialog.Content>
    </Dialog.Portal>
  );
}

export default ModalEditText;
