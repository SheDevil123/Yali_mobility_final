"use client"

import { useState } from "react"
import { Upload, Calendar, Check } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Button } from "./ui/button"
import { Progress } from "./ui/progress"
import { Label } from "./ui/label"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Switch } from "./ui/switch"

interface BackupDataDialogProps {
  isOpen: boolean
  onClose: () => void
}

export default function BackupDataDialog({ isOpen, onClose }: BackupDataDialogProps) {
  const [backupType, setBackupType] = useState("full")
  const [encryptBackup, setEncryptBackup] = useState(true)
  const [backupStatus, setBackupStatus] = useState<"idle" | "inProgress" | "complete">("idle")
  const [progress, setProgress] = useState(0)

  const simulateBackup = () => {
    setBackupStatus("inProgress")
    setProgress(0)

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 5

        if (newProgress >= 100) {
          clearInterval(interval)
          setBackupStatus("complete")
        }

        return newProgress
      })
    }, 100)
  }

  const handleClose = () => {
    if (backupStatus === "inProgress") {
      // Optionally show a confirmation dialog
      if (confirm("Backup in progress. Are you sure you want to cancel?")) {
        resetForm()
        onClose()
      }
    } else {
      resetForm()
      onClose()
    }
  }

  const resetForm = () => {
    setBackupType("full")
    setEncryptBackup(true)
    setBackupStatus("idle")
    setProgress(0)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Backup Data
          </DialogTitle>
        </DialogHeader>

        {backupStatus === "idle" && (
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <Label>Backup Type</Label>
              <RadioGroup value={backupType} onValueChange={setBackupType}>
                <div className="flex items-start space-x-2 my-2">
                  <RadioGroupItem value="full" id="full" />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="full" className="font-medium">
                      Full Backup
                    </Label>
                    <p className="text-sm text-muted-foreground">Backup all personas and settings</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2 my-2">
                  <RadioGroupItem value="personas" id="personas" />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="personas" className="font-medium">
                      Personas Only
                    </Label>
                    <p className="text-sm text-muted-foreground">Backup only personas data, excluding settings</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2 my-2">
                  <RadioGroupItem value="settings" id="settings" />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="settings" className="font-medium">
                      Settings Only
                    </Label>
                    <p className="text-sm text-muted-foreground">Backup only application settings</p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="encrypt">Encrypt Backup</Label>
                <p className="text-sm text-muted-foreground">Secure your backup with password protection</p>
              </div>
              <Switch id="encrypt" checked={encryptBackup} onCheckedChange={setEncryptBackup} />
            </div>
          </div>
        )}

        {backupStatus === "inProgress" && (
          <div className="space-y-4 py-6">
            <div className="flex items-center justify-center mb-4">
              <Upload className="h-12 w-12 text-primary animate-pulse" />
            </div>
            <h3 className="text-lg font-medium text-center">Backup in Progress</h3>
            <p className="text-muted-foreground text-center mb-4">Please wait while we create your backup...</p>
            <Progress value={progress} className="w-full" />
            <p className="text-xs text-center">{progress}%</p>
          </div>
        )}

        {backupStatus === "complete" && (
          <div className="space-y-4 py-6">
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-center">Backup Complete!</h3>
            <p className="text-muted-foreground text-center mb-4">Your data has been successfully backed up.</p>
            <div className="bg-muted rounded-md p-4">
              <div className="flex justify-between mb-1">
                <span>Backup type:</span>
                <span className="font-medium capitalize">{backupType}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Date:</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Time:</span>
                <span className="font-medium">{new Date().toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Encryption:</span>
                <span className="font-medium">{encryptBackup ? "Enabled" : "Disabled"}</span>
              </div>
            </div>
            <div className="flex justify-center mt-2">
              <Button variant="outline" className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Regular Backups
              </Button>
            </div>
          </div>
        )}

        <DialogFooter>
          {backupStatus === "idle" && (
            <>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="button" onClick={simulateBackup}>
                <Upload className="h-4 w-4 mr-2" />
                Start Backup
              </Button>
            </>
          )}

          {backupStatus === "inProgress" && (
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          )}

          {backupStatus === "complete" && (
            <>
              <Button type="button" variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button type="button" onClick={resetForm}>
                New Backup
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

