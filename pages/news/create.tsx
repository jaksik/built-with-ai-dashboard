import { GetServerSideProps } from "next";
import { requireAuth } from "../../lib/requireAuth";
import Layout from "../../components/Layout";
import NewsCreateForm from "../../components/NewsCreateForm";

export default function CreateNewsPage() {
  return (
    <Layout>
      <h1>Create News</h1>
      <NewsCreateForm />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = requireAuth(async () => {
  return { props: {} };
});