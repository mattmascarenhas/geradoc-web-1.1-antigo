import Header from "../../components/Header";
import TextEditor from "../../components/TextEditor";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import CardHoverText from "../../components/CardHoverText";
import CardHoverTextQuestion from "../../components/CardHoverTextQuestion";
import { getSession } from "next-auth/react";

const { Quill, ReactQuill } = dynamic(() => import("react-quill"), {
  ssr: false,
});
export function RegisterText() {
  return (
    <div>
      <Header />
      <div className="flex justify-center">
        <div className="flex flex-col w-full md:w-4/5 m-8">
          <div className="flex justify-between">
            <CardHoverTextQuestion />

            <span className="font-bold text-3xl mb-8 text-center">
              Cadastrar Texto
            </span>
            <CardHoverText />
          </div>
          <div>
            <TextEditor />
          </div>
        </div>
      </div>
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

export default RegisterText;
