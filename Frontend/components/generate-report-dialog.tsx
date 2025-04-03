"use client"

import { useState } from "react"
import { FileText, Calendar, UserRound, Building2, FileDown } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Separator } from "./ui/separator"
import { Card } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { cn } from "./lib/utils"
import { format } from "date-fns"
import { Calendar as CalendarComponent } from "./ui/calendar"
import { Checkbox } from "./ui/checkbox"

interface GenerateReportDialogProps {
  isOpen: boolean
  onClose: () => void
}

export default function GenerateReportDialog({ isOpen, onClose }: GenerateReportDialogProps) {
  const [reportType, setReportType] = useState("summary")
  const [dateRange, setDateRange] = useState<"all" | "30days" | "90days" | "custom">("all")
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeDetails, setIncludeDetails] = useState(true)
  const [outputFormat, setOutputFormat] = useState("pdf")

  const handleGenerateReport = () => {
    // In a real application, this would trigger an API call to generate
    // the report and either download it or display it
    console.log("Generating report:", {
      reportType,
      dateRange,
      startDate,
      endDate,
      includeCharts,
      includeDetails,
      outputFormat,
    })

    // Simulate a download or display
    if (outputFormat !== "screen") {
      const link = document.createElement("a")
      link.href = "#"
      link.download = `personas-report-${format(new Date(), "yyyy-MM-dd")}.${outputFormat}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    onClose()
  }

  const resetForm = () => {
    setReportType("summary")
    setDateRange("all")
    setStartDate(new Date())
    setEndDate(new Date())
    setIncludeCharts(true)
    setIncludeDetails(true)
    setOutputFormat("pdf")
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate Report
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="type" className="mt-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="type">Report Type</TabsTrigger>
            <TabsTrigger value="options">Options</TabsTrigger>
            <TabsTrigger value="output">Output</TabsTrigger>
          </TabsList>

          <TabsContent value="type" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <Card
                className={cn(
                  "p-4 cursor-pointer border-2",
                  reportType === "summary" ? "border-primary" : "border-transparent",
                )}
                onClick={() => setReportType("summary")}
              >
                <div className="flex items-start">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  <div>
                    <h3 className="font-medium">Summary Report</h3>
                    <p className="text-sm text-muted-foreground">
                      Overview of all personas with key metrics and statistics
                    </p>
                  </div>
                </div>
              </Card>

              <Card
                className={cn(
                  "p-4 cursor-pointer border-2",
                  reportType === "employees" ? "border-primary" : "border-transparent",
                )}
                onClick={() => setReportType("employees")}
              >
                <div className="flex items-start">
                  <UserRound className="h-5 w-5 mr-2 text-blue-500" />
                  <div>
                    <h3 className="font-medium">Employee Report</h3>
                    <p className="text-sm text-muted-foreground">Detailed report on employee personas and metrics</p>
                  </div>
                </div>
              </Card>

              <Card
                className={cn(
                  "p-4 cursor-pointer border-2",
                  reportType === "customers" ? "border-primary" : "border-transparent",
                )}
                onClick={() => setReportType("customers")}
              >
                <div className="flex items-start">
                  <UserRound className="h-5 w-5 mr-2 text-green-500" />
                  <div>
                    <h3 className="font-medium">Customer Report</h3>
                    <p className="text-sm text-muted-foreground">
                      Detailed analysis of customer personas and activities
                    </p>
                  </div>
                </div>
              </Card>

              <Card
                className={cn(
                  "p-4 cursor-pointer border-2",
                  reportType === "vendors" ? "border-primary" : "border-transparent",
                )}
                onClick={() => setReportType("vendors")}
              >
                <div className="flex items-start">
                  <Building2 className="h-5 w-5 mr-2 text-purple-500" />
                  <div>
                    <h3 className="font-medium">Vendor Report</h3>
                    <p className="text-sm text-muted-foreground">Analysis of vendor relationships and engagement</p>
                  </div>
                </div>
              </Card>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <Label>Time Period</Label>
              <RadioGroup value={dateRange} onValueChange={(val) => setDateRange(val as any)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all-time" />
                  <Label htmlFor="all-time">All Time</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="30days" id="last-30" />
                  <Label htmlFor="last-30">Last 30 Days</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="90days" id="last-90" />
                  <Label htmlFor="last-90">Last 90 Days</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom-range" />
                  <Label htmlFor="custom-range">Custom Range</Label>
                </div>
              </RadioGroup>
            </div>

            {dateRange === "custom" && (
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground",
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground",
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="options" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label htmlFor="include-charts">Include Charts & Graphics</Label>
                  <p className="text-sm text-muted-foreground">Add visual representations of data</p>
                </div>
                <Checkbox
                  id="include-charts"
                  checked={includeCharts}
                  onCheckedChange={() => setIncludeCharts(!includeCharts)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label htmlFor="include-details">Include Detailed Information</Label>
                  <p className="text-sm text-muted-foreground">Add comprehensive details for each persona</p>
                </div>
                <Checkbox
                  id="include-details"
                  checked={includeDetails}
                  onCheckedChange={() => setIncludeDetails(!includeDetails)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="output" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Output Format</Label>
              <RadioGroup value={outputFormat} onValueChange={setOutputFormat}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pdf" id="pdf" />
                  <Label htmlFor="pdf">PDF Document</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="excel" id="excel" />
                  <Label htmlFor="excel">Excel Spreadsheet</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="screen" id="screen" />
                  <Label htmlFor="screen">View on Screen</Label>
                </div>
              </RadioGroup>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleGenerateReport}>
            {outputFormat === "screen" ? (
              <>View Report</>
            ) : (
              <>
                <FileDown className="h-4 w-4 mr-2" />
                Generate & Download
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

