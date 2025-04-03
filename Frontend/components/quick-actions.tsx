"use client"

import { useState } from "react"
import {
  Plus,
  FileSpreadsheet,
  FileText,
  BarChart3,
  Mail,
  Calendar,
  UserPlus,
  Download,
  Share2,
  Network,
  Users,
} from "lucide-react"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs"
import { useRouter } from "next/navigation"

// Update the QuickActions interface to include all the necessary function props
interface QuickActionsProps {
  onAddPersona: () => void
  onOpenNotifications: () => void
  onScheduleMeeting: () => void
  onSendEmail: () => void
  onInviteTeamMember: () => void
  onImportData: () => void
  onExportData: () => void
  onViewAnalytics: () => void
  onBackupData: () => void
  onRestoreData: () => void
  onAddGroups: () => void
}

// In the QuickActions function declaration, add default values for the new props
export default function QuickActions({
  onAddPersona,
  onOpenNotifications,
  onScheduleMeeting = () => {},
  onSendEmail = () => {},
  onInviteTeamMember = () => {},
  onImportData = () => {},
  onExportData = () => {},
  onViewAnalytics = () => {},
  onBackupData = () => {},
  onRestoreData = () => {},
  onAddGroups = () => {},
}: QuickActionsProps) {
  const [activeTab, setActiveTab] = useState<string>("general")
  const router = useRouter()

  const handleRelationshipManagement = () => {
    router.push("/relationship-web")
  }

  const handleAddGroups = () => {
    router.push("/groups/add")
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Quick Actions</h2>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="data">Data</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {activeTab === "general" && (
          // Now update each button to call the appropriate function
          // In the "general" tab section:
          <div className="space-y-3">
            <Button className="w-full justify-start" onClick={onAddPersona}>
              <Plus className="h-4 w-4 mr-2" /> Add New Persona
            </Button>
            <Button className="w-full justify-start" onClick={handleAddGroups}>
              <Users className="h-4 w-4 mr-2" /> Groups Manager
            </Button>
            <Button
              variant="default"
              className="w-full justify-start bg-blue-600 hover:bg-blue-700"
              onClick={onSendEmail}
            >
              <Mail className="h-4 w-4 mr-2" /> Send Email
            </Button>

            <Button
              variant="default"
              className="w-full justify-start bg-purple-600 hover:bg-purple-700"
              onClick={handleRelationshipManagement}
            >
              <Network className="h-4 w-4 mr-2" /> Relationship Management
            </Button>
          </div>
        )}

        {activeTab === "data" && (
          // In the "data" tab section:
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={onImportData}>
              <FileSpreadsheet className="h-4 w-4 mr-2" /> Import Data
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={onExportData}>
              <Download className="h-4 w-4 mr-2" /> Export Data
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={onViewAnalytics}>
              <BarChart3 className="h-4 w-4 mr-2" /> View Analytics
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

