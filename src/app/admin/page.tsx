import { adminDb } from "@/firebase/admin";
import Link from "next/link";
import TestNotificationButton from "./TestNotificationButton";
import { FaShoppingBag, FaUsers, FaMoneyBillWave, FaBox, FaArrowRight, FaClipboardList } from "react-icons/fa";

export const dynamic = "force-dynamic";

async function getDashboardStats() {
  if (!adminDb) return null;

  try {
    const [ordersSnap, usersSnap, productsSnap, submissionsSnap] = await Promise.all([
      adminDb.collection("orders").orderBy("createdAt", "desc").get(),
      adminDb.collection("users").get(),
      adminDb.collection("products").get(),
      adminDb.collection("contact_submissions").get(),
    ]);

    const totalOrders = ordersSnap.size;
    const totalUsers = usersSnap.size;
    const totalProducts = productsSnap.size;
    const totalSubmissions = submissionsSnap.size;

    const totalRevenue = ordersSnap.docs.reduce((acc, doc) => {
      const data = doc.data();
      return acc + (data.orderAmount || 0);
    }, 0);

    const recentOrders = ordersSnap.docs.slice(0, 5).map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString(),
    }));

    return {
      totalOrders,
      totalUsers,
      totalProducts,
      totalSubmissions,
      totalRevenue,
      recentOrders,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return null;
  }
}

const AdminDashboardPage = async () => {
  const stats = await getDashboardStats();

  if (!stats) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-500">Error cargando el dashboard</h2>
        <p className="text-gray-500">Verifique la conexión con Firebase Admin SDK.</p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Ingresos Totales",
      value: `$${stats.totalRevenue.toLocaleString("es-AR")}`,
      icon: <FaMoneyBillWave className="text-green-500 text-2xl" />,
      bg: "bg-green-100 dark:bg-green-900/20",
      border: "border-green-200 dark:border-green-800",
    },
    {
      title: "Órdenes",
      value: stats.totalOrders,
      icon: <FaShoppingBag className="text-blue-500 text-2xl" />,
      bg: "bg-blue-100 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-800",
    },
    {
      title: "Usuarios",
      value: stats.totalUsers,
      icon: <FaUsers className="text-purple-500 text-2xl" />,
      bg: "bg-purple-100 dark:bg-purple-900/20",
      border: "border-purple-200 dark:border-purple-800",
    },
    {
      title: "Cotizaciones",
      value: stats.totalSubmissions,
      icon: <FaClipboardList className="text-orange-500 text-2xl" />,
      bg: "bg-orange-100 dark:bg-orange-900/20",
      border: "border-orange-200 dark:border-orange-800",
    },
  ];



  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Dashboard</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Resumen general de tu tienda
          </p>
        </div>
        <TestNotificationButton />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`p-6 rounded-2xl border ${card.border} bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${card.bg}`}>
                {card.icon}
              </div>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
              {card.title}
            </p>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">
              {card.value}
            </h3>
          </div>
        ))}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
            Órdenes Recientes
          </h2>
          <Link
            href="/admin/orders"
            className="text-primary hover:text-primary-dark font-medium text-sm flex items-center gap-1"
          >
            Ver todas <FaArrowRight />
          </Link>
        </div>
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {stats.recentOrders.length === 0 ? (
            <div className="p-8 text-center text-zinc-500">
              No hay órdenes recientes
            </div>
          ) : (
            stats.recentOrders.map((order: any) => (
              <div key={order.id} className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                    <FaBox className="text-zinc-400" />
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-white">
                      Orden #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-sm text-zinc-500">
                      {new Date(order.createdAt).toLocaleDateString("es-AR")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-zinc-900 dark:text-white">
                    ${(order.orderAmount || 0).toLocaleString("es-AR")}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${order.orderStatus === "entregado" ? "bg-green-100 text-green-700" :
                    order.orderStatus === "pendiente" ? "bg-yellow-100 text-yellow-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                    {order.orderStatus || "Pendiente"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
