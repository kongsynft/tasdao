"use client"

import * as React from "react"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { META_THEME_COLORS } from "@/config/site"
import { useDarkModeMetaColor } from "@/hooks/use-dark-mode-meta-color"
import { Button } from "@/registry/new-york/ui/button"

export function DarkModeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const { setDarkModeMetaColor } = useDarkModeMetaColor()

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
    setDarkModeMetaColor(
      resolvedTheme === "dark"
        ? META_THEME_COLORS.light
        : META_THEME_COLORS.dark
    )
  }, [resolvedTheme, setTheme, setDarkModeMetaColor])

  return (
    <Button
      variant="ghost"
      className="group/toggle h-8 w-8 px-0"
      onClick={toggleTheme}
    >
      <SunIcon className="hidden [html.dark_&]:block" />
      <MoonIcon className="hidden [html.light_&]:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
