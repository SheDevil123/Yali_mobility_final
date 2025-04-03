"use client"

import { useState } from "react"
import { Bell, Calendar, Cake, Briefcase, Gift, Star, Clock, Mail, MessageSquare, FileText } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Button } from "./ui/button"
import { Switch } from "./ui/switch"
import { Label } from "./ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Separator } from "./ui/separator"

interface NotificationSettingsProps {
  isOpen: boolean
  onClose: () => void
}

export default function NotificationSettings({ isOpen, onClose }: NotificationSettingsProps) {
  const [settings, setSettings] = useState({
    // Event notifications
    birthdays: true,
    anniversaries: true,
    joiningDates: true,
    meetings: true,
    deadlines: false,

    // Communication notifications
    emails: true,
    messages: true,
    mentions: true,
    comments: true,
    documents: false,

    // Delivery preferences
    deliveryMethod: "all",
    emailDigest: "daily",
    pushNotifications: true,
    desktopNotifications: true,
    soundAlerts: false,
  })

  const handleSwitchChange = (key: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }))
  }

  const handleRadioChange = (key: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const saveSettings = () => {
    // In a real app, you would save these settings to a database or localStorage
    localStorage.setItem("notificationSettings", JSON.stringify(settings))
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="events" className="mt-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cake className="h-5 w-5 text-pink-500" />
                <Label htmlFor="birthdays">Birthday Notifications</Label>
              </div>
              <Switch
                id="birthdays"
                checked={settings.birthdays}
                onCheckedChange={() => handleSwitchChange("birthdays")}
              />
            </div>
            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-purple-500" />
                <Label htmlFor="anniversaries">Work Anniversaries</Label>
              </div>
              <Switch
                id="anniversaries"
                checked={settings.anniversaries}
                onCheckedChange={() => handleSwitchChange("anniversaries")}
              />
            </div>
            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-500" />
                <Label htmlFor="joiningDates">Joining Date Reminders</Label>
              </div>
              <Switch
                id="joiningDates"
                checked={settings.joiningDates}
                onCheckedChange={() => handleSwitchChange("joiningDates")}
              />
            </div>
            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-500" />
                <Label htmlFor="meetings">Meeting Reminders</Label>
              </div>
              <Switch
                id="meetings"
                checked={settings.meetings}
                onCheckedChange={() => handleSwitchChange("meetings")}
              />
            </div>
            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-red-500" />
                <Label htmlFor="deadlines">Deadline Alerts</Label>
              </div>
              <Switch
                id="deadlines"
                checked={settings.deadlines}
                onCheckedChange={() => handleSwitchChange("deadlines")}
              />
            </div>
          </TabsContent>

          <TabsContent value="communication" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-500" />
                <Label htmlFor="emails">Email Notifications</Label>
              </div>
              <Switch id="emails" checked={settings.emails} onCheckedChange={() => handleSwitchChange("emails")} />
            </div>
            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-green-500" />
                <Label htmlFor="messages">Message Notifications</Label>
              </div>
              <Switch
                id="messages"
                checked={settings.messages}
                onCheckedChange={() => handleSwitchChange("messages")}
              />
            </div>
            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                <Label htmlFor="mentions">Mentions & Tags</Label>
              </div>
              <Switch
                id="mentions"
                checked={settings.mentions}
                onCheckedChange={() => handleSwitchChange("mentions")}
              />
            </div>
            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-500" />
                <Label htmlFor="comments">Comments on Your Content</Label>
              </div>
              <Switch
                id="comments"
                checked={settings.comments}
                onCheckedChange={() => handleSwitchChange("comments")}
              />
            </div>
            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-500" />
                <Label htmlFor="documents">Document Updates</Label>
              </div>
              <Switch
                id="documents"
                checked={settings.documents}
                onCheckedChange={() => handleSwitchChange("documents")}
              />
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-3">Delivery Method</h3>
              <RadioGroup
                value={settings.deliveryMethod}
                onValueChange={(value) => handleRadioChange("deliveryMethod", value)}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="delivery-all" />
                  <Label htmlFor="delivery-all">All notifications (Email & Push)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="delivery-email" />
                  <Label htmlFor="delivery-email">Email only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="push" id="delivery-push" />
                  <Label htmlFor="delivery-push">Push notifications only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="delivery-none" />
                  <Label htmlFor="delivery-none">None</Label>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium mb-3">Email Digest Frequency</h3>
              <RadioGroup
                value={settings.emailDigest}
                onValueChange={(value) => handleRadioChange("emailDigest", value)}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="realtime" id="digest-realtime" />
                  <Label htmlFor="digest-realtime">Real-time</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="daily" id="digest-daily" />
                  <Label htmlFor="digest-daily">Daily digest</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekly" id="digest-weekly" />
                  <Label htmlFor="digest-weekly">Weekly digest</Label>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="pushNotifications">Push Notifications</Label>
                <Switch
                  id="pushNotifications"
                  checked={settings.pushNotifications}
                  onCheckedChange={() => handleSwitchChange("pushNotifications")}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="desktopNotifications">Desktop Notifications</Label>
                <Switch
                  id="desktopNotifications"
                  checked={settings.desktopNotifications}
                  onCheckedChange={() => handleSwitchChange("desktopNotifications")}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="soundAlerts">Sound Alerts</Label>
                <Switch
                  id="soundAlerts"
                  checked={settings.soundAlerts}
                  onCheckedChange={() => handleSwitchChange("soundAlerts")}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

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

