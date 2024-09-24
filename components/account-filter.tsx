"use client"

import qs from "query-string"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "./ui/select"
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts"
import { useGetSummary } from "@/features/summary/api/use-get-summary"

export const AccountFilter = () => {
  const params = useSearchParams()
  const router = useRouter()
  const pathName = usePathname()

  const accountId = params.get("accountId") || "all"
  const from = params.get("from") || ""
  const to = params.get("to") || ""

  const onChange = (newValue: string) => {
    const query = {
      accountId: newValue,
      from,
      to,
    }

    if (newValue === "all") {
      query.accountId = ""
    }

    const url = qs.stringifyUrl(
      {
        url: pathName,
        query,
      },
      { skipNull: true, skipEmptyString: true }
    )
    router.push(url)
  }

  const { data: accounts, isLoading: isLoadingAccounts } = useGetAccounts()
  const { isLoading: isLoadingSummary } = useGetSummary()

  return (
    <Select
      value={accountId}
      onValueChange={onChange}
      disabled={isLoadingAccounts || isLoadingSummary}
    >
      <SelectTrigger
        className="lg:w-auto w-full h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20
       border-none focus:ring-offset-0 focus:ring-transparent outline-none
        focus:bg-white/30 transition dark:bg-[#020818] dark:text-white"
      >
        <SelectValue placeholder="Account" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Accounts</SelectItem>
        {accounts?.map((account) => (
          <SelectItem key={account.id} value={account.id}>
            {account.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
