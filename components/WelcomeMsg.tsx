"use client"
import React from "react"
import { useUser } from "@clerk/nextjs"

const WelcomeMsg = () => {
  const { user, isLoaded } = useUser()
  return (
    <div className="space-y-2 mb-4">
      <h2 className="text-2xl lg:text-4xl font-medium">Welcome Back{isLoaded ? ", " : " "}{user?.firstName}</h2>
      <p className="text-sm lg:text-base text-[#89b6fd] dark:text-primary-500">This is Your Dashboarad</p>
    </div>
  )
}

export default WelcomeMsg
