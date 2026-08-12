import { adminDb } from "@/firebase/admin";
import Link from "next/link";
import TestNotificationButton from "./TestNotificationButton";
import SystemHealth from "@/components/Admin/SystemHealth";
import AnalyticsDashboard from "@/components/Admin/AnalyticsDashboard";
import AlertsPanel from "@/components/Admin/AlertsPanel";
import {
  FaShoppingBag,
  FaMoneyBillWave,
  FaBox,
  FaArrowRight,
  FaCalendarAlt,
  FaExclamationTriangle,
} from "react-icons/fa";

export const dynamic = "force-dynamic";

async function getDashboardStats() {
  if (!adminDb) return null;

  try {
    const [ordersSnap, usersSnap, productsSnap, submissionsSnap] =
      await Promise.all([
        adminDb.collection("orders").orderBy("createdAt", "desc").get(),
        adminDb.collection("users").get(),
        adminDb.collection("products").get(),
        adminDb.collection("contact_submissions").get(),
      ]);

    const totalOrders = ordersSnap.size;
    const totalUsers = usersSnap.size;
    const totalProducts = productsSnap.size;
    const totalSubmissions = submissionsSnap.size;

    // Calcular estadísticas de ingresos
    const ordersData = ordersSnap.docs.map((doc) => doc.data());
    const totalRevenue = ordersData.reduce(
      (acc, data) => acc + (data.orderAmount || 0),
      0
    );
    const depositRevenue = ordersData.reduce(
      (acc, data) => acc + (data.depositAmount || 0),
      0
    );

    // Estadísticas por estado de orden
    const ordersByStatus = ordersData.reduce(
      (acc, order) => {
        const status = order.orderStatus || "pending";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Estadísticas por estado de pago
    const ordersByPaymentStatus = ordersData.reduce(
      (acc, order) => {
        const status = order.paymentStatus || "pending";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Ingresos del mes actual
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyRevenue = ordersData
      .filter((order) => order.createdAt?.toDate() >= startOfMonth)
      .reduce((acc, data) => acc + (data.orderAmount || 0), 0);

    // Órdenes pendientes de pago
    const pendingPayments = ordersData.filter(
      (order) =>
        order.paymentStatus === "pending" ||
        (order.remainingAmount && order.remainingAmount > 0)
    ).length;

    const recentOrders = ordersSnap.docs.slice(0, 5).map((doc) => ({
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
      depositRevenue,
      monthlyRevenue,
      ordersByStatus,
      ordersByPaymentStatus,
      pendingPayments,
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
        <h2 className="text-xl font-bold text-red-500">
          Error cargando el dashboard
        </h2>
        <p className="text-gray-500">
          Verifique la conexión con Firebase Admin SDK.
        </p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Ingresos Totales",
      value: `$${stats.totalRevenue.toLocaleString("es-AR")}`,
      subtitle: `$${stats.depositRevenue.toLocaleString("es-AR")} en señas`,
      icon: <FaMoneyBillWave className="text-green-500 text-2xl" />,
      bg: "bg-green-100 dark:bg-green-900/20",
      border: "border-green-200 dark:border-green-800",
    },
    {
      title: "Ingresos del Mes",
      value: `$${stats.monthlyRevenue.toLocaleString("es-AR")}`,
      subtitle: `Mes actual`,
      icon: <FaCalendarAlt className="text-blue-500 text-2xl" />,
      bg: "bg-blue-100 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-800",
    },
    {
      title: "Pagos Pendientes",
      value: stats.pendingPayments,
      subtitle: `Requieren atención`,
      icon: <FaExclamationTriangle className="text-orange-500 text-2xl" />,
      bg: "bg-orange-100 dark:bg-orange-900/20",
      border: "border-orange-200 dark:border-orange-800",
    },
    {
      title: "Órdenes",
      value: stats.totalOrders,
      subtitle: `${stats.ordersByStatus.confirmed || 0} confirmadas`,
      icon: <FaShoppingBag className="text-purple-500 text-2xl" />,
      bg: "bg-purple-100 dark:bg-purple-900/20",
      border: "border-purple-200 dark:border-purple-800",
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Resumen general de tu tienda
          </p>
        </div>
        <div className="flex gap-3">
          <SystemHealth />
          <TestNotificationButton />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`p-6 rounded-2xl border ${card.border} bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${card.bg}`}>{card.icon}</div>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
              {card.title}
            </p>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">
              {card.value}
            </h3>
            {card.subtitle && (
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                {card.subtitle}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Alertas del Sistema */}
      <AlertsPanel />

      {/* Analytics Dashboard */}
      <AnalyticsDashboard />

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by Status */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">
            Órdenes por Estado
          </h2>
          <div className="space-y-4">
            {Object.entries(stats.ordersByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      status === "confirmed"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                        : status === "processing"
                          ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400"
                          : status === "shipped"
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
                            : status === "delivered"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                              : status === "cancelled"
                                ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                                : status === "refunded"
                                  ? "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                    }`}
                  >
                    {status === "confirmed"
                      ? "Confirmadas"
                      : status === "processing"
                        ? "Procesando"
                        : status === "shipped"
                          ? "Enviadas"
                          : status === "delivered"
                            ? "Entregadas"
                            : status === "cancelled"
                              ? "Canceladas"
                              : status === "refunded"
                                ? "Reembolsadas"
                                : "Pendientes"}
                  </span>
                </div>
                <span className="font-bold text-zinc-900 dark:text-white">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Status Breakdown */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">
            Estados de Pago
          </h2>
          <div className="space-y-4">
            {Object.entries(stats.ordersByPaymentStatus).map(
              ([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        status === "approved"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : status === "pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                            : status === "rejected"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                              : status === "cancelled"
                                ? "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                                : status === "refunded"
                                  ? "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
                                  : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                      }`}
                    >
                      {status === "approved"
                        ? "Aprobados"
                        : status === "pending"
                          ? "Pendientes"
                          : status === "rejected"
                            ? "Rechazados"
                            : status === "cancelled"
                              ? "Cancelados"
                              : status === "refunded"
                                ? "Reembolsados"
                                : status}
                    </span>
                  </div>
                  <span className="font-bold text-zinc-900 dark:text-white">
                    {count}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
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
            stats.recentOrders.map((order: { id: string; createdAt: string; orderAmount?: number; orderStatus?: string }) => (
              <div
                key={order.id}
                className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors flex items-center justify-between"
              >
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
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      order.orderStatus === "entregado"
                        ? "bg-green-100 text-green-700"
                        : order.orderStatus === "pendiente"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                    }`}
                  >
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
