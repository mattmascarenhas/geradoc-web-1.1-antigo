import axios from "axios";
import { useState } from "react";
import Header from "../../components/Header";
import InputSimple from "../../components/InputSimple";
import InputCpfCnpj from "../../components/InputCpfCnpj";
import InputRg from "../../components/InputRg";
import InputCep from "../../components/InputCep";
import InputPhoneNumber from "../../components/InputPhoneNumber";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";

export async function GetStaticProps(context) {
  const { params } = context;
  const data = await fetch(
    `https://web-production-2ecf.up.railway.app/clients/${params.id}`
  );

  const client = await data.json();

  return {
    props: { client },
  };
}

export async function GetStaticPaths() {
  const response = await fetch(
    `https://web-production-2ecf.up.railway.app/clients/`
  );
  const data = await response.json();
  const paths = data.map((client) => {
    return {
      params: {
        id: `${client.id}`,
      },
    };
  });
  return { paths, fallback: false };
}

export function EditClient({ client }) {
  const [selectedState, setSelectedState] = useState("");
  const [rgDisabled, setRgDisabled] = useState(false);
  const router = useRouter();

  function handleRgDisabled(value) {
    if (value.length >= 18) {
      setRgDisabled(true);
    } else {
      setRgDisabled(false);
    }
  }
  console.log(client);

  async function editClient(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    try {
      await axios.put(
        `https://web-production-2ecf.up.railway.app/clients/${client.id}`,
        {
          nome: data.nome,
          cpf: data.cpf,
          rg: data.rg,
          nacionalidade: data.nacionalidade,
          estado_civil: data.estado_civil,
          orgao_emissor: data.orgao_emissor,
          endereco: data.endereco,
          cidade: data.cidade,
          estado: data.estado,
          cep: data.cep,
          numero: data.numero,
          telefone: data.telefone,
          email: data.email,
          profissao: data.profissao,
        }
      );
      router.push("/clients");
      return alert("Cliente atualizado com sucesso!");
    } catch (error) {
      console.log(error);
      return alert("Erro ao atualizar  o cliente!");
    }
  }

  return (
    <div>
      <Header />

      <span className="flex py-8 justify-center text-4xl font-bold">
        Editar Cliente
      </span>
      <form onSubmit={editClient}>
        <div className="flex flex-col mx-12 border-4 border-stone-50 font-bold text-xl ">
          <div className=" flex px-8 pb-4 pt-8 gap-4 w-full ">
            <div className="w-full md:w-1/2 ">
              <label className="block mb-1 font-bold" htmlFor="nome">
                Nome completo
              </label>
              <InputSimple name="nome" defaultValue={client.nome} id="nome" />
            </div>
            <div className="w-full md:w-1/4">
              <label className="block mb-1 font-bold" htmlFor="cpf">
                CPF / CNPJ
              </label>
              <InputCpfCnpj
                name="cpf"
                value={client.cpf}
                id="cpf"
                onChange={handleRgDisabled}
              />
            </div>
            <div className="w-full md:w-1/4">
              <label className="block mb-1 font-bold" htmlFor="rg">
                RG
              </label>
              <InputRg
                name="rg"
                defaultValue={client.rg}
                id="rg"
                disabled={rgDisabled}
              />
            </div>
          </div>
          <div className=" flex px-8 pb-4 gap-4 w-full ">
            <div className="w-full md:w-1/3">
              <label className="block mb-1 font-bold" htmlFor="nacionalidade">
                Nacionalidade
              </label>
              <InputSimple
                name="nacionalidade"
                defaultValue={client.nacionalidade}
                id="nacionalidade"
              />
            </div>
            <div className="w-full md:w-1/3">
              <label className="block mb-1 font-bold" htmlFor="estadoCivil">
                Estado Civil
              </label>
              <InputSimple
                name="estadoCivil"
                defaultValue={client.estado_civil}
                id="estadoCivil"
              />
            </div>
            <div className="w-full md:w-1/3">
              <label className="block mb-1 font-bold" htmlFor="orgaoEmissor">
                Orgão Emissor
              </label>
              <InputSimple
                name="orgaoEmissor"
                defaultValue={client.orgao_emissor}
                id="orgaoEmissor"
                disabled={rgDisabled}
              />
            </div>
          </div>
          <div className=" flex px-8 pb-4 w-full ">
            <div className="w-full md:w-full">
              <label className="block mb-1 font-bold" htmlFor="endereco">
                Endereço
              </label>
              <InputSimple
                name="endereco"
                defaultValue={client.endereco}
                id="endereco"
              />
            </div>
          </div>
          <div className=" flex px-8 pb-4 gap-4 w-full ">
            <div className="w-full md:w-1/6">
              <label htmlFor="">Estado</label>
              <InputSimple
                name="estado"
                defaultValue={client.estado}
                id="estado"
              />
            </div>
            <div className="w-full md:w-1/2">
              <label htmlFor="">Cidade</label>
              <InputSimple
                state={selectedState}
                name="cidade"
                defaultValue={client.cidade}
                id="cidade"
              />
            </div>
            <div className="w-full md:w-1/6">
              <label htmlFor="">CEP</label>
              <InputCep name="cep" defaultValue={client.cep} id="cep" />
            </div>
            <div className="w-full md:w-1/6">
              <label className="block mb-1 font-bold" htmlFor="numero">
                Número
              </label>
              <InputSimple
                name="numero"
                defaultValue={client.numero}
                id="numero"
              />
            </div>
          </div>
          <div className=" flex px-8 gap-4 w-full ">
            <div className="w-full md:w-1/4">
              <label htmlFor="">Número do Telefone</label>
              <InputPhoneNumber
                name="telefone"
                value={client.telefone}
                id="telefone"
              />
            </div>
            <div className="w-full md:w-1/2">
              <label className="block mb-1 font-bold" htmlFor="email">
                Email
              </label>
              <InputSimple
                name="email"
                defaultValue={client.email}
                id="email"
              />
            </div>
            <div className="w-full md:w-1/4">
              <label className="block mb-1 font-bold" htmlFor="profissao">
                Profissão
              </label>
              <InputSimple
                name="profissao"
                defaultValue={client.profissao}
                id="profissao"
              />
            </div>
          </div>
          <div className="flex p-8 justify-center">
            <button
              type="submit"
              className="flex text-black items-center p-3 text-xl bg-green-300 rounded-md hover:bg-green-400"
            >
              Salvar dados
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export async function GetServerSideProps(context) {
  const session = await getSession(context);

  console.log(session);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }
  return {
    props: {
      session,
    },
  };
}
export default EditClient;
