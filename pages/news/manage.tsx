import { GetServerSideProps } from "next";
import { requireAuth } from "../../lib/requireAuth";
import Layout from "../../components/Layout";
import NewsManager from '@/components/NewsManager';

export default function ManageNewsPage() {
  return (
    <Layout>
      <NewsManager />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = requireAuth(async () => {
  return { props: {} };
});