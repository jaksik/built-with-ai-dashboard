import { GetServerSideProps } from "next";
import { requireAuth } from "../../lib/requireAuth";
import Layout from "../../components/Layout";
import EditArticles from "@/components/EditArticles";

export default function ManageNewsPage() {
  return (
    <Layout>
      <EditArticles/>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = requireAuth(async () => {
  return { props: {} };
});