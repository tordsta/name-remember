import { UseQueryResult, useQuery } from "react-query";
import Stripe from "stripe";

export type Page = {
  starting_after: string | undefined;
  ending_before: string | undefined;
  limit: number;
};

const fetchPaymentHistory = async ({
  page,
}: {
  page: Page;
}): Promise<Stripe.ApiList<Stripe.Invoice> | undefined> => {
  const response = await (
    await fetch("/api/stripe/getPaymentHistory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        starting_after: page.starting_after,
        ending_before: page.ending_before,
        limit: page.limit,
      }),
    })
  ).json();
  return response;
};

const usePaymentHistory = ({
  page,
}: {
  page: Page;
}): UseQueryResult<Stripe.ApiList<Stripe.Invoice> | undefined> => {
  return useQuery(
    ["PaymentHistory", page],
    async () => fetchPaymentHistory({ page }),
    {
      staleTime: 1000 * 60 * 60 * 24,
      keepPreviousData: true,
    }
  );
};

export { usePaymentHistory, fetchPaymentHistory };
