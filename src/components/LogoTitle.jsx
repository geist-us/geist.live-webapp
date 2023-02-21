import React from 'react'
import { useTheme } from "next-themes"

const LogoTitle = () => {
  const { theme} = useTheme()
  return <>
  {theme === "light" ? <img className='w-[240px]' src="/images/geist_logo.webp" /> : <img className='w-[120px]' src="/images/geist_logo.webp"/>}</>
}

export default LogoTitle