import { getSession, signIn, useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import Layout from "@/components/Layout";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") return <LoadingSpinner />;

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-6">Welcome to Dashboard</h1>
          <button 
            onClick={() => signIn()}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard Home</h1>
        <p className="text-gray-700">Welcome, {session.user?.name}</p>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  return { props: { session } };
};
