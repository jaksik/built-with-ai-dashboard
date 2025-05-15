import { GetServerSideProps } from "next";
import { requireAuth } from "../../lib/requireAuth";
import Layout from "../../components/Layout";
import ArticleDiscover from '@/components/ArticleDiscover';

export default function ManageNewsPage() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Discover News</h1>
      <ArticleDiscover />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = requireAuth(async () => {
  return { props: {} };
});