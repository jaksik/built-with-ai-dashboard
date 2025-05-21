import { GetServerSideProps } from "next";
import { requireAuth } from "../../lib/requireAuth";
import Layout from "../../components/Layout";
import ImportArticles from '@/components/ImportArticles';

export default function DiscoverNewsPage() {
  return (
    <Layout>
      <ImportArticles />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = requireAuth(async () => {
  return { props: {} };
});