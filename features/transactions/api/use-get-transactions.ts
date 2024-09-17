import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { client } from "@/lib/hono"

// Custom hook to fetch all transaction data
export const useGetTransactions = () => {
  const params = useSearchParams()
  const from = params.get("from") || "" // 'from' query parameter or an empty string if not present
  const to = params.get("to") || "" // 'to' query parameter or an empty string if not present
  const accountId = params.get("accountId") || "" // 'accountId' query parameter or an empty string if not present

  const query = useQuery({
    queryKey: ["transactions", { from, to, accountId }], // Unique identifier for the query, can be used for caching and refetching
    queryFn: async () => {
      const response = await client.api.transactions.$get({
        query: {
          from,
          to,
          accountId,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch Transactions")
      }

      // Parse the JSON response and return the 'data' field
      const { data } = await response.json()
      return data
    },
  })

  // Return the query object which contains status, data, and other query states
  return query
}
