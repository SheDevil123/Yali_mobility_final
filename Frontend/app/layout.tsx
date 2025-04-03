import type React from "react"
import type { Metadata } from "next"
import { ThemeProvider } from "../components/theme-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "Persona Dashboard",
  description: "Manage all your personas in one place",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="theme-preference" // Consistent key for both dashboard and profile
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'