import React from 'react'
import { useTheme } from "next-themes"

const LogoTitle = () => {
  const { theme} = useTheme()
  return <>
  {theme === "light" ? <img className='w-[120px]' src="/images/club-geist-high-resolution-logo-color-on-transparent-background.svg" /> : <img className='w-[120px]' src="/images/club-geist-high-resolution-logo-white-on-transparent-background.svg"/>}</>
}

export default LogoTitle