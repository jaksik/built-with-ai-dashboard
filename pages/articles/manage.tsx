import { GetServerSideProps } from "next";
import { requireAuth } from "../../lib/requireAuth";
import Layout from "../../components/Layout";
import ArticleTable from "@/components/ArticleManager/ArticleTable";

export default function ManageNewsPage() {
  return (
    <Layout>
      <ArticleTable/>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = requireAuth(async () => {
  return { props: {} };
});