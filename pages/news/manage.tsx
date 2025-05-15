import { GetServerSideProps } from "next";
import { requireAuth } from "../../lib/requireAuth";
import Layout from "../../components/Layout";
import NewsManager from '@/components/NewsManager';

export default function ManageNewsPage() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Manage News</h1>
      <NewsManager />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = requireAuth(async () => {
  return { props: {} };
});