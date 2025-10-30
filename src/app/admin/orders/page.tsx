import { adminDb } from "@/src/firebase/admin";
import { Order } from "@/src/types";
import Link from "next/link";

async function getAllOrders(): Promise<Order[]> {
  const ordersRef = adminDb.collection("orders").orderBy("createdAt", "desc");
  const snapshot = await ordersRef.get();
  if (snapshot.empty) return [];

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    const items = data.orderItems || data.cartItems || [];

    return {
      id: doc.id,
      ...data,
      orderItems: items,
      createdAt: data.createdAt.toDate().toISOString(),
    } as Order;
  });
}

const AdminOrdersPage = async () => {
  const orders = await getAllOrders();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Todas las Órdenes</h2>
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Fecha</th>
              <th className="p-4">Cliente</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="p-4 font-medium text-violet-500 hover:underline">
                  <Link href={`/admin/orders/${order.id}`}>
                    {order.id.slice(0, 8)}...
                  </Link>
                </td>
                <td className="p-4">
                  {new Date(order.createdAt).toLocaleDateString("es-AR")}
                </td>
                <td className="p-4">{order.shippingAddress.name}</td>
                <td className="p-4">{order.orderStatus}</td>
                <td className="p-4 text-right font-semibold">
                  ${order.orderAmount.toLocaleString("es-AR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
