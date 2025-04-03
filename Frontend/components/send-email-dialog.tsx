"use client"

import type React from "react"
import { useState } from "react"
import { Mail, Users, PaperclipIcon } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"

interface SendEmailDialogProps {
  isOpen: boolean
  onClose: () => void
}

export default function SendEmailDialog({ isOpen, onClose }: SendEmailDialogProps) {
  const [to, setTo] = useState("")
  const [cc, setCc] = useState("")
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const emailData = {
      to: to.split(",").map((email) => email.trim()),
      cc: cc ? cc.split(",").map((email) => email.trim()) : [],
      subject,
      content,
    }

    try {
      const response = await fetch("http://localhost:5000/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailData),
      })

      const result = await response.json()

      if (response.ok) {
        console.log("Email sent:", result)
        resetForm()
        onClose()
      } else {
        setError(result.error || "Failed to send email.")
      }
    } catch (err) {
      setError("Error sending email. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setTo("")
    setCc("")
    setSubject("")
    setContent("")
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Send Email
          </DialogTitle>
        </DialogHeader>

        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="to">To</Label>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-muted-foreground" />
              <Input
                id="to"
                placeholder="recipient@example.com"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="cc">CC</Label>
            <Input id="cc" placeholder="cc@example.com" value={cc} onChange={(e) => setCc(e.target.value)} />
          </div>

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Email subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Write your email here..."
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="min-h-[200px]"
            />
          </div>

          <div className="flex items-center">

          </div>

          <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Email"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
