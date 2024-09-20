import { toast } from "sonner"
import { InferRequestType, InferResponseType } from "hono"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { client } from "@/lib/hono"

type ResponseType = InferResponseType<
  (typeof client.api.categories)["bulk-create"]["$post"]
>
type RequestType = InferRequestType<
  (typeof client.api.categories)["bulk-create"]["$post"]
>["json"]

// Custom hook to handle the bulk deletion of transactions
export const useBulkCreateCategories = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      // The function to run when the mutation is triggered (bulk deleting transactions)
      const response = await client.api.categories["bulk-create"]["$post"]({
        json,
      })
      return await response.json()
    },
    onSuccess: () => {
      toast.success("Categories created")
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      // TODO: Also invalidate summary
    },
    onError: () => {
      toast.error("Failed to create categories")
    },
  })

  return mutation
}
