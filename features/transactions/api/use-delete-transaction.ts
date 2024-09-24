import { InferRequestType, InferResponseType } from "hono"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { client } from "@/lib/hono"

type ReponseType = InferResponseType<
  (typeof client.api.transactions)[":id"]["$delete"]
>
// Custom hook to handle the deleting of a transaction by ID
export const useDeleteTransaction = (id?: string) => {
  const queryClient = useQueryClient()
  const mutation = useMutation<ReponseType, Error>({
    // The function to run when the mutation is triggered (deleting a transaction)
    mutationFn: async () => {
      const response = await client.api.transactions[":id"]["$delete"]({
        param: { id },
      })
      return await response.json()
    },
    onSuccess: () => {
      toast.success("Transaction Deleted")
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
      queryClient.invalidateQueries({ queryKey: ["transaction", { id }] })
      queryClient.invalidateQueries({ queryKey: ["summary"] })
    },
    onError: () => {
      toast.error("Failed to delete transaction")
    },
  })
  return mutation
}
