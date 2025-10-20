import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "../api/auth/[...nextauth]/route";

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
      <nav className="p-4 bg-gray-100 dark:bg-gray-800">
        <h2 className="text-xl font-bold">Panel de Administración</h2>
        <div className="flex gap-4 mt-2">
          <Link href="/">Volver al sitio</Link>
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/products">Productos</Link>
          <Link href="/admin/orders">Órdenes</Link>
        </div>
      </nav>
      <main className="p-4">{children}</main>
    </div>
  );
}
