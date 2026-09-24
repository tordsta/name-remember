import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import sql from "@/lib/pgConnect";

// Implements only the Stripe calls this app makes. Subscribing and cancelling
// take effect immediately and update the database the way the webhook would
// (see pages/api/stripe/webhook.ts), so no payment step is needed.

const PRODUCT_ID = "prod_mock_premium";
const PRICE_ID = "price_mock_premium";
const UNIT_AMOUNTS: Record<string, number> = { usd: 200, eur: 200, nok: 2000 };

const log = (...args: unknown[]) => console.log("[mock:stripe]", ...args);

// Invoices live in memory, so payment history resets when the server restarts.
const globalForMock = globalThis as unknown as {
  mockStripeInvoices?: Map<string, object[]>;
};
const invoices = (globalForMock.mockStripeInvoices ??= new Map());

const product = {
  id: PRODUCT_ID,
  object: "product",
  name: "Premium",
  description: "Demo subscription. Stripe is mocked, no payment is taken.",
  default_price: {
    id: PRICE_ID,
    object: "price",
    product: PRODUCT_ID,
    recurring: { interval: "month" },
    currency_options: Object.fromEntries(
      Object.entries(UNIT_AMOUNTS).map(([currency, unit_amount]) => [
        currency,
        { unit_amount },
      ])
    ),
  },
};

function addInvoice(customer: string, currency: string) {
  const id = `in_mock_${uuidv4()}`;
  const invoice = {
    id,
    object: "invoice",
    created: Math.floor(Date.now() / 1000),
    currency,
    amount_paid: UNIT_AMOUNTS[currency] ?? 0,
    status: "paid",
    lines: { data: [{ id: `il_${id}`, description: "1 × Premium (demo)" }] },
  };
  invoices.set(customer, [invoice, ...(invoices.get(customer) ?? [])]);
}

const mockStripe = {
  products: {
    async retrieve() {
      log("products.retrieve");
      return product;
    },
  },
  customers: {
    async create({ email }: { email: string }) {
      const id = `cus_mock_${uuidv4()}`;
      log("customers.create", email, id);
      return { id, email };
    },
    async retrieve(id: string) {
      log("customers.retrieve", id);
      return { id };
    },
  },
  subscriptions: {
    async create({
      customer,
      currency,
    }: {
      customer: string;
      currency: string;
    }) {
      const id = `sub_mock_${uuidv4()}`;
      log("subscriptions.create", id, "for", customer);
      await sql({
        query:
          "INSERT INTO stripe_subscriptions (subscription_id, customer_id, product_id, status) VALUES ($1, $2, $3, 'active')",
        values: [id, customer, PRODUCT_ID],
      });
      await sql({
        query: `UPDATE users SET subscription_plan = 'premium' WHERE stripe_customer_id = $1`,
        values: [customer],
      });
      addInvoice(customer, currency);
      return {
        id,
        latest_invoice: { payment_intent: { client_secret: null } },
      };
    },
    async cancel(id: string) {
      log("subscriptions.cancel", id);
      const { rows } = await sql({
        query:
          "DELETE FROM stripe_subscriptions WHERE subscription_id = $1 RETURNING customer_id",
        values: [id],
      });
      if (rows[0]) {
        await sql({
          query: `UPDATE users SET subscription_plan = 'free' WHERE stripe_customer_id = $1`,
          values: [rows[0].customer_id],
        });
      }
      return { id, status: "canceled" };
    },
  },
  invoices: {
    async list({ customer }: { customer: string }) {
      log("invoices.list", customer);
      return {
        object: "list",
        data: invoices.get(customer) ?? [],
        has_more: false,
      };
    },
  },
  webhooks: {
    constructEvent() {
      throw new Error(
        "[mock:stripe] webhooks are not used while Stripe is mocked"
      );
    },
  },
} as unknown as Stripe;

export default mockStripe;
