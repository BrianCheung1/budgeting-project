import { InferRequestType, InferResponseType } from "hono"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { client } from "@/lib/hono"

type ReponseType = InferResponseType<
  (typeof client.api.categories)[":id"]["$patch"]
>
type RequestType = InferRequestType<
  (typeof client.api.categories)[":id"]["$patch"]
>["json"]

export const useEditCategory = (id?: string) => {
  const queryClient = useQueryClient()
  const mutation = useMutation<ReponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.categories[":id"]["$patch"]({
        param: { id },
        json,
      })
      return await response.json()
    },
    onSuccess: () => {
      toast.success("Category Updated")
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      queryClient.invalidateQueries({ queryKey: ["category", { id }] })
    },
    onError: () => {
      toast.error("Failed to update category")
    },
  })
  return mutation
}
