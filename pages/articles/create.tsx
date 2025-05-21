import { GetServerSideProps } from "next";
import { requireAuth } from "../../lib/requireAuth";
import Layout from "../../components/Layout";
import CreateArticleForm from "../../components/CreateArticleForm";

export default function CreateNewsPage() {
  return (
    <Layout>
      <CreateArticleForm />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = requireAuth(async () => {
  return { props: {} };
});