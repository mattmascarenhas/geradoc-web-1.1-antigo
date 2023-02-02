import { useEffect, useState } from "react";
import { mask, unMask } from "remask";

export function InputCpfCnpj({ onChange, value, ...props }) {
  const [cpfCnpj, setCpfCnpj] = useState("");

  useEffect(() => {
    if (value) setCpfCnpj(value);
  }, []);

  function valueMasked(e) {
    setCpfCnpj(mask(unMask(e), ["999.999.999-99", "99.999.999/9999-99"]));
    if (onChange) onChange(e);
  }

  return (
    <div>
      <input
        {...props}
        className="w-full h-10 px-3 placeholder-gray-600  block py-2.5 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        type="text"
        value={cpfCnpj}
        onChange={(e) => {
          valueMasked(e.target.value);
        }}
      />
    </div>
  );
}

export default InputCpfCnpj;
