"use client"

import type React from "react"

import { useState } from "react"
import { Calendar, Users } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Button } from "./ui/button"
import { Calendar as CalendarComponent } from "./ui/calendar"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { cn } from "./lib/utils"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

interface ScheduleMeetingDialogProps {
  isOpen: boolean
  onClose: () => void
}

export default function ScheduleMeetingDialog({ isOpen, onClose }: ScheduleMeetingDialogProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [time, setTime] = useState("09:00")
  const [duration, setDuration] = useState("30")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [attendees, setAttendees] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real application, you would save the meeting to a database
    // or integrate with a calendar API
    const meetingData = {
      title,
      date: date ? format(date, "yyyy-MM-dd") : "",
      time,
      duration: `${duration} minutes`,
      description,
      attendees: attendees.split(",").map((email) => email.trim()),
    }

    console.log("Scheduled meeting:", meetingData)

    // Reset form and close dialog
    resetForm()
    onClose()
  }

  const resetForm = () => {
    setDate(new Date())
    setTime("09:00")
    setDuration("30")
    setTitle("")
    setDescription("")
    setAttendees("")
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Schedule Meeting
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="title">Meeting Title</Label>
            <Input
              id="title"
              placeholder="Team Sync, Client Call, etc."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <div className="flex gap-2">
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="flex-1"
                />
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 min</SelectItem>
                    <SelectItem value="30">30 min</SelectItem>
                    <SelectItem value="45">45 min</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="attendees">Attendees</Label>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-muted-foreground" />
              <Input
                id="attendees"
                placeholder="Enter email addresses (comma separated)"
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
              />
            </div>
          </div>

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Meeting agenda and details"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Schedule Meeting</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

