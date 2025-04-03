"use client"

import { useState, useRef } from "react"
import { Camera, Upload, X, Check, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from "axios"

interface OCRCaptureModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function OCRCaptureModal({ isOpen, onClose }: OCRCaptureModalProps) {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedData, setExtractedData] = useState<any | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)

      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const processImage = async () => {
    if (!imageFile) return
    setIsProcessing(true)
    setErrorMessage(null)

    const formData = new FormData()
    formData.append("image", imageFile)

    try {
      const response = await axios.post("http://localhost:5000/api/ocr/process-card", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      console.log("API Response:", response.data); // Log the full API response

      if (response.data && response.data.data) {
        setExtractedData(response.data.data);
      } else {
        setErrorMessage("Failed to extract information. Try again.");
      }
    } catch (error) {
      console.error("Error processing image:", error);
      setErrorMessage("Details may are already available in the database or failed to extract information!");
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Business Card</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Upload Button */}
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Image
          </Button>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative">
              <img src={imagePreview} alt="Preview" className="w-full h-[200px] object-contain border rounded-md" />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => {
                  setImageFile(null)
                  setImagePreview(null)
                  setExtractedData(null)
                  setErrorMessage(null)
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Process Button */}
          <Button onClick={processImage} disabled={!imageFile || isProcessing} className="w-full">
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Extract Information"
            )}
          </Button>

          {/* Display Extracted Data */}
          {extractedData && (
            <div className="mt-6 border rounded-md p-4">
              <h3 className="font-medium mb-2 flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Extracted and Stored Information Successfully!
              </h3>
            </div>
          )}

          {/* Display Error Message */}
          {errorMessage && (
            <div className="mt-4 text-red-500 text-sm font-medium">{errorMessage}</div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
