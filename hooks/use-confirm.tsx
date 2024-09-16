import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  DialogFooter,
  DialogHeader,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"

export const useConfirm = (
  title: string,
  message: string
): [() => JSX.Element, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void
  } | null>(null)
  const confirm = () =>
    new Promise((resolve, reject) => {
      setPromise({ resolve })
    })

  const handleClose = () => {
    setPromise(null)
  }
  const handleConfirm = () => {
    promise?.resolve(true)
    handleClose()
  }

  const handleCancel = () => {
    promise?.resolve(false)
    handleClose()
  }
  const confirmationDialog = () => (
    <Dialog
      open={promise !== null}
      onOpenChange={(open) => {
        if (!open) handleClose() // Close dialog when user clicks outside or clicks "x"
      }}
    >
      <DialogContent className="bg-white dark:bg-surfaceMixed-300">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} variant="destructive">Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
  return [confirmationDialog, confirm]
}
