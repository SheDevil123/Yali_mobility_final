"use client";

import { useState, useEffect, useRef } from "react";
import {
  BarChart3,
  RefreshCw,
  Download,
  Calendar,
  Filter,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart as ReLineChart,
  Line,
} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";

interface AnalyticsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AnalyticsDialog({ isOpen, onClose }: AnalyticsDialogProps) {
  const [timeRange, setTimeRange] = useState("30days");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState({
    totalPersonas: 0,
    activeEmployees: 0,
    engagementRate: "0%",
    typeDistribution: [],
    monthlyData: [],
    activityData: [],
  });

  const analyticsRef = useRef<HTMLDivElement>(null);

  // Fetch analytics data from the backend
  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:5000/api/analytics?timeRange=${timeRange}`);
      setAnalyticsData(response.data);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAnalyticsData();
    }
  }, [isOpen, timeRange]);

  // Export data as JSON
  const exportJSON = () => {
    const dataStr = JSON.stringify(analyticsData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "analytics-data.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export data as PDF
  const exportPDF = async () => {
    if (!analyticsRef.current) return;

    const canvas = await html2canvas(analyticsRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("analytics-data.pdf");
  };

  // Refresh data
  const refreshData = () => {
    fetchAnalyticsData();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Analytics Dashboard
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon" onClick={refreshData} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>

            <Button variant="outline" size="icon" onClick={exportJSON}>
              <Download className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="icon" onClick={exportPDF}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="h-[500px] flex flex-col items-center justify-center">
            <RefreshCw className="h-8 w-8 animate-spin mb-4 text-primary" />
            <p>Loading analytics data...</p>
          </div>
        ) : error ? (
          <div className="h-[500px] flex flex-col items-center justify-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div ref={analyticsRef}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Card>
                <CardHeader>
                  <CardTitle>Total Personas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.totalPersonas}</div>
                  <p className="text-sm text-green-500">+12.5% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Active Employees</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.activeEmployees}</div>
                  <p className="text-sm text-green-500">+5.2% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.engagementRate}</div>
                  <p className="text-sm text-red-500">-2.1% from last month</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Persona Growth Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Persona Growth</CardTitle>
                  <CardDescription>Monthly growth of personas by type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="employees" fill="#3b82f6" name="Employees" />
                      <Bar dataKey="vendors" fill="#22c55e" name="Vendors" />
                      <Bar dataKey="customers" fill="#a855f7" name="Customers" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Activity Over Time Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Activity Over Time</CardTitle>
                  <CardDescription>Number of personas created weekly</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ReLineChart data={analyticsData.activityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="interactions" stroke="#3b82f6" name="Personas Created" />
                    </ReLineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Type Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Type Distribution</CardTitle>
                  <CardDescription>Breakdown by persona type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={analyticsData.typeDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {analyticsData.typeDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4 mt-4">
                    {analyticsData.typeDistribution.map((item) => (
                      <div className="space-y-2" key={item.name}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge style={{ backgroundColor: item.color }}>{item.name}</Badge>
                            <span className="text-sm">{Math.round((item.value / analyticsData.totalPersonas) * 100)}%</span>
                          </div>
                          <span className="text-sm font-medium">{item.value}</span>
                        </div>
                        <Progress
                          value={Math.round((item.value / analyticsData.totalPersonas) * 100)}
                          className="h-2"
                          indicatorClassName="bg-primary"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

