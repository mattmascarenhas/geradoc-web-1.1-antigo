import axios from "axios";
import { useEffect, useState } from "react";

export function InputState(props) {
  const [states, setStates] = useState([]);

  useEffect(() => {
    axios
      .get("https://servicodados.ibge.gov.br/api/v1/localidades/estados/")
      .then((res) => setStates(res.data));
  }, []);
  return (
    <div>
      <select
        className="w-full h-10 px-3 placeholder-gray-600  block py-2.5 text-sm text-gray-900 bg-transparent border-0 border-b-2
       border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0
       focus:border-blue-600 peer"
        {...props}
        type="text"
      >
        <option className=""></option>
        {states
          .sort((a, b) => {
            if (a.nome < b.nome) return -1;
            else return true;
          })
          .map((state) => (
            <option
              className="bg-[#121214] text-white"
              key={state.nome}
              value={state.sigla}
            >
              {state.nome}
            </option>
          ))}
      </select>
    </div>
  );
}

export default InputState;
