import React from "react"
import HeaderLogo from "./header-logo"
import Navigation from "./navigation"
import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs"
import { ModeToggle } from "./mode-toggle"
import { Loader2 } from "lucide-react"
import WelcomeMsg from "./welcome-msg"

const Header = () => {
  return (
    <header className="bg-gradient-to-b from-primary-600 to-blue-100 dark:from-surface-300 dark:to-surface-400 px-4 py-8 lg:px-14 pb-36">
      <div className="max-w-screen-2xl mx-auto">
        <div className="w-full flex items-center justify-between mb-14">
          <div className="flex items-center lg:gap-x-16">
            <HeaderLogo />
            <Navigation />
          </div>
          <div className="flex gap-x-2 items-center">
            <ModeToggle />
            <ClerkLoaded>
              <UserButton afterSwitchSessionUrl="/" />
            </ClerkLoaded>
            <ClerkLoading>
              <Loader2 className="size-8 animate-spin text-slate-400" />
            </ClerkLoading>
          </div>
        </div>
        <WelcomeMsg />
      </div>
    </header>
  )
}

export default Header
