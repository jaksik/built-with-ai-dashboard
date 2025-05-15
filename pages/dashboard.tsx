import { GetServerSideProps } from "next";
import { requireAuth } from "../lib/requireAuth";
import Layout from "../components/Layout";


export default function CreateToolsPage() {
  return (
    <Layout>
      <h1>Welcome to the dashboard</h1>
     
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = requireAuth(async () => {
  return { props: {} };
});