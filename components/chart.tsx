import { FileSearch } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { AreaVariant } from "./area-variant"
import { BarVariant } from "./bar-variant"


type Props = {
  data?: {
    date: string
    income: number
    expenses: number
  }[]
}

export const Chart = ({ data = [] }: Props) => {
  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex space-y-2 lg:space-y-0 lg:flew-row lg:items-center justify-between">
        <CardTitle className="text-xl line-clamp-1">Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex flex-col gap-y-4 items-center justify-center h-[350px] w-full">
            <FileSearch className="size-6 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">
              No Date for this period
            </p>
          </div>
        ) : (
          // <AreaVariant data={data} />
          <BarVariant data={data} />
        )}
      </CardContent>
    </Card>
  )
}
