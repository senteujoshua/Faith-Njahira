import { prisma } from "@/lib/prisma";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-teal mb-8">
        Orders
      </h1>

      <div className="bg-white rounded-xl border border-gray-200">
        {orders.length === 0 ? (
          <div className="px-6 py-12 text-center text-warm-gray font-body text-sm">
            No orders yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-body font-semibold text-warm-gray uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-body text-sm font-medium text-slate">
                        {order.name}
                      </div>
                      <div className="font-body text-xs text-warm-gray">
                        {order.email}
                      </div>
                      {order.phone && (
                        <div className="font-body text-xs text-warm-gray">
                          {order.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-body text-sm text-slate">
                      {order.productName}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-body font-medium bg-gray-100 text-gray-600">
                        {order.productType}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-body text-sm text-slate">
                      {order.currency} {order.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 font-body text-sm text-warm-gray">
                      {order.paymentMethod}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-body font-medium ${
                          order.status === "PAID"
                            ? "bg-green-100 text-green-700"
                            : order.status === "FAILED"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-body text-sm text-warm-gray whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
