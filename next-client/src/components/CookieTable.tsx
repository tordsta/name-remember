export default function CookieTable({
  cookies,
}: {
  cookies: { name: string; description: string; duration: string }[];
}) {
  return (
    <table className="min-w-full table-auto shadow-md">
      <thead className="bg-gray-200">
        <tr>
          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">
            Cookie
          </th>
          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">
            Description
          </th>
          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">
            Duration
          </th>
        </tr>
      </thead>
      <tbody className="bg-white">
        {cookies.map((cookie, index) => (
          <tr
            key={cookie.name}
            className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}
          >
            <td className="border-b border-gray-200 px-4 py-2 text-sm text-gray-900">
              {cookie.name}
            </td>
            <td className="border-b border-gray-200 px-4 py-2 text-sm text-gray-900">
              {cookie.description}
            </td>
            <td className="border-b border-gray-200 px-4 py-2 text-sm text-gray-900">
              {cookie.duration}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
