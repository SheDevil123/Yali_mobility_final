"use client"

import { useState, useEffect } from "react"
import { Check, ChevronDown } from "lucide-react"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { useTheme } from "next-themes"

const themes = [
  { name: "Default", value: "" },
  { name: "Purple", value: "theme-purple" },
  { name: "Green", value: "theme-green" },
  { name: "Amber", value: "theme-amber" },
]

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [currentColorTheme, setCurrentColorTheme] = useState("")
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)

    // Get the current color theme from localStorage or default to ""
    const savedColorTheme = localStorage.getItem("color-theme-preference") || ""
    setCurrentColorTheme(savedColorTheme)

    // Apply the saved color theme to the document
    if (savedColorTheme) {
      document.documentElement.classList.add(savedColorTheme)
    }
  }, [])

  const setColorTheme = (value: string) => {
    // Remove all theme classes
    themes.forEach((theme) => {
      if (theme.value) {
        document.documentElement.classList.remove(theme.value)
      }
    })

    // Add the new theme class if it's not the default
    if (value) {
      document.documentElement.classList.add(value)
    }

    // Save to localStorage
    localStorage.setItem("color-theme-preference", value)
    setCurrentColorTheme(value)
  }

  if (!mounted) return null

  const currentThemeName = themes.find((t) => t.value === currentColorTheme)?.name || "Default"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-primary"></span>
          <span>{currentThemeName}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((t) => (
          <DropdownMenuItem key={t.value} onClick={() => setColorTheme(t.value)} className="flex items-center gap-2">
            <span className={`w-4 h-4 rounded-full ${t.value ? `${t.value} bg-primary` : "bg-primary"}`}></span>
            <span>{t.name}</span>
            {currentColorTheme === t.value && <Check className="h-4 w-4 ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

