import { env } from "@/env";
import { type CaptureMethod } from "@/db/schema";

const CHECKOUT_LINKS_PATH = "/invoices/public/checkout/links";
const PAYMENT_CHECK_PATH = "/invoices/public/checkout/payment_check";
const REQUEST_TIMEOUT_MS = 10000;

interface InfinitePayCheckoutItemInput {
  quantity: number;
  price: number;
  description: string;
}

interface CreateInfinitePayCheckoutInput {
  orderNsu: string;
  customerName: string;
  customerEmail: string;
  items: InfinitePayCheckoutItemInput[];
}

interface CreateInfinitePayCheckoutResponse {
  url: string;
}

interface CheckInfinitePayPaymentInput {
  orderNsu: string;
  transactionNsu: string;
  invoiceSlug: string;
}

export interface InfinitePayPaymentCheckResponse {
  success: boolean;
  paid: boolean;
  amount: number;
  paid_amount: number;
  installments: number;
  capture_method: CaptureMethod;
}

async function postJson<TResponse>(
  path: string,
  payload: Record<string, unknown>
): Promise<TResponse> {
  const response = await fetch(`${env.INFINITEPAY_API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  const responseText = await response.text();
  const parsedBody =
    responseText.length > 0 ? (JSON.parse(responseText) as Record<string, unknown>) : {};

  if (!response.ok) {
    throw new Error(
      `InfinitePay request failed with status ${response.status}: ${JSON.stringify(parsedBody)}`
    );
  }

  return parsedBody as TResponse;
}

export async function createInfinitePayCheckoutLink({
  orderNsu,
  customerName,
  customerEmail,
  items,
}: CreateInfinitePayCheckoutInput): Promise<CreateInfinitePayCheckoutResponse> {
  return postJson<CreateInfinitePayCheckoutResponse>(CHECKOUT_LINKS_PATH, {
    handle: env.INFINITEPAY_HANDLE,
    order_nsu: orderNsu,
    redirect_url: env.INFINITEPAY_CHECKOUT_REDIRECT_URL,
    webhook_url: env.INFINITEPAY_CHECKOUT_WEBHOOK_URL,
    customer: {
      name: customerName,
      email: customerEmail,
    },
    items,
  });
}

export async function checkInfinitePayPayment({
  orderNsu,
  transactionNsu,
  invoiceSlug,
}: CheckInfinitePayPaymentInput): Promise<InfinitePayPaymentCheckResponse> {
  return postJson<InfinitePayPaymentCheckResponse>(PAYMENT_CHECK_PATH, {
    handle: env.INFINITEPAY_HANDLE,
    order_nsu: orderNsu,
    transaction_nsu: transactionNsu,
    slug: invoiceSlug,
  });
}
