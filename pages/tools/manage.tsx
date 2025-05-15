import { GetServerSideProps } from "next";
import { requireAuth } from "../../lib/requireAuth";
import Layout from "../../components/Layout";
import { ToolsManager } from '../../components/ToolsManager';

export default function ManageToolsPage() {
  return (
    <Layout>
      <h1>Create News</h1>
      <ToolsManager />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = requireAuth(async () => {
  return { props: {} };
});