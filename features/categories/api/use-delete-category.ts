import { InferResponseType } from "hono"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { client } from "@/lib/hono"

type ReponseType = InferResponseType<
  (typeof client.api.categories)[":id"]["$delete"]
>

export const useDeleteCategory = (id?: string) => {
  const queryClient = useQueryClient()
  const mutation = useMutation<ReponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.categories[":id"]["$delete"]({
        param: { id },
      })
      return await response.json()
    },
    onSuccess: () => {
      toast.success("Category Deleted")
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      queryClient.invalidateQueries({ queryKey: ["category", { id }] })
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
    },
    onError: () => {
      toast.error("Failed to delete category")
    },
  })
  return mutation
}
