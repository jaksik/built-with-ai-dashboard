import { GetServerSideProps } from "next";
import { requireAuth } from "../../lib/requireAuth";
import Layout from "../../components/Layout";
import ToolCreateForm from "../../components/ToolCreateForm";

export default function CreateToolsPage() {
  return (
    <Layout>
      <h1>Create News</h1>
      <ToolCreateForm />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = requireAuth(async () => {
  return { props: {} };
});