import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { client } from "@/lib/hono"
import { convertAmountFromMiliunits } from "@/lib/utils"

// Custom hook to fetch all transaction data
export const useGetSummary = () => {
  const params = useSearchParams()
  const from = params.get("from") || "" // 'from' query parameter or an empty string if not present
  const to = params.get("to") || "" // 'to' query parameter or an empty string if not present
  const accountId = params.get("accountId") || "" // 'accountId' query parameter or an empty string if not present

  const query = useQuery({
    queryKey: ["summary", { from, to, accountId }], // Unique identifier for the query, can be used for caching and refetching
    queryFn: async () => {
      const response = await client.api.summary.$get({
        query: {
          from,
          to,
          accountId,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch Tsummary")
      }

      // Parse the JSON response and return the 'data' field
      const { data } = await response.json()
      return {
        ...data,
        incomeAmount: convertAmountFromMiliunits(data.incomeAmount),
        expensesAmount: convertAmountFromMiliunits(data.expensesAmount),
        remainingAmount: convertAmountFromMiliunits(data.remainingAmount),
        categories: data.categories.map((category) => ({
          ...category,
          value: convertAmountFromMiliunits(category.value),
        })),
        days: data.days.map((day) => ({
          ...day,
          income: convertAmountFromMiliunits(day.income),
          expenses: convertAmountFromMiliunits(day.expenses),
        })),
      }
    },
  })

  // Return the query object which contains status, data, and other query states
  return query
}
