import { useOpenAccount } from "@/features/accounts/hooks/use-open-accounts"
import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transactions"
import { cn } from "@/lib/utils"

type Props = {
  id: string
  account: string
  accountId: string
}

export const AccountColumn = ({ id, account, accountId }: Props) => {
  const { onOpen: onOpenAccount } = useOpenAccount()
  const { onOpen: onOpenTransaction } = useOpenTransaction()

  const onClick = () => {
    // onOpenAccount(accountId)
    onOpenTransaction(id)
  }
  return (
    <div
      onClick={onClick}
      className="flex items-center cursor-pointer hover:underline"
    >
      {account}
    </div>
  )
}
