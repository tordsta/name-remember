import {
  Page,
  usePaymentHistory,
} from "@/lib/reactQuery/clientHooks/usePaymentHistory";
import { Fragment, useState } from "react";
import Stripe from "stripe";
import LoadingAnimation from "./navigation/LoadingAnimation";

export default function PaymentHistory() {
  const [page, setPage] = useState<Page>({
    limit: 10,
    starting_after: undefined,
    ending_before: undefined,
  });
  const [direction, setDirection] = useState<"next" | "prev" | null>(null);
  const { data, isLoading, isError } = usePaymentHistory({ page });
  const paymentHistory = data?.data;
  const hasMore = data?.has_more;
  const styleHeader =
    "px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase";
  const styleRows = "border-b border-gray-200 px-4 py-2 text-sm text-gray-900";

  const toTimeString = (unixTime: number) => {
    const date = new Date(unixTime * 1000);
    return date.toLocaleDateString();
  };

  return (
    <div>
      <h1 className="text-xl m-2 text-center md:text-left">Invoices</h1>
      {isLoading && <LoadingAnimation size="small" />}
      {isError && <p>There was an error loading your invoices</p>}
      {!data && !isLoading && <p>No invoices found</p>}
      {data?.data && (
        <table className="min-w-full table-auto shadow-md">
          <thead className="bg-gray-200">
            <tr>
              <th className={styleHeader}>Date</th>
              <th className={styleHeader}>Products</th>
              <th className={styleHeader}>Amount paid</th>
              <th className={styleHeader}>Status</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {paymentHistory &&
              paymentHistory.map((invoice: Stripe.Invoice, index) => (
                <tr
                  key={invoice.id}
                  className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}
                >
                  <td className={styleRows}>{toTimeString(invoice.created)}</td>
                  <td className={styleRows}>
                    {invoice.lines.data.map((line, index) => (
                      <Fragment key={line.id + invoice.id}>
                        {line.description}
                        {index !== invoice.lines.data.length - 1 && ", "}
                      </Fragment>
                    ))}
                  </td>
                  <td className={styleRows + " uppercase"}>
                    {invoice.currency} {(invoice.amount_paid / 100).toFixed(2)}
                  </td>
                  <td className={styleRows + " uppercase"}>{invoice.status}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
      {(hasMore || direction !== null) && (
        <>
          <button
            className={
              "underline m-2 cursor-pointer" +
              (!hasMore && direction !== ("next" || null) ? " opacity-50" : "")
            }
            disabled={!hasMore && direction !== ("next" || null)}
            onClick={() => {
              setPage({
                limit: 1,
                starting_after: undefined,
                ending_before: paymentHistory?.[0].id,
              });
              setDirection("prev");
            }}
          >
            &lt; Prev
          </button>
          <button
            className={
              "underline m-2 cursor-pointer" +
              (!hasMore && direction !== "prev" ? " opacity-50" : "")
            }
            disabled={!hasMore && direction !== "prev"}
            onClick={() => {
              setPage({
                limit: 1,
                starting_after: paymentHistory?.[paymentHistory.length - 1].id,
                ending_before: undefined,
              });
              setDirection("next");
            }}
          >
            Next &gt;
          </button>
        </>
      )}
    </div>
  );
}
