import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminNotificationBell from "@/components/Notifications/AdminNotificationBell";
import FirebaseMessagingProvider from "@/components/Notifications/FirebaseMessagingProvider";
import {
  FaHome,
  FaBox,
  FaShoppingBag,
  FaUsers,
  FaClipboardList,
  FaPaintBrush,
} from "react-icons/fa";
import { authOptions } from "@/lib/authOptions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  if (session.user?.email !== process.env.NEXT_PUBLIC_USER_ADMIN) {
    redirect("/");
  }

  const navLinks = [
    { href: "/admin", label: "Dashboard", icon: FaHome },
    { href: "/admin/products", label: "Productos", icon: FaBox },
    { href: "/admin/orders", label: "Órdenes", icon: FaShoppingBag },
    { href: "/admin/users", label: "Usuarios", icon: FaUsers },
    {
      href: "/admin/submissions",
      label: "Cotizaciones",
      icon: FaClipboardList,
    },
    { href: "/admin/design", label: "Diseño", icon: FaPaintBrush },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <FirebaseMessagingProvider />

      {/* Header */}
      <nav className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                  Panel Admin
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Itap Impresiones
                </p>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              <AdminNotificationBell />
              <Link
                href="/"
                className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors"
              >
                Volver al sitio
              </Link>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex gap-1 pb-2 overflow-x-auto">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:text-violet-600 dark:hover:text-violet-400 transition-colors whitespace-nowrap"
                >
                  <Icon className="text-base" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
