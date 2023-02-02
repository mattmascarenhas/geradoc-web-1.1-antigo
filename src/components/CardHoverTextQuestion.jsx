import * as HoverCard from "@radix-ui/react-hover-card";
import { Info, Question } from "phosphor-react";

export function CardHoverTextQuestion() {
  return (
    <div>
      <HoverCard.Root>
        <HoverCard.Trigger>
          <Question size={26} color="#fcfcfc" weight="fill" />{" "}
        </HoverCard.Trigger>
        <HoverCard.Portal>
          <HoverCard.Content className="HoverCardContent" sideOffset={5}>
            <div className=" text-black  w-[320px]">
              <div className="p-1 ">
                <ul className="">
                  <li>* Variáveis genéricas é o diferencial do APP</li>
                  <li>
                    * Ao utilizar uma variável genérica, um único texto servirá
                    para todos os clientes
                  </li>
                  <li className="flex ">
                    * No botão interativo ao lado direito da tela, tem
                    informações de como utilizar as variáveis genéricas
                  </li>
                </ul>
              </div>
            </div>
            <HoverCard.Arrow className="HoverCardArrow" />
          </HoverCard.Content>
        </HoverCard.Portal>
      </HoverCard.Root>
    </div>
  );
}

export default CardHoverTextQuestion;
