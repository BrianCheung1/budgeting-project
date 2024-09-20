import { useOpenCategory } from "@/features/categories/hooks/use-open-category"
import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transactions"
import { cn } from "@/lib/utils"
import { TriangleAlert } from "lucide-react"

type Props = {
  id: string
  category: string | null
  categoryId: string | null
}

export const CategoryColumn = ({ id, category, categoryId }: Props) => {
  const { onOpen: onOpenCategory } = useOpenCategory()
  const { onOpen: onOpenTransaction } = useOpenTransaction()

  const onClick = () => {
    if (categoryId) {
      onOpenCategory(categoryId)
    } else {
      onOpenCategory("")
    }
    // onOpenCategory(categoryId)
  }
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center cursor-pointer hover:underline",
        !category && "dark:text-rose-500"
      )}
    >
      {!category && <TriangleAlert className="mr-2 size-4 shrink-0" />}
      {category || "N/A"}
    </div>
  )
}
