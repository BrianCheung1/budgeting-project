import Link from "next/link"
import React from "react"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"


type Props = {
  href: string
  label: string
  isActive?: boolean
}
const NavButton = ({ href, label, isActive }: Props) => {
  return (
    <Button
      asChild
      size="sm"
      variant="outline"
      className={cn(
        "w-full lg:auto font-normal hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition",
        "dark:hover:bg-surface-100 dark:hover:text-inherit dark:focus:bg-surface-100 dark:text-inherit", // Revert changes in dark mode
        isActive ? "bg-white/10 dark:bg-surface-100" : " bg-transparent"
      )}
    >
      <Link href={href}>{label}</Link>
    </Button>
  )
}

export default NavButton
