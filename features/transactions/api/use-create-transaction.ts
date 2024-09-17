import { InferRequestType, InferResponseType } from "hono"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { client } from "@/lib/hono"

type ReponseType = InferResponseType<typeof client.api.transactions.$post>
type RequestType = InferRequestType<typeof client.api.transactions.$post>["json"]

// Custom hook to handle the creation of transaction
export const useCreateTransaction = () => {
  const queryClient = useQueryClient()
  const mutation = useMutation<ReponseType, Error, RequestType>({
    // The function to run when the mutation is triggered (creating a transaction)
    mutationFn: async (json) => {
      const response = await client.api.transactions.$post({ json })
      return await response.json()
    },
    onSuccess: () => {
      toast.success("Transaction Created")
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
    },
    onError: () => {
      toast.error("Failed to create transaction")
    },
  })
  return mutation
}
