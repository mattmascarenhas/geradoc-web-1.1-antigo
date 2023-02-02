import { getSession } from "next-auth/react";
import AssociateTextWithBlock from "../../components/AssociateTextWithBlock";
import Header from "../../components/Header";

export function AssociateText() {
  return (
    <div>
      <Header />
      <div>
        <AssociateTextWithBlock />
      </div>
    </div>
  );
}
export async function getServerSideProps(context) {
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
export default AssociateText;
