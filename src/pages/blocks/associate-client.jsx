import { getSession } from "next-auth/react";
import AssociateClientWithBlock from "../../components/AssociateClientWithBlock";
import Header from "../../components/Header";

export function AssociateClient() {
  return (
    <div>
      <Header />
      <div>
        <AssociateClientWithBlock />
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
export default AssociateClient;
