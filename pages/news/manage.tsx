import { GetServerSideProps } from "next";
import { requireAuth } from "../../lib/requireAuth";
import Layout from "../../components/Layout";
import SimpleForm from "../../components/Form";

export default function ManageNewsPage() {
  return (
    <Layout>
      <h1>Create News</h1>
      <SimpleForm />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = requireAuth(async () => {
  return { props: {} };
});