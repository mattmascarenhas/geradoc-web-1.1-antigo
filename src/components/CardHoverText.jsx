import * as HoverCard from "@radix-ui/react-hover-card";
import { Info } from "phosphor-react";

export function CardHoverText() {
  return (
    <div>
      <HoverCard.Root>
        <HoverCard.Trigger asChild>
          <Info size={26} color="#fcfcfc" weight="fill" />
        </HoverCard.Trigger>
        <HoverCard.Portal>
          <HoverCard.Content className="HoverCardContent" sideOffset={5}>
            <div className="p-1 ">
              <table className="text-black flex flex-col">
                <thead className="">
                  <tr>
                    <th> Variáveis genéricas p/ o cliente</th>
                  </tr>
                </thead>
                <tbody className="">
                  <tr className="  flex flex-col">
                    <td className="font-bold text-sl">{"{nome}"}: Nome</td>
                    <td className="font-bold text-sl">
                      {"{cpf} "}: CPF ou CNPJ
                    </td>
                    <td className="font-bold text-sl">{"{rg} "}: RG</td>
                    <td className="font-bold text-sl">
                      {"{nacionalidade}"}: Nacionalidade
                    </td>
                    <td className="font-bold text-sl">
                      {"{estadoCivil"}: Estado Civil
                    </td>
                    <td className="font-bold text-sl">
                      {"{orgaoEmissor}"}: Orgão Emissor
                    </td>
                    <td className="font-bold text-sl">
                      {"{telefone}"}: Telefone
                    </td>
                    <td className="font-bold text-sl">{"{email}"}: Email</td>
                    <td className="font-bold text-sl">
                      {"{profissao}"}: Profissão
                    </td>
                    <td className="font-bold text-sl">
                      {"{endereco}"}: Endereço
                    </td>
                    <td className="font-bold text-sl">{"{numero}"}: Número</td>
                    <td className="font-bold text-sl">{"{cidade} "}: Cidade</td>
                    <td className="font-bold text-sl">{"{estado}"}: Estado</td>
                    <td className="font-bold text-sl">{"{cep} "}: CEP</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <HoverCard.Arrow className="HoverCardArrow" />
          </HoverCard.Content>
        </HoverCard.Portal>
      </HoverCard.Root>
    </div>
  );
}

export default CardHoverText;
