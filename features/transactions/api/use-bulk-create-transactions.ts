import { toast } from "sonner"
import { InferRequestType, InferResponseType } from "hono"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { client } from "@/lib/hono"

type ResponseType = InferResponseType<
  (typeof client.api.transactions)["bulk-create"]["$post"]
>
type RequestType = InferRequestType<
  (typeof client.api.transactions)["bulk-create"]["$post"]
>["json"]

// Custom hook to handle the bulk deletion of transactions
export const useBulkCreateTransactions = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      // The function to run when the mutation is triggered (bulk deleting transactions)
      const response = await client.api.transactions["bulk-create"]["$post"]({
        json,
      })
      return await response.json()
    },
    onSuccess: () => {
      toast.success("Tranasctions created")
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
      // TODO: Also invalidate summary
    },
    onError: () => {
      toast.error("Failed to create transactions")
    },
  })

  return mutation
}
