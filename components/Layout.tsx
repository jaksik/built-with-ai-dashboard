import Link from "next/link";
import { ReactNode } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const isActivePath = (path: string) => router.pathname === path;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        </div>
        <nav className="mt-2">
          <ul className="space-y-2">
            <li>
              <Link href="/tools/create"
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                  isActivePath("/tools/create") ? "bg-blue-50 text-blue-600" : ""
                }`}>
                <Image src="/file.svg" alt="" width={20} height={20} className="mr-3" />
                <span>Create Tool</span>
              </Link>
            </li>
            <li>
              <Link href="/tools/manage"
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                  isActivePath("/tools/manage") ? "bg-blue-50 text-blue-600" : ""
                }`}>
                <Image src="/globe.svg" alt="" width={20} height={20} className="mr-3" />
                <span>Manage Tools</span>
              </Link>
            </li>
            <li>
              <Link href="/news/create"
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                  isActivePath("/news/create") ? "bg-blue-50 text-blue-600" : ""
                }`}>
                <Image src="/file.svg" alt="" width={20} height={20} className="mr-3" />
                <span>Create News</span>
              </Link>
            </li>
            <li>
              <Link href="/news/manage"
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                  isActivePath("/news/manage") ? "bg-blue-50 text-blue-600" : ""
                }`}>
                <Image src="/globe.svg" alt="" width={20} height={20} className="mr-3" />
                <span>Manage news</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content with Navbar */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-end px-8 py-4">
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{session?.user?.name}</span>
              <div className="relative group">
                <button className="flex items-center focus:outline-none">
                  {session?.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt="Profile"
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-600 text-lg">
                        {session?.user?.name?.[0] || '?'}
                      </span>
                    </div>
                  )}
                </button>
                <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
