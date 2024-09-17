"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Plus } from "lucide-react"
import React from "react"
import { columns } from "./columns"
import { DataTable } from "@/components/data-table"
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction"
import { useGetTransaction } from "@/features/transactions/api/use-get-transaction"
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transactions"

const TransactionsPage = () => {
  const newTransaction = useNewTransaction()
  const transactionsQuery = useGetTransaction()
  const transactions = transactionsQuery.data || []
  const deleteTransactions = useBulkDeleteTransactions()

  const isDisabled = transactionsQuery.isLoading || deleteTransactions.isPending

  if (transactionsQuery.isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          {/* <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader> */}
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="size-6 text-slate-300 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Transaction History
          </CardTitle>
          <Button
            size="sm"
            onClick={newTransaction.onOpen}
            variant="outline"
            className="dark:bg-primary-500 dark:text-white text-sm"
          >
            <Plus className="size-4 mr-2" />
            Add Transaction
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={transactions}
            filterKey="name"
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id)
              deleteTransactions.mutate({ ids })
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default TransactionsPage
