import { InferRequestType, InferResponseType } from "hono"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { client } from "@/lib/hono"

// Define the response type for the PATCH request to update a transaction
type ReponseType = InferResponseType<
  (typeof client.api.transactions)[":id"]["$patch"]
>

// Define the request type (payload) for the PATCH request to update a transaction
type RequestType = InferRequestType<
  (typeof client.api.transactions)[":id"]["$patch"]
>["json"]

// Custom hook to handle the editing of a transaction by ID
export const useEditTransaction = (id?: string) => {
  const queryClient = useQueryClient()
  const mutation = useMutation<ReponseType, Error, RequestType>({
    // The function to run when the mutation is triggered (updating a transaction)
    mutationFn: async (json) => {
      const response = await client.api.transactions[":id"]["$patch"]({
        param: { id },
        json,
      })
      return await response.json()
    },
    onSuccess: () => {
      toast.success("Transaction Updated")
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
      queryClient.invalidateQueries({ queryKey: ["transaction", { id }] })
      queryClient.invalidateQueries({ queryKey: ["summary"] })
    },
    onError: () => {
      toast.error("Failed to update transaction")
    },
  })
  return mutation
}
