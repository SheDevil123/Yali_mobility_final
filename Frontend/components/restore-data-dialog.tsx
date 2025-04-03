"use client"

import type React from "react"

import { useState } from "react"
import { Download, FileDown, Upload, HardDrive, AlertTriangle, Check } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Button } from "./ui/button"
import { Progress } from "./ui/progress"
import { Label } from "./ui/label"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Input } from "./ui/input"

interface RestoreDataDialogProps {
  isOpen: boolean
  onClose: () => void
}

export default function RestoreDataDialog({ isOpen, onClose }: RestoreDataDialogProps) {
  const [restoreSource, setRestoreSource] = useState<"file" | "cloud">("file")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [restoreStatus, setRestoreStatus] = useState<"idle" | "uploading" | "restoring" | "complete" | "error">("idle")
  const [progress, setProgress] = useState(0)
  const [password, setPassword] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const simulateRestore = () => {
    setRestoreStatus("uploading")
    setProgress(0)

    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 5

        if (newProgress >= 100) {
          clearInterval(uploadInterval)
          setRestoreStatus("restoring")
          simulateRestoreProcess()
        }

        return newProgress
      })
    }, 100)
  }

  const simulateRestoreProcess = () => {
    setProgress(0)

    // Simulate restore process
    const restoreInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 10

        if (newProgress >= 100) {
          clearInterval(restoreInterval)
          setRestoreStatus("complete")
        }

        return newProgress
      })
    }, 200)
  }

  const resetForm = () => {
    setRestoreSource("file")
    setSelectedFile(null)
    setRestoreStatus("idle")
    setProgress(0)
    setPassword("")
  }

  const handleClose = () => {
    if (restoreStatus === "uploading" || restoreStatus === "restoring") {
      // Optionally show a confirmation dialog
      if (confirm("Restore in progress. Are you sure you want to cancel?")) {
        resetForm()
        onClose()
      }
    } else {
      resetForm()
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Restore Data
          </DialogTitle>
        </DialogHeader>

        {restoreStatus === "idle" && (
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <Label>Restore From</Label>
              <RadioGroup value={restoreSource} onValueChange={(val) => setRestoreSource(val as "file" | "cloud")}>
                <div className="flex items-start space-x-2 my-2">
                  <RadioGroupItem value="file" id="file" />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="file" className="font-medium">
                      Backup File
                    </Label>
                    <p className="text-sm text-muted-foreground">Restore from a local backup file</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2 my-2">
                  <RadioGroupItem value="cloud" id="cloud" />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="cloud" className="font-medium">
                      Cloud Storage
                    </Label>
                    <p className="text-sm text-muted-foreground">Restore from a cloud backup</p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {restoreSource === "file" && (
              <div className="space-y-2">
                <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                  <FileDown className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop your backup file here, or click to browse
                  </p>
                  <label className="cursor-pointer">
                    <span className="relative z-10">
                      <Button size="sm">Browse Files</Button>
                    </span>
                    <input type="file" accept=".backup,.zip,.json" className="sr-only" onChange={handleFileChange} />
                  </label>
                  {selectedFile && <p className="mt-2 text-sm">Selected: {selectedFile.name}</p>}
                </div>

                <div className="space-y-2 mt-4">
                  <Label htmlFor="backup-password">Backup Password (if encrypted)</Label>
                  <Input
                    id="backup-password"
                    type="password"
                    placeholder="Enter backup password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Leave empty if your backup is not password protected</p>
                </div>
              </div>
            )}

            {restoreSource === "cloud" && (
              <div className="space-y-4">
                <div className="border rounded-md p-6 flex flex-col items-center justify-center">
                  <HardDrive className="h-8 w-8 text-muted-foreground mb-2" />
                  <h3 className="font-medium mb-1">Cloud Backups</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    No cloud backups found. Cloud backup feature will be available in a future update.
                  </p>
                </div>
              </div>
            )}

            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-amber-800">Warning</h4>
                <p className="text-xs text-amber-700">
                  Restoring from a backup will replace your current data. This action cannot be undone. Make sure you
                  have a backup of your current data if needed.
                </p>
              </div>
            </div>
          </div>
        )}

        {(restoreStatus === "uploading" || restoreStatus === "restoring") && (
          <div className="space-y-4 py-6">
            <div className="flex items-center justify-center mb-4">
              {restoreStatus === "uploading" ? (
                <Upload className="h-12 w-12 text-primary animate-pulse" />
              ) : (
                <Download className="h-12 w-12 text-primary animate-pulse" />
              )}
            </div>
            <h3 className="text-lg font-medium text-center">
              {restoreStatus === "uploading" ? "Uploading Backup..." : "Restoring Data..."}
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              {restoreStatus === "uploading"
                ? "Uploading your backup file..."
                : "Please wait while we restore your data..."}
            </p>
            <Progress value={progress} className="w-full" />
            <p className="text-xs text-center">{progress}%</p>
          </div>
        )}

        {restoreStatus === "complete" && (
          <div className="space-y-4 py-6">
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-center">Restore Complete!</h3>
            <p className="text-muted-foreground text-center mb-4">Your data has been successfully restored.</p>
            <div className="bg-muted rounded-md p-4">
              <div className="flex justify-between mb-1">
                <span>Source:</span>
                <span className="font-medium capitalize">
                  {restoreSource === "file" ? "Backup File" : "Cloud Storage"}
                </span>
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
                <span>Status:</span>
                <span className="font-medium">Success</span>
              </div>
            </div>
            <p className="text-sm text-center">The application will reload to apply the restored data.</p>
          </div>
        )}

        {restoreStatus === "error" && (
          <div className="space-y-4 py-6">
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-red-100 p-3">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-center">Restore Failed</h3>
            <p className="text-muted-foreground text-center mb-4">There was an error restoring your data.</p>
            <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-800">
              <p className="font-medium">Error details:</p>
              <p className="text-sm">
                Invalid backup file or incorrect password. Please check your file and try again.
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          {restoreStatus === "idle" && (
            <>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="button" onClick={simulateRestore} disabled={restoreSource === "file" && !selectedFile}>
                <Download className="h-4 w-4 mr-2" />
                Restore
              </Button>
            </>
          )}

          {(restoreStatus === "uploading" || restoreStatus === "restoring") && (
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          )}

          {restoreStatus === "complete" && (
            <Button type="button" onClick={handleClose}>
              Close
            </Button>
          )}

          {restoreStatus === "error" && (
            <>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="button" onClick={resetForm}>
                Try Again
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

