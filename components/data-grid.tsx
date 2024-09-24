"use client"
import { useGetSummary } from "@/features/summary/api/use-get-summary"
import { formatDateRange } from "@/lib/utils"
import { useSearchParams } from "next/navigation"
import { DataCard, DataCardLoading } from "./data-card"
import { FaPiggyBank } from "react-icons/fa"
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6"
import { parseISO } from "date-fns"

export const DataGrid = () => {
  const { data, isLoading } = useGetSummary()

  const params = useSearchParams()
  const toParam = params.get("to")
  const fromParam = params.get("from")

  // Parse the `to` and `from` params into Date objects using `parseISO`
  const to = toParam ? parseISO(toParam) : undefined
  const from = fromParam ? parseISO(fromParam) : undefined

  // Format the date range using the parsed dates
  const dateRangeLabel = formatDateRange({ to, from })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
        <DataCardLoading />
        <DataCardLoading />
        <DataCardLoading />
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
      <DataCard
        title="Remaining"
        value={data?.remainingAmount}
        percentageChange={data?.remainingChange}
        icon={FaPiggyBank}
        dateRange={dateRangeLabel}
      />
      <DataCard
        title="Income"
        value={data?.incomeAmount}
        percentageChange={data?.incomeChange}
        icon={FaArrowTrendUp}
        dateRange={dateRangeLabel}
      />
      <DataCard
        title="Expenses"
        value={data?.expensesAmount}
        percentageChange={data?.expensesChange}
        icon={FaArrowTrendDown}
        dateRange={dateRangeLabel}
      />
    </div>
  )
}
