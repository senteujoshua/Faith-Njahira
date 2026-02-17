import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  const [orderCount, bookCount, coachingCount, recentOrders] =
    await Promise.all([
      prisma.order.count(),
      prisma.bookResource.count(),
      prisma.coachingSession.count(),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  const paidOrders = await prisma.order.count({
    where: { status: "PAID" },
  });

  const stats = [
    {
      label: "Total Orders",
      value: orderCount,
      href: "/admin/orders",
      color: "bg-teal",
    },
    {
      label: "Paid Orders",
      value: paidOrders,
      href: "/admin/orders",
      color: "bg-green-600",
    },
    {
      label: "Books",
      value: bookCount,
      href: "/admin/books",
      color: "bg-gold",
    },
    {
      label: "Coaching Sessions",
      value: coachingCount,
      href: "/admin/coaching",
      color: "bg-slate",
    },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-teal mb-8">
        Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <p className="font-body text-sm text-warm-gray mb-1">
              {stat.label}
            </p>
            <p className="font-heading text-3xl font-bold text-teal">
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-teal">
            Recent Orders
          </h2>
          <Link
            href="/admin/orders"
            className="text-sm font-body text-gold hover:text-gold-dark"
          >
            View All
          </Link>
        </div>
        {recentOrders.length === 0 ? (
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
                    Amount
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
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-body text-sm text-slate">
                      <div>{order.name}</div>
                      <div className="text-warm-gray text-xs">
                        {order.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-body text-sm text-slate">
                      {order.productName}
                    </td>
                    <td className="px-6 py-4 font-body text-sm text-slate">
                      {order.currency} {order.amount.toFixed(2)}
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
                    <td className="px-6 py-4 font-body text-sm text-warm-gray">
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
