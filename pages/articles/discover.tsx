import { GetServerSideProps } from "next";
import { requireAuth } from "../../lib/requireAuth";
import Layout from "../../components/Layout";
import ArticleDiscover from '@/components/NewsDiscoverPage';

export default function DiscoverNewsPage() {
  return (
    <Layout>
      <ArticleDiscover />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = requireAuth(async () => {
  return { props: {} };
});