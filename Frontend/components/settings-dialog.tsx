"use client"

import { useState } from "react"
import { Settings, Monitor, Moon, Sun, Bell, Palette, Layout, User, Check } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Button } from "./ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Label } from "./ui/label"
import { Switch } from "./ui/switch"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Separator } from "./ui/separator"
import { ThemeSwitcher } from "./theme-switcher"
import { useTheme } from "next-themes"
import { Input } from "./ui/input"

interface SettingsDialogProps {
  isOpen: boolean
  onClose: () => void
  onOpenNotifications: () => void
}

export default function SettingsDialog({ isOpen, onClose, onOpenNotifications }: SettingsDialogProps) {
  const [activeTab, setActiveTab] = useState("appearance")
  const { theme, setTheme } = useTheme()
  const [settings, setSettings] = useState({
    // Appearance settings
    animations: true,
    reduceMotion: false,

    // Privacy settings
    analytics: true,
    cookies: true,
  })

  const handleSwitchChange = (key: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }))
  }

  const handleValueChange = (key: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const saveSettings = () => {
    // In a real app, you would save these settings to a database or localStorage
    localStorage.setItem("appSettings", JSON.stringify(settings))
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </DialogTitle>
        </DialogHeader>

        <div className="flex mt-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex">
              <TabsList className="flex flex-col h-auto w-48 bg-transparent space-y-1 mr-6">
                <TabsTrigger value="appearance" className="justify-start">
                  <Palette className="h-4 w-4 mr-2" />
                  Appearance
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 border-l pl-6">
                <TabsContent value="appearance" className="space-y-6 mt-0">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Theme</h3>
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Monitor className="h-4 w-4" />
                          <Label htmlFor="theme-system">System Theme</Label>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setTheme("system")}
                          className={theme === "system" ? "bg-secondary" : ""}
                        >
                          {theme === "system" && <Check className="h-4 w-4 mr-2" />}
                          System
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Sun className="h-4 w-4" />
                          <Label htmlFor="theme-light">Light Mode</Label>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setTheme("light")}
                          className={theme === "light" ? "bg-secondary" : ""}
                        >
                          {theme === "light" && <Check className="h-4 w-4 mr-2" />}
                          Light
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Moon className="h-4 w-4" />
                          <Label htmlFor="theme-dark">Dark Mode</Label>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setTheme("dark")}
                          className={theme === "dark" ? "bg-secondary" : ""}
                        >
                          {theme === "dark" && <Check className="h-4 w-4 mr-2" />}
                          Dark
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-4">Color Theme</h3>
                    <ThemeSwitcher />
                  </div>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>

        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={saveSettings}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

