"use client"

import type React from "react"

import { useState } from "react"
import { UserPlus, Mail } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Separator } from "./ui/separator"
import { Switch } from "./ui/switch"

interface InviteTeamMemberDialogProps {
  isOpen: boolean
  onClose: () => void
}

export default function InviteTeamMemberDialog({ isOpen, onClose }: InviteTeamMemberDialogProps) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("member")
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real application, you would save this to a database
    // and send an invitation email
    const inviteData = {
      email,
      role,
      sendWelcomeEmail,
    }

    console.log("Inviting team member:", inviteData)

    // Reset form and close dialog
    resetForm()
    onClose()
  }

  const resetForm = () => {
    setEmail("")
    setRole("member")
    setSendWelcomeEmail(true)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Invite Team Member
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="colleague@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-3">
            <Label>Team Member Role</Label>
            <RadioGroup value={role} onValueChange={setRole}>
              <div className="flex items-start space-x-2 my-2">
                <RadioGroupItem value="admin" id="admin" />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="admin" className="font-medium">
                    Administrator
                  </Label>
                  <p className="text-sm text-muted-foreground">Full access to all settings and features</p>
                </div>
              </div>

              <div className="flex items-start space-x-2 my-2">
                <RadioGroupItem value="manager" id="manager" />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="manager" className="font-medium">
                    Manager
                  </Label>
                  <p className="text-sm text-muted-foreground">Can manage personas and access most features</p>
                </div>
              </div>

              <div className="flex items-start space-x-2 my-2">
                <RadioGroupItem value="member" id="member" />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="member" className="font-medium">
                    Team Member
                  </Label>
                  <p className="text-sm text-muted-foreground">Basic access to view and interact with personas</p>
                </div>
              </div>

              <div className="flex items-start space-x-2 my-2">
                <RadioGroupItem value="viewer" id="viewer" />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="viewer" className="font-medium">
                    Viewer
                  </Label>
                  <p className="text-sm text-muted-foreground">Read-only access to persona data</p>
                </div>
              </div>
            </RadioGroup>
          </div>

          <Separator className="my-4" />

          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label htmlFor="welcome-email">Send Welcome Email</Label>
              <p className="text-sm text-muted-foreground">Automatically send an email with login instructions</p>
            </div>
            <Switch id="welcome-email" checked={sendWelcomeEmail} onCheckedChange={setSendWelcomeEmail} />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Send Invitation</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

