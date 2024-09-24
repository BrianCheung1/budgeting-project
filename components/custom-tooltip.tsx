import { format } from "date-fns"
import { Separator } from "./ui/separator"
import { formatCurrency } from "@/lib/utils"

export const CustomTooltip = ({ active, payload }: any) => {
  if (!active) return null

  const date = payload[0].payload.date
  const income = payload[0].value
  const expenses = payload[1].value

  return (
    <div className="rounded-sm bg-white dark:bg-surfaceMixed-300 shadow-sm border overflow-hidden">
      <div className="text-sm p-2 px-3 bg-muted text-muted-foreground text-center">
        {format(date, "yyyy-MM-dd")}
      </div>
      <Separator />
      <div className="p-2 px-3 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2 mr-2">
            <div className="size-1.5 bg-primary-500 rounded-full" />
            <p className="text-sm text-muted-foreground">Income</p>
          </div>
          <p className="text-sm text-right font-medium">
            {formatCurrency(income)}
          </p>
        </div>
      </div>
      <div className="p-2 px-3 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2 mr-2">
            <div className="size-1.5 bg-rose-500 rounded-full" />
            <p className="text-sm text-muted-foreground">Expenses</p>
          </div>
          <p className="text-sm text-right font-medium">
            {formatCurrency(expenses * -1)}
          </p>
        </div>
      </div>
    </div>
  )
}
