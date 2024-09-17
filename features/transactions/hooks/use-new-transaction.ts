import { create } from "zustand"

// Define the state and actions for managing the "New Transaction" modal
type NewTransactionState = {
  isOpen: boolean // Tracks whether the modal is open or closed
  onOpen: () => void // Action to open the modal
  onClose: () => void // Action to close the modal
}

// Create a zustand store for managing the "New Transaction" modal state
export const useNewTransaction = create<NewTransactionState>((set) => ({
  // Initial state: modal is closed
  isOpen: false,

  // Action to open the modal by setting `isOpen` to true
  onOpen: () => set({ isOpen: true }),

  // Action to close the modal by setting `isOpen` to false
  onClose: () => set({ isOpen: false }),
}))
