import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { ReactElement, ReactNode } from "react";
import { useSession } from "next-auth/react";
import Layout from "../components/Layout";
import "@/styles/globals.css";

type NextPageWithAuth = AppProps["Component"] & {
  auth?: boolean;
};

type AppPropsWithAuth = AppProps & {
  Component: NextPageWithAuth;
};

export default function App({ Component, pageProps }: AppPropsWithAuth) {
  return (
    <SessionProvider session={pageProps.session}>
      <AuthWrapper Component={Component}>
        <Component {...pageProps} />
      </AuthWrapper>
    </SessionProvider>
  );
}

function AuthWrapper({
  Component,
  children,
}: {
  Component: NextPageWithAuth;
  children: ReactNode;
}) {
  const isProtected = Component.auth;

  if (!isProtected) return children;

  return (
    <AuthGuard>
      <Layout>{children}</Layout>
    </AuthGuard>
  );
}

function AuthGuard({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;
  if (!session && typeof window !== "undefined") {
    window.location.href = "/";
    return null;
  }

  return <>{children}</>;
}
