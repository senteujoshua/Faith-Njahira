"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface InstallmentSub {
  id: string;
  totalInstallments: number;
  paidInstallments: number;
  status: string;
}

interface OrderDetail {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  productType: string;
  productName: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentType: string;
  status: string;
  paymentId: string | null;
  stripeSubscriptionId: string | null;
  couponCode: string | null;
  discountAmount: number | null;
  refundedAt: string | null;
  refundStatus: string | null;
  createdAt: string;
  installmentSubscription: InstallmentSub | null;
  registration: {
    id: string;
    seatCount: number;
    eventId: string;
  } | null;
}

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [refunding, setRefunding] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchOrder = useCallback(async () => {
    const res = await fetch(`/api/admin/orders/${params.id}`);
    if (!res.ok) {
      setError("Order not found");
      setLoading(false);
      return;
    }
    const data: OrderDetail = await res.json();
    setOrder(data);
    setLoading(false);
  }, [params.id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleRefund = async () => {
    if (!order) return;
    if (
      !confirm(
        `Are you sure you want to refund ${order.currency} ${order.amount.toFixed(2)} for "${order.productName}"? This action cannot be undone.`
      )
    )
      return;

    setRefunding(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/admin/orders/${order.id}/refund`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Refund failed");
      } else {
        setSuccess("Refund processed successfully.");
        fetchOrder();
      }
    } catch {
      setError("Network error — refund may not have been processed.");
    } finally {
      setRefunding(false);
    }
  };

  if (loading) {
    return (
      <div className="text-warm-gray font-body text-sm">Loading order...</div>
    );
  }

  if (!order) {
    return (
      <div>
        <p className="text-red-600 font-body text-sm">{error || "Order not found."}</p>
        <Link href="/admin/orders" className="text-teal text-sm font-body hover:underline mt-4 inline-block">
          ← Back to Orders
        </Link>
      </div>
    );
  }

  const statusColor =
    order.status === "PAID"
      ? "bg-green-100 text-green-700"
      : order.status === "REFUNDED"
      ? "bg-purple-100 text-purple-700"
      : order.status === "FAILED"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-warm-gray text-sm font-body hover:text-teal mb-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Orders
          </button>
          <h1 className="font-heading text-2xl font-bold text-teal">Order Detail</h1>
          <p className="font-body text-xs text-warm-gray mt-1 font-mono">{order.id}</p>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-sm font-body font-medium ${statusColor}`}>
          {order.status}
        </span>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-body text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 font-body text-sm">
          {success}
        </div>
      )}

      <div className="space-y-6">
        {/* Customer */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-heading text-base font-semibold text-slate mb-4">Customer</h2>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-xs font-body text-warm-gray uppercase tracking-wide">Name</dt>
              <dd className="font-body text-sm text-slate mt-1">{order.name}</dd>
            </div>
            <div>
              <dt className="text-xs font-body text-warm-gray uppercase tracking-wide">Email</dt>
              <dd className="font-body text-sm text-slate mt-1">{order.email}</dd>
            </div>
            {order.phone && (
              <div>
                <dt className="text-xs font-body text-warm-gray uppercase tracking-wide">Phone</dt>
                <dd className="font-body text-sm text-slate mt-1">{order.phone}</dd>
              </div>
            )}
            <div>
              <dt className="text-xs font-body text-warm-gray uppercase tracking-wide">Date</dt>
              <dd className="font-body text-sm text-slate mt-1">
                {new Date(order.createdAt).toLocaleString()}
              </dd>
            </div>
          </dl>
        </div>

        {/* Product */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-heading text-base font-semibold text-slate mb-4">Product</h2>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-xs font-body text-warm-gray uppercase tracking-wide">Product</dt>
              <dd className="font-body text-sm text-slate mt-1">{order.productName}</dd>
            </div>
            <div>
              <dt className="text-xs font-body text-warm-gray uppercase tracking-wide">Type</dt>
              <dd className="font-body text-sm text-slate mt-1">{order.productType}</dd>
            </div>
            <div>
              <dt className="text-xs font-body text-warm-gray uppercase tracking-wide">Amount</dt>
              <dd className="font-body text-sm font-semibold text-slate mt-1">
                {order.currency} {order.amount.toFixed(2)}
              </dd>
            </div>
            {order.discountAmount && order.discountAmount > 0 && (
              <div>
                <dt className="text-xs font-body text-warm-gray uppercase tracking-wide">Discount</dt>
                <dd className="font-body text-sm text-green-600 mt-1">
                  -{order.currency} {order.discountAmount.toFixed(2)}
                  {order.couponCode && ` (${order.couponCode})`}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Payment */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-heading text-base font-semibold text-slate mb-4">Payment</h2>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-xs font-body text-warm-gray uppercase tracking-wide">Method</dt>
              <dd className="font-body text-sm text-slate mt-1">{order.paymentMethod}</dd>
            </div>
            <div>
              <dt className="text-xs font-body text-warm-gray uppercase tracking-wide">Type</dt>
              <dd className="font-body text-sm text-slate mt-1">{order.paymentType}</dd>
            </div>
            {order.paymentId && (
              <div className="col-span-2">
                <dt className="text-xs font-body text-warm-gray uppercase tracking-wide">Payment ID</dt>
                <dd className="font-body text-xs text-slate mt-1 font-mono break-all">{order.paymentId}</dd>
              </div>
            )}
            {order.stripeSubscriptionId && (
              <div className="col-span-2">
                <dt className="text-xs font-body text-warm-gray uppercase tracking-wide">Stripe Subscription</dt>
                <dd className="font-body text-xs text-slate mt-1 font-mono break-all">{order.stripeSubscriptionId}</dd>
              </div>
            )}
            {order.refundedAt && (
              <div>
                <dt className="text-xs font-body text-warm-gray uppercase tracking-wide">Refunded At</dt>
                <dd className="font-body text-sm text-purple-600 mt-1">
                  {new Date(order.refundedAt).toLocaleString()}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Installments */}
        {order.installmentSubscription && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-heading text-base font-semibold text-slate mb-4">Installment Plan</h2>
            <dl className="grid grid-cols-3 gap-4">
              <div>
                <dt className="text-xs font-body text-warm-gray uppercase tracking-wide">Paid</dt>
                <dd className="font-body text-sm text-slate mt-1">
                  {order.installmentSubscription.paidInstallments} / {order.installmentSubscription.totalInstallments}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-body text-warm-gray uppercase tracking-wide">Status</dt>
                <dd className="font-body text-sm text-slate mt-1">{order.installmentSubscription.status}</dd>
              </div>
            </dl>
          </div>
        )}

        {/* Registration */}
        {order.registration && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-heading text-base font-semibold text-slate mb-4">Event Registration</h2>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-xs font-body text-warm-gray uppercase tracking-wide">Registration ID</dt>
                <dd className="font-body text-xs font-mono text-slate mt-1">{order.registration.id}</dd>
              </div>
              <div>
                <dt className="text-xs font-body text-warm-gray uppercase tracking-wide">Seats</dt>
                <dd className="font-body text-sm text-slate mt-1">{order.registration.seatCount}</dd>
              </div>
            </dl>
          </div>
        )}

        {/* Refund Action */}
        {order.status === "PAID" && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h2 className="font-heading text-base font-semibold text-red-700 mb-2">Refund Order</h2>
            <p className="font-body text-sm text-red-600 mb-4">
              This will issue a full refund via {order.paymentMethod}.
              {order.paymentMethod === "MPESA" && (
                <span className="block mt-1 font-medium">
                  Note: M-Pesa refunds require manual processing in the IntaSend dashboard. The order status will be updated automatically.
                </span>
              )}
            </p>
            <button
              onClick={handleRefund}
              disabled={refunding}
              className="px-5 py-2.5 bg-red-600 text-white font-body font-medium text-sm rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {refunding ? "Processing Refund..." : `Refund ${order.currency} ${order.amount.toFixed(2)}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
