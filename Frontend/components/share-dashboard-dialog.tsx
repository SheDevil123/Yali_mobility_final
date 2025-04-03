"use client"

import type React from "react"

import { useState } from "react"
import { Share2, Link2, Copy, Mail, Check } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Separator } from "./ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"

interface ShareDashboardDialogProps {
  isOpen: boolean
  onClose: () => void
}

export default function ShareDashboardDialog({ isOpen, onClose }: ShareDashboardDialogProps) {
  const [shareOption, setShareOption] = useState("view")
  const [email, setEmail] = useState("")
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("link")

  const shareLink = "https://yourdomain.com/dashboard/share/abc123"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (activeTab === "email") {
      // In a real application, you would send an email with the share link
      console.log("Sharing dashboard via email:", {
        email,
        permission: shareOption,
      })
    }

    // Reset form and close dialog
    resetForm()
    onClose()
  }

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink)
    setCopied(true)

    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  const resetForm = () => {
    setEmail("")
    setShareOption("view")
    setCopied(false)
    setActiveTab("link")
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
            <Share2 className="h-5 w-5" />
            Share Dashboard
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="link">Share Link</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="space-y-4 mt-4">
            <div className="space-y-4">
              <Label>Permission Level</Label>
              <RadioGroup value={shareOption} onValueChange={setShareOption}>
                <div className="flex items-start space-x-2 my-2">
                  <RadioGroupItem value="view" id="view" />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="view" className="font-medium">
                      View only
                    </Label>
                    <p className="text-sm text-muted-foreground">Recipient can only view the dashboard</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2 my-2">
                  <RadioGroupItem value="comment" id="comment" />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="comment" className="font-medium">
                      Can comment
                    </Label>
                    <p className="text-sm text-muted-foreground">Recipient can view and add comments</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2 my-2">
                  <RadioGroupItem value="edit" id="edit" />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="edit" className="font-medium">
                      Can edit
                    </Label>
                    <p className="text-sm text-muted-foreground">Recipient can view, comment, and edit the dashboard</p>
                  </div>
                </div>
              </RadioGroup>

              <Separator className="my-4" />

              <div className="space-y-2">
                <Label htmlFor="share-link">Share Link</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="share-link" value={shareLink} className="pl-9" readOnly />
                  </div>
                  <Button onClick={copyLink} variant="outline">
                    {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="email" className="space-y-4 mt-4">
            <form onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="recipient@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Separator className="my-4" />

              <Label>Permission Level</Label>
              <RadioGroup value={shareOption} onValueChange={setShareOption} className="mt-2">
                <div className="flex items-start space-x-2 my-2">
                  <RadioGroupItem value="view" id="email-view" />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="email-view" className="font-medium">
                      View only
                    </Label>
                    <p className="text-sm text-muted-foreground">Recipient can only view the dashboard</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2 my-2">
                  <RadioGroupItem value="comment" id="email-comment" />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="email-comment" className="font-medium">
                      Can comment
                    </Label>
                    <p className="text-sm text-muted-foreground">Recipient can view and add comments</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2 my-2">
                  <RadioGroupItem value="edit" id="email-edit" />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="email-edit" className="font-medium">
                      Can edit
                    </Label>
                    <p className="text-sm text-muted-foreground">Recipient can view, comment, and edit the dashboard</p>
                  </div>
                </div>
              </RadioGroup>

              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit">Send Invitation</Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

