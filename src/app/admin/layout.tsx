import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "../api/auth/[...nextauth]/route";
import AdminNotificationBell from "@/components/Notifications/AdminNotificationBell";
import FirebaseMessagingProvider from "@/components/Notifications/FirebaseMessagingProvider";

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

  return (
    <div>
      <FirebaseMessagingProvider />
      <nav className="p-4 bg-gray-100 dark:bg-gray-800">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Panel de Administración</h2>
          <AdminNotificationBell />
        </div>
        <div className="flex gap-4 mt-2">
          <Link href="/">Volver al sitio</Link>
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/products">Productos</Link>
          <Link href="/admin/orders">Órdenes</Link>
          <Link href="/admin/users">Usuarios</Link>
        </div>
      </nav>
      <main className="p-4">{children}</main>
    </div>
  );
}
