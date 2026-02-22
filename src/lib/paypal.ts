/**
 * PayPal Orders API v2 — fetch-based, no SDK.
 */

const PAYPAL_MODE = process.env.PAYPAL_MODE || "sandbox";
const PAYPAL_BASE =
  PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID!;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PayPal auth failed: ${err}`);
  }

  const data = await res.json();
  return data.access_token as string;
}

export interface CreatePayPalOrderParams {
  amount: number;
  currency: string; // "USD" | "GBP"
  description: string;
  orderId: string; // our internal order ID for metadata
  returnUrl: string;
  cancelUrl: string;
}

export async function createPayPalOrder(params: CreatePayPalOrderParams) {
  const token = await getAccessToken();

  const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: params.orderId,
          description: params.description,
          amount: {
            currency_code: params.currency.toUpperCase(),
            value: params.amount.toFixed(2),
          },
        },
      ],
      payment_source: {
        paypal: {
          experience_context: {
            return_url: params.returnUrl,
            cancel_url: params.cancelUrl,
            user_action: "PAY_NOW",
            brand_name: "Faith Njahira",
          },
        },
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PayPal create order failed: ${err}`);
  }

  const data = await res.json();
  const approvalLink = data.links?.find((l: { rel: string }) => l.rel === "payer-action");

  return {
    id: data.id as string,
    approvalUrl: approvalLink?.href as string,
  };
}

export async function capturePayPalOrder(paypalOrderId: string) {
  const token = await getAccessToken();

  const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PayPal capture failed: ${err}`);
  }

  return res.json();
}

export async function verifyPayPalWebhook(params: {
  headers: Record<string, string>;
  rawBody: string;
  webhookId: string;
}): Promise<boolean> {
  const token = await getAccessToken();

  const transmissionId = params.headers["paypal-transmission-id"];
  const transmissionTime = params.headers["paypal-transmission-time"];
  const certUrl = params.headers["paypal-cert-url"];
  const authAlgo = params.headers["paypal-auth-algo"];
  const transmissionSig = params.headers["paypal-transmission-sig"];

  const res = await fetch(`${PAYPAL_BASE}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      transmission_id: transmissionId,
      transmission_time: transmissionTime,
      cert_url: certUrl,
      auth_algo: authAlgo,
      transmission_sig: transmissionSig,
      webhook_id: params.webhookId,
      webhook_event: JSON.parse(params.rawBody),
    }),
  });

  if (!res.ok) return false;

  const data = await res.json();
  return data.verification_status === "SUCCESS";
}

export async function refundPayPalCapture(captureId: string, amount?: number) {
  const token = await getAccessToken();

  const body = amount
    ? JSON.stringify({ amount: { value: amount.toFixed(2), currency_code: "USD" } })
    : undefined;

  const res = await fetch(`${PAYPAL_BASE}/v2/payments/captures/${captureId}/refund`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PayPal refund failed: ${err}`);
  }

  return res.json();
}
