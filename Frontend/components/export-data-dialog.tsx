"use client"

import { useState } from "react"
import { FileDown, FileSpreadsheet, FileJson, FileText, FileCheck } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

interface ExportDataDialogProps {
  isOpen: boolean
  onClose: () => void
}

export default function ExportDataDialog({ isOpen, onClose }: ExportDataDialogProps) {
  const [fileFormat, setFileFormat] = useState("csv")
  const [selectedType, setSelectedType] = useState<string>("all")

  const handleExport = async () => {
    if (fileFormat !== "csv") {
      alert("Currently, only CSV format is supported.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/api/export/download/${selectedType}`);
      if (!response.ok) {
        throw new Error("Failed to generate file");
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedType}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
  
      onClose();
    } catch (error) {
      console.error("Export error:", error);
      alert("Error exporting file");
    }
  };
  

  const resetForm = () => {
    setFileFormat("csv")
    setSelectedType("all")
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const getFileIcon = () => {
    switch (fileFormat) {
      case "csv":
        return <FileSpreadsheet className="h-5 w-5" />
      case "json":
        return <FileJson className="h-5 w-5" />
      case "txt":
        return <FileText className="h-5 w-5" />
      default:
        return <FileDown className="h-5 w-5" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getFileIcon()}
            Export Data
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="file-format">File Format</Label>
                <Select value={fileFormat} onValueChange={setFileFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="persona-type">Persona Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_personas">All Types</SelectItem>
                    <SelectItem value="employees">Employees</SelectItem>
                    <SelectItem value="vendors">Vendors</SelectItem>
                    <SelectItem value="customers">Customers</SelectItem>
                  </SelectContent>
                   
                </Select>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleExport}>
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

