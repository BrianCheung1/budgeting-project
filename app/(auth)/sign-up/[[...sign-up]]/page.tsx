import { SignUp, ClerkLoaded, ClerkLoading } from "@clerk/nextjs"
import { Loader2 } from "lucide-react"
import Image from "next/image"

export default function Page() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="h-full lg:flex flex=col items-center justify-center px-4">
        <div className="text-center space-y-4 pt-16">
          <h1 className="font-bold text-3xl ">Welcome Back</h1>
          <p className="text-base text-[#8b8b8b]">
            Log in or Create Account to get back to your dashboard
          </p>
          <div className="flex items-center justify-center mt-8">
            <ClerkLoaded>
              <SignUp />
            </ClerkLoaded>
            <ClerkLoading>
              <Loader2 className="animate-spin text-muted-foreground"></Loader2>
            </ClerkLoading>
          </div>
        </div>
      </div>
      <div className="h-full bg-[#1a1625] hidden lg:flex items-center justify-center">
        <Image src="/logo.svg" height={100} width={100} alt="logo" />
      </div>
    </div>
  )
}
