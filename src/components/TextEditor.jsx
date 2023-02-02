import axios from "axios";
import dynamic from "next/dynamic";
import { useState } from "react";
import "react-quill/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

export function TextEditor() {
  const [valueText, setValueText] = useState("");

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

  async function saveText(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    const text = {
      titulo: data.titulo,
      text: valueText,
    };
    try {
      await axios.post("https://web-production-2ecf.up.railway.app/texts", {
        titulo: text.titulo,
        texto: text.text,
      });
      alert("Texto cadastrado com sucesso!");
      location.reload(false);
    } catch (error) {
      console.log(error);
      alert("Erro ao cadastrar o texto!");
    }
  }

  return (
    <form onSubmit={saveText}>
      <div className="flex justify-center flex-col">
        <input
          className="w-full h-10 px-3 placeholder-white bg-transparent mb-4
          block py-2.5 text-sm text-gray-900  border-2  appearance-none dark:text-white dark:border-yellow-500
          dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          type="text"
          placeholder="Título"
          name="titulo"
          id="titulo"
        />
        <ReactQuill
          theme="snow"
          modules={modules}
          formats={formats}
          value={valueText}
          onChange={(e) => {
            setValueText(e);
          }}
          placeholder="Texto..."
        />
      </div>
      <div className="flex justify-center px-16 py-16">
        <button
          type="submit"
          className="bg-yellow-300 hover:bg-yellow-500 p-2 rounded-lg text-black"
        >
          Criar Texto
        </button>
      </div>
    </form>
  );
}

export default TextEditor;
