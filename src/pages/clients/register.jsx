import { useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import InputSimple from "../../components/InputSimple";
import InputCpfCnpj from "../../components/InputCpfCnpj";
import InputRg from "../../components/InputRg";
import InputCep from "../../components/InputCep";
import InputPhoneNumber from "../../components/InputPhoneNumber";
import InputState from "../../components/InputState";
import InputCity from "../../components/InputCity";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";

export function Register() {
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

  async function handleRegisterClient(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    try {
      await axios.post("https://web-production-2ecf.up.railway.app/clients", {
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
      });
      router.push("/clients");
      return alert("Cliente cadastrado com sucesso!");
    } catch (error) {
      console.log(error);
      return alert("Erro ao cadastrar o cliente!");
    }
  }
  return (
    <form onSubmit={handleRegisterClient}>
      <Header />
      <span className="flex py-8 justify-center text-4xl">
        Cadastrar Cliente
      </span>
      <div className="flex flex-col border-4 border-stone-50 font-bold text-xl mx-20">
        <div className=" flex px-8 pb-4 pt-8 gap-4 w-full ">
          <div className="w-full md:w-1/2 ">
            <label className="block mb-1 font-bold" htmlFor="nome">
              Nome completo
            </label>
            <InputSimple name="nome" id="nome" />
          </div>
          <div className="w-full md:w-1/4">
            <label className="block mb-1 font-bold" htmlFor="cpf">
              CPF / CNPJ
            </label>
            <InputCpfCnpj name="cpf" id="cpf" onChange={handleRgDisabled} />
          </div>
          <div className="w-full md:w-1/4">
            <label className="block mb-1 font-bold" htmlFor="rg">
              RG
            </label>
            <InputRg name="rg" id="rg" disabled={rgDisabled} />
          </div>
        </div>
        <div className=" flex px-8 pb-4 gap-4 w-full ">
          <div className="w-full md:w-1/3">
            <label className="block mb-1 font-bold" htmlFor="nacionalidade">
              Nacionalidade
            </label>
            <InputSimple name="nacionalidade" id="nacionalidade" />
          </div>
          <div className="w-full md:w-1/3">
            <label className="block mb-1 font-bold" htmlFor="estado_civil">
              Estado Civil
            </label>
            <InputSimple name="estado_civil" id="estado_civil" />
          </div>
          <div className="w-full md:w-1/3">
            <label className="block mb-1 font-bold" htmlFor="orgao_emissor">
              Orgão Emissor
            </label>
            <InputSimple
              name="orgao_emissor"
              id="orgao_emissor"
              disabled={rgDisabled}
            />
          </div>
        </div>
        <div className=" flex px-8 pb-4 w-full ">
          <div className="w-full md:w-full">
            <label className="block mb-1 font-bold" htmlFor="endereco">
              Endereço
            </label>
            <InputSimple name="endereco" id="endereco" />
          </div>
        </div>
        <div className=" flex px-8 pb-4 gap-4 w-full ">
          <div className="w-full md:w-1/6">
            <label htmlFor="">Estado</label>
            <InputState
              onChange={(e) => setSelectedState(e.target.value)}
              name="estado"
              id="estado"
            />
          </div>
          <div className="w-full md:w-1/2">
            <label htmlFor="">Cidade</label>
            <InputCity state={selectedState} name="cidade" id="cidade" />
          </div>
          <div className="w-full md:w-1/6">
            <label htmlFor="">CEP</label>
            <InputCep name="cep" id="cep" />
          </div>
          <div className="w-full md:w-1/6">
            <label className="block mb-1 font-bold" htmlFor="numero">
              Número
            </label>
            <InputSimple name="numero" id="numero" />
          </div>
        </div>
        <div className=" flex px-8 gap-4 w-full ">
          <div className="w-full md:w-1/4">
            <label htmlFor="">Número do Telefone</label>
            <InputPhoneNumber name="telefone" id="telefone" />
          </div>
          <div className="w-full md:w-1/2">
            <label className="block mb-1 font-bold" htmlFor="email">
              Email
            </label>
            <InputSimple name="email" id="email" />
          </div>
          <div className="w-full md:w-1/4">
            <label className="block mb-1 font-bold" htmlFor="profissao">
              Profissão
            </label>
            <InputSimple name="profissao" id="profissao" />
          </div>
        </div>
        <div className="flex p-8 justify-center">
          <button
            type="submit"
            className="flex text-black items-center p-3 text-xl bg-yellow-500 rounded-md hover:bg-yellow-600"
          >
            Cadastrar
          </button>
        </div>
      </div>
    </form>
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

export default Register;
