import Link from "next/link";
import { ReactNode, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isActivePath = (path: string) => router.pathname === path;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed h-full bg-white shadow-lg transition-transform duration-300 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } w-64`}
      >
        <div className="p-6 flex items-center justify-between">
          {/* <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1> */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close sidebar"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="mt-2">
          <ul className="space-y-2">
            <li>
              <Link
                href="/tools/create"
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${isActivePath("/tools/create") ? "bg-blue-50 text-blue-600" : ""
                  }`}
              >
                <Image
                  src="/file.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="mr-3"
                />
                <span>Create Tool</span>
              </Link>
            </li>
            <li>
              <Link
                href="/tools/manage"
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${isActivePath("/tools/manage") ? "bg-blue-50 text-blue-600" : ""
                  }`}
              >
                <Image
                  src="/globe.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="mr-3"
                />
                <span>Manage Tools</span>
              </Link>
            </li>
            <li>
              <Link
                href="/news/create"
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${isActivePath("/news/create") ? "bg-blue-50 text-blue-600" : ""
                  }`}
              >
                <Image
                  src="/file.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="mr-3"
                />
                <span>Create News</span>
              </Link>
            </li>
            <li>
              <Link
                href="/news/manage"
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${isActivePath("/news/manage") ? "bg-blue-50 text-blue-600" : ""
                  }`}
              >
                <Image
                  src="/globe.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="mr-3"
                />
                <span>Manage news</span>
              </Link>
            </li>
            <li>
              <Link
                href="/news/discover"
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${isActivePath("/news/discover") ? "bg-blue-50 text-blue-600" : ""
                  }`}
              >
                <Image
                  src="/globe.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="mr-3"
                />
                <span>Discover news</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content with Navbar */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center space-x-4"> {/* Added flex and space-x-4 */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-gray-600 hover:text-gray-800 focus:outline-none"
                aria-label="Toggle sidebar"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <h1 className="text-xl pl-5 font-semibold tracking-tight text-gray-900">
                <Link href="/" className="flex items-center space-x-2 hover:opacity-90">
                  <Image
                    src="/globe.svg"
                    alt="Logo"
                    width={32}
                    height={32}
                  />
                  <span>Built With AI</span>
                </Link>
              </h1>
            </div>

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
                        {session?.user?.name?.[0] || "?"}
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
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
