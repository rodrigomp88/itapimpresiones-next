import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Order } from "@/src/types";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { adminDb } from "@/src/firebase/admin";

async function getUserOrders(userId: string): Promise<Order[]> {
  const ordersRef = adminDb.collection("orders");
  const q = ordersRef
    .where("userID", "==", userId)
    .orderBy("createdAt", "desc");
  const querySnapshot = await q.get();

  if (querySnapshot.empty) {
    return [];
  }

  const orders = querySnapshot.docs.map((doc) => {
    const data = doc.data();

    const items = data.orderItems || data.cartItems || [];

    return {
      id: doc.id,
      ...data,
      orderItems: items,
      createdAt: data.createdAt.toDate().toISOString(),
    } as Order;
  });

  return orders;
}

const OrdersPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const orders = await getUserOrders(session.user.id);

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6">Mis Órdenes</h2>
      {orders.length === 0 ? (
        <p>Aún no has realizado ninguna orden.</p>
      ) : (
        <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="p-4">ID de Orden</th>
                <th className="p-4">Fecha</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-gray-200 dark:border-gray-700"
                >
                  <td className="p-4 font-medium text-violet-500 hover:underline">
                    <Link href={`/orders/${order.id}`}>
                      {order.id.slice(0, 8)}...
                    </Link>
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">
                    {new Date(order.createdAt).toLocaleDateString("es-AR")}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="p-4 text-right font-semibold">
                    ${order.orderAmount.toLocaleString("es-AR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
