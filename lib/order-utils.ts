export type OrderPaymentMethod = "mm" | "bank" | "bond";

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  href: string;
  qty: number;
};

export type OrderCustomer = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postcode?: string;
};

export type OrderMetadata = {
  customer: OrderCustomer;
  items: OrderItem[];
  paymentMethod: OrderPaymentMethod;
  subtotal: number;
  fee: number;
  total: number;
  notes: string;
  adminNotes?: string[];
};

export type OrderRecord = {
  id: string;
  orderNumber: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  notes: string | null;
  status: string;
  source: string;
  createdAt: string;
  vehicle: {
    make: string;
    model: string;
    year: number;
    price: number;
  } | null;
  metadata: OrderMetadata | null;
  searchText: string;
};

const ORDER_METADATA_PREFIX = "__ORDER_V1__:";

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function asNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function isOrderPaymentMethod(value: unknown): value is OrderPaymentMethod {
  return value === "mm" || value === "bank" || value === "bond";
}

export function formatOrderNumber(id: string | number) {
  return `CB-${String(id).padStart(5, "0")}`;
}

export function formatOrderCurrency(value: number) {
  return `UGX ${value.toLocaleString("en-US")}`;
}

export function getPaymentMethodLabel(method: OrderPaymentMethod) {
  if (method === "mm") return "Mobile Money";
  if (method === "bank") return "Bank Transfer";
  return "Pay at Bond";
}

export function getPaymentStatusLabel(method: OrderPaymentMethod) {
  if (method === "mm") return "Awaiting Mobile Money";
  if (method === "bank") return "Awaiting Bank Transfer";
  return "Reserved for Bond Visit";
}

export function serializeOrderMetadata(metadata: OrderMetadata) {
  return `${ORDER_METADATA_PREFIX}${JSON.stringify(metadata)}`;
}

export function parseOrderMetadata(value: string | null | undefined) {
  if (!value || !value.startsWith(ORDER_METADATA_PREFIX)) return null;

  try {
    const parsed = JSON.parse(value.slice(ORDER_METADATA_PREFIX.length)) as {
      customer?: Record<string, unknown>;
      items?: Array<Record<string, unknown>>;
      paymentMethod?: unknown;
      subtotal?: unknown;
      fee?: unknown;
      total?: unknown;
      notes?: unknown;
      adminNotes?: unknown;
    };

    if (!parsed.customer || !Array.isArray(parsed.items) || !isOrderPaymentMethod(parsed.paymentMethod)) {
      return null;
    }

    return {
      customer: {
        name: asString(parsed.customer.name),
        email: asString(parsed.customer.email),
        phone: asString(parsed.customer.phone),
        address: asString(parsed.customer.address),
        city: asString(parsed.customer.city),
        postcode: asString(parsed.customer.postcode),
      },
      items: parsed.items.map((item) => ({
        id: asString(item.id),
        name: asString(item.name),
        price: asNumber(item.price),
        image: asString(item.image),
        href: asString(item.href),
        qty: Math.max(1, Math.floor(asNumber(item.qty))),
      })),
      paymentMethod: parsed.paymentMethod,
      subtotal: asNumber(parsed.subtotal),
      fee: asNumber(parsed.fee),
      total: asNumber(parsed.total),
      notes: asString(parsed.notes),
      adminNotes: Array.isArray(parsed.adminNotes)
        ? parsed.adminNotes.filter((item): item is string => typeof item === "string")
        : [],
    } satisfies OrderMetadata;
  } catch {
    return null;
  }
}

export function buildOrderMessage(metadata: OrderMetadata) {
  const itemList = metadata.items
    .map(
      (item) =>
        `- ${item.name} (Qty: ${item.qty}) @ ${formatOrderCurrency(item.price)}`
    )
    .join("\n");

  return `
NEW ORDER SUBMISSION
-------------------
Payment Method: ${getPaymentMethodLabel(metadata.paymentMethod)}
Subtotal: ${formatOrderCurrency(metadata.subtotal)}
Service Fee: ${formatOrderCurrency(metadata.fee)}
Total: ${formatOrderCurrency(metadata.total)}

Items:
${itemList}

Instructions:
${metadata.notes || "None provided"}
  `.trim();
}

export function buildOrderSearchText(order: {
  id: string;
  name: string;
  email: string;
  metadata: OrderMetadata | null;
}) {
  const itemNames = order.metadata?.items.map((item) => item.name).join(" ") ?? "";
  return [formatOrderNumber(order.id), order.name, order.email, itemNames].join(" ");
}

export function parseNumericEntityId(value: string) {
  if (/^\d+$/.test(value)) return Number(value);
  const match = value.match(/-(\d+)$/);
  return match ? Number(match[1]) : null;
}
