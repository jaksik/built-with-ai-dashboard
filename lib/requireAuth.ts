import { getSession } from "next-auth/react";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";

/**
 * Wraps any getServerSideProps, redirecting to “/” if the user is not signed in.
 */
export function requireAuth(gssp: GetServerSideProps) {
  return async (ctx: GetServerSidePropsContext) => {
    const session = await getSession(ctx);
    if (!session) {
      return {
        redirect: { destination: "/", permanent: false },
      };
    }
    // Add this to redirect authenticated users away from home
    if (ctx.resolvedUrl === '/') {
      return {
        redirect: { destination: "/dashboard", permanent: false },
      };
    }
    return gssp(ctx);
  };
}