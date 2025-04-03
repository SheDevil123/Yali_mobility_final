"use client"

import { ThemeProvider } from "./components/theme-provider"
import PersonaDashboard from "./persona-dashboard"

export default function Preview() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <PersonaDashboard />
    </ThemeProvider>
  )
}

