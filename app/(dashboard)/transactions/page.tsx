"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Plus } from "lucide-react"
import React, { useState } from "react"
import { columns } from "./columns"
import { DataTable } from "@/components/data-table"
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction"
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions"
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transactions"
import { UploadButton } from "./upload-button"
import { ImportCard } from "./import-card"
import { transactions as transactionSchema } from "@/db/schema"
import { useSelectAccount } from "@/features/accounts/hooks/use-select-account"
import { toast } from "sonner"
import { useBulkCreateTransactions } from "@/features/transactions/api/use-bulk-create-transactions"
import { useBulkCreateCategories } from "@/features/categories/api/use-bulk-create-categories"
import { useGetCategories } from "@/features/categories/api/use-get-categories"

enum VARIANTS {
  LIST = "LIST",
  IMPORT = "IMPORT",
}

const INITIAL_IMPORT_RESULTS = {
  data: [],
  errors: [],
  meta: {},
}

const TransactionsPage = () => {
  const [AccountDialog, confirm] = useSelectAccount()
  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST)
  const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS)
  const categoriesQuery = useGetCategories()
  const categories = categoriesQuery.data

  const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
    console.log(results)
    setVariant(VARIANTS.IMPORT)
    setImportResults(results)
  }

  const onCancelImport = () => {
    setImportResults(INITIAL_IMPORT_RESULTS)
    setVariant(VARIANTS.LIST)
  }

  const onSubmitImport = async (
    values: (typeof transactionSchema.$inferInsert)[]
  ) => {
    const accountId = await confirm()

    if (!accountId) {
      return toast.error("Please Select an account to continue")
    }

    if (!categories) {
      return toast.error("Categories data is still loading. Please wait.")
    }

    // Create a Set to store unique category names
    const uniqueCategorySet = new Set<string>()

    // Filter the values to ensure no duplicate categories
    const filteredValues = values.filter((value) => {
      if (value.category && !uniqueCategorySet.has(value.category)) {
        uniqueCategorySet.add(value.category)
        return true
      }
      return false
    })

    const newCategoryData = filteredValues.map((value) => ({
      ...value,
      accountId: accountId as string,
      name: value.category as string,
    }))

    createCategories.mutate(newCategoryData, {
      onSuccess: () => {
        onCancelImport()
      },
    })

    const transactionData = values.map((value) => {
      const categoryId = categories.find(
        (category) => category.name === value.category
      )?.id // Find category by name

      return {
        ...value,
        accountId: accountId as string,
        categoryId: categoryId || null, // Safely assign categoryId, or null if not found
      }
    })

    createTransactions.mutate(transactionData, {
      onSuccess: () => {
        onCancelImport()
      },
    })
  }

  const newTransaction = useNewTransaction()
  const createTransactions = useBulkCreateTransactions()
  const transactionsQuery = useGetTransactions()
  const transactions = transactionsQuery.data || []
  const deleteTransactions = useBulkDeleteTransactions()
  const createCategories = useBulkCreateCategories()

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

  if (variant === VARIANTS.IMPORT) {
    return (
      <>
        <AccountDialog />
        <ImportCard
          data={importResults.data}
          onCancel={onCancelImport}
          onSubmit={onSubmitImport}
        />
      </>
    )
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Transaction History
          </CardTitle>
          <div className="flex flex-col lg:flex-row items-center gap-x-2 gap-y-2">
            <Button
              size="sm"
              onClick={newTransaction.onOpen}
              variant="outline"
              className="dark:bg-primary-500 dark:text-white text-sm w-full lg:w-auto"
            >
              <Plus className="size-4 mr-2" />
              Add Transaction
            </Button>
            <UploadButton onUpload={onUpload} />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={transactions}
            filterKey="payee"
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
