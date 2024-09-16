import Image from "next/image"
import Link from "next/link"
import React from "react"

const HeaderLogo = () => {
  return (
    <Link href="/">
      <div className="items-center hidden lg:flex">
        <Image src="/logo.svg" height={28} width={28} alt="logo" />
        <p className="font-semibold text-2xl ml-2.5 text-white">Budgeting</p>
      </div>
    </Link>
  )
}

export default HeaderLogo
