"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios" // Import Axios
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Clock,
  Download,
  Printer,
  Share2,
  Send,
  Edit,
  UserPlus,
  MoreHorizontal,
  Globe,
  User,
  MessageCircle,
  Video,
  Camera,
  ArrowDownUp,
  Copy,
  Building2,
  Users,
  Award,
  Briefcase,
  DollarSign,
  Activity,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Persona } from "@/types/persona"
import { Badge } from "@/components/ui/badge"

export default function PersonalProfile({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("basic-info")
  const [showImageModal, setShowImageModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [documentSortBy, setDocumentSortBy] = useState("name")
  const [timelineSortBy, setTimelineSortBy] = useState("date")
  const [persona, setPersona] = useState<Persona | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPersona = async () => {
      setLoading(true);
      try {
        console.log("Resolved Params ID:", resolvedParams.id); // Debugging
        const response = await axios.get(`http://localhost:5000/api/personas/${resolvedParams.id}`);
        console.log("Fetched Persona Data:", response.data); // Debugging
        setPersona(response.data);
      } catch (error) {
        console.error("Error fetching persona:", error);
        if (error.response?.status === 404) {
          alert("Persona not found. Please check the ID.");
        }
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchPersona();
  }, [resolvedParams.id]);

  const documentsData = [
    { id: 1, name: "Employment Contract", type: "Contract", date: "15 Jun 2022", status: "Verified" },
    { id: 2, name: "ID Card", type: "Identity", date: "20 Jun 2022", status: "Verified" },
    { id: 3, name: "Performance Review - 2023", type: "Assessment", date: "10 Jan 2023", status: "Verified" },
    { id: 4, name: "NDA Agreement", type: "Legal", date: "15 Jun 2022", status: "Verified" },
    { id: 5, name: "Health Insurance Form", type: "Insurance", date: "25 Jun 2022", status: "Pending" },
  ]

  const timelineData = [
    {
      id: 1,
      date: "Mar 10, 2023",
      event: "Promoted to Senior Engineer",
      details: "Based on outstanding performance in the Database Optimization project.",
    },
    {
      id: 2,
      date: "Jan 15, 2023",
      event: "Annual Performance Review",
      details: "Received an excellent rating with 4.8/5 overall score.",
    },
    {
      id: 3,
      date: "Nov 20, 2022",
      event: "Project Milestone Achieved",
      details: "Successfully completed Phase II of the Cloud Migration project.",
    },
    {
      id: 4,
      date: "Jun 15, 2022",
      event: "Joined as Engineer",
      details: "Onboarded to the R&D department under Sarah Thompson.",
    },
  ]

  // Sort documents based on the selected criteria
  const sortDocuments = () => {
    return [...documentsData].sort((a, b) => {
      if (documentSortBy === "name") {
        return a.name.localeCompare(b.name)
      } else if (documentSortBy === "type") {
        return a.type.localeCompare(b.type)
      } else if (documentSortBy === "date") {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        return dateB.getTime() - dateA.getTime() // Most recent first
      }
      return 0
    })
  }

  // Sort timeline items based on the selected criteria
  const sortTimeline = () => {
    return [...timelineData].sort((a, b) => {
      if (timelineSortBy === "date") {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        return dateB.getTime() - dateA.getTime() // Most recent first
      } else if (timelineSortBy === "event") {
        return a.event.localeCompare(b.event)
      }
      return 0
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500"
      case "Inactive":
        return "bg-red-500"
      case "Onboarding":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getDocStatusColor = (status: string) => {
    switch (status) {
      case "Verified":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Expired":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Mock functions for actions
  const handlePrintProfile = () => {
    window.print()
  }

  const handleDownloadProfile = () => {
    alert("Downloading profile as PDF...")
  }

  // const handleProfilePictureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (!file) return;

  //   const formData = new FormData();
  //   formData.append("profile_photo", file);

  //   try {
  //     const response = await axios.post(
  //       `http://localhost:5000/api/profile/personas/${persona.id}/upload-photo`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );
  //     setPersona({ ...persona, profile_photo: response.data.profile_photo });
  //     setShowImageModal(false);
  //     alert("Profile photo updated successfully!");
  //   } catch (error) {
  //     console.error("Error uploading profile photo:", error);
  //     alert("Failed to upload profile photo. Please try again.");
  //   }
  // };

  const handleEditProfile = (updatedProfile: any) => {
    setPersona(updatedProfile)
    setShowEditModal(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!persona) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Persona Not Found</h2>
          <p className="mb-4">The persona you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push("/")}>Return to Dashboard</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-6 profile-page">
      <div className="max-w-6xl mx-auto profile-container">
        {/* Header with Back Button and Profile Actions */}
        <div className="flex justify-between items-center mb-6 header-actions no-print">
          <Link href="/" className="text-indigo-600 hover:text-indigo-800 font-medium back-button transition-colors">
            ← Back to Dashboard
          </Link>

          {/* Profile Actions */}
          <div className="flex space-x-2">
            <Button
              onClick={handlePrintProfile}
              variant="outline"
              className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 transition flex items-center"
            >
              <Printer size={16} className="mr-2" /> Print Profile
            </Button>
            <Button
              onClick={handleDownloadProfile}
              variant="outline"
              className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 transition flex items-center"
            >
              <Download size={16} className="mr-2" /> Download PDF
            </Button>
          </div>
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 profile-card">
          <div className="relative h-40 bg-gradient-to-r from-indigo-500 to-purple-600">
            <Button
              variant="outline"
              size="sm"
              className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm border-white/40 text-white hover:bg-white/30 hover:text-white"
              onClick={() => setShowImageModal(true)}
            >
              <Camera size={14} className="mr-1" /> Change Cover
            </Button>
          </div>

          <div className="flex flex-col items-center text-center px-6 pb-6 -mt-16">
            {/* Profile Image with Status Indicator */}
            <div className="relative mb-4">
              <div className="cursor-pointer relative profile-image-container" onClick={() => setShowImageModal(true)}>
                <img
                  src={persona.profile_photo || "/placeholder.svg?height=150&width=150"}
                  alt={persona.name}
                  className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-md"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Camera className="text-white" size={24} />
                </div>
              </div>
              <span
                className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-white ${getStatusColor(
                  persona.status || "Active",
                )}`}
              ></span>
            </div>

            {/* Name and Role */}
            <h1 className="text-3xl font-bold text-gray-800 mb-1">{persona.name}</h1>
            <p className="text-xl text-indigo-600 mb-3">
              {persona.type} - {persona.department}
            </p>

            {/* Status Badges */}
            <div className="flex justify-center gap-3 mb-4">
              <span
                className={`px-3 py-1 rounded-full text-sm ${getStatusColor(persona.status || "Active")} text-white shadow-sm`}
              >
                {persona.status}
              </span>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm shadow-sm">
                {persona.department}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6 no-print">
              <Button
                onClick={() => setShowEditModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 transition flex items-center shadow-sm"
              >
                <Edit size={16} className="mr-2" /> Edit Profile
              </Button>
              <Button
                variant="outline"
                className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition flex items-center shadow-sm"
              >
                <MoreHorizontal size={16} className="mr-2" /> More Actions
              </Button>
            </div>

            {/* Quick Action Buttons */}
            <div className="w-full p-4 mb-6 flex flex-wrap justify-center gap-3 quick-actions no-print bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border border-indigo-100 shadow-sm">
              <Button className="bg-blue-600 hover:bg-blue-700 transition flex items-center">
                <Phone size={18} className="mr-2" /> Call
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 transition flex items-center">
                <Mail size={18} className="mr-2" /> Email
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700 transition flex items-center">
                <MessageCircle size={18} className="mr-2" /> Message
              </Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700 transition flex items-center">
                <Calendar size={18} className="mr-2" /> Schedule
              </Button>
              <Button className="bg-red-600 hover:bg-red-700 transition flex items-center">
                <Video size={18} className="mr-2" /> Video Call
              </Button>
              <Button className="bg-amber-600 hover:bg-amber-700 transition flex items-center">
                <Share2 size={18} className="mr-2" /> Share Profile
              </Button>
            </div>

            {/* About Section */}
            <div className="w-full bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-100 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center justify-center">
                <User size={16} className="mr-2 text-indigo-500" /> About
              </h3>
              <p className="text-gray-600 text-center">{persona.message}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 no-print">
          <div className="flex overflow-x-auto custom-scrollbar border-b">
            <button
              className={`px-6 py-4 font-medium focus:outline-none whitespace-nowrap transition-colors ${
                activeTab === "basic-info"
                  ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50"
                  : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/30"
              }`}
              onClick={() => setActiveTab("basic-info")}
            >
              <FileText className="inline-block mr-2 h-4 w-4" /> Basic Info
            </button>
            <button
              className={`px-6 py-4 font-medium focus:outline-none whitespace-nowrap transition-colors ${
                activeTab === "activity"
                  ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50"
                  : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/30"
              }`}
              onClick={() => setActiveTab("activity")}
            >
              <Clock className="inline-block mr-2 h-4 w-4" /> Activity Timeline
            </button>
            <button
              className={`px-6 py-4 font-medium focus:outline-none whitespace-nowrap transition-colors ${
                activeTab === "documents"
                  ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50"
                  : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/30"
              }`}
              onClick={() => setActiveTab("documents")}
            >
              <FileText className="inline-block mr-2 h-4 w-4" /> Documents
            </button>
            <button
              className={`px-6 py-4 font-medium focus:outline-none whitespace-nowrap transition-colors ${
                activeTab === "location"
                  ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50"
                  : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/30"
              }`}
              onClick={() => setActiveTab("location")}
            >
              <MapPin className="inline-block mr-2 h-4 w-4" /> Location & Contacts
            </button>
            <button
              className={`px-6 py-4 font-medium focus:outline-none whitespace-nowrap transition-colors ${
                activeTab === "additional-details"
                  ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50"
                  : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/30"
              }`}
              onClick={() => setActiveTab("additional-details")}
            >
              <User className="inline-block mr-2 h-4 w-4" /> Additional Details
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          {/* Basic Info */}
          {activeTab === "basic-info" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Basic Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 shadow-sm space-y-4">
                  <div className="flex items-start">
                    <Mail className="mt-1 mr-3 text-indigo-500" size={20} />
                    <div>
                      <label className="text-sm text-gray-500">Email Address</label>
                      <p className="font-medium">{persona.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="mt-1 mr-3 text-indigo-500" size={20} />
                    <div>
                      <label className="text-sm text-gray-500">Phone Number</label>
                      <p className="font-medium">{persona.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="mt-1 mr-3 text-indigo-500" size={20} />
                    <div>
                      <label className="text-sm text-gray-500">Location</label>
                      <p className="font-medium">{persona.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Globe className="mt-1 mr-3 text-indigo-500" size={20} />
                    <div>
                      <label className="text-sm text-gray-500">Google Account</label>
                      <p className="font-medium">{persona.googleAccount}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 shadow-sm space-y-4">
                  <div className="flex items-start">
                    <Calendar className="mt-1 mr-3 text-indigo-500" size={20} />
                    <div>
                      <label className="text-sm text-gray-500">Joining Date</label>
                      <p className="font-medium">{persona.added}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <UserPlus className="mt-1 mr-3 text-indigo-500" size={20} />
                    <div>
                      <label className="text-sm text-gray-500">Reporting Manager</label>
                      <p className="font-medium">{persona.manager}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-gradient-to-br from-indigo-50 to-green-50 rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Award className="mr-2 text-indigo-500" size={20} /> Skills & Expertise
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full shadow-sm">JavaScript</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full shadow-sm">Python</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full shadow-sm">
                    Data Engineering
                  </span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full shadow-sm">
                    Database Design
                  </span>
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full shadow-sm">Cloud Infrastructure</span>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full shadow-sm">
                    Team Leadership
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Activity Timeline */}
          {activeTab === "activity" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Activity Timeline</h2>

                {/* Sort dropdown for timeline */}
                <div className="relative">
                  <div className="flex items-center bg-white border border-gray-300 rounded-lg p-2 cursor-pointer shadow-sm">
                    <ArrowDownUp size={16} className="mr-2 text-indigo-500" />
                    <span className="text-sm">Sort by:</span>
                    <select
                      className="ml-2 text-sm bg-transparent outline-none cursor-pointer"
                      value={timelineSortBy}
                      onChange={(e) => setTimelineSortBy(e.target.value)}
                    >
                      <option value="date">Date (Latest first)</option>
                      <option value="event">Event (A-Z)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="relative pl-8 border-l-2 border-indigo-200 space-y-8 ml-4">
                {sortTimeline().map((item, index) => (
                  <div key={item.id} className="relative">
                    <div className="absolute -left-10 mt-1.5 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center shadow-md">
                      <Clock size={16} className="text-white" />
                    </div>

                    <div className="bg-gradient-to-br from-white to-indigo-50 rounded-lg border border-indigo-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="text-sm text-indigo-600 font-medium mb-1">{item.date}</div>
                      <h3 className="font-semibold text-gray-800">{item.event}</h3>
                      <p className="mt-1 text-gray-600">{item.details}</p>

                      {index === 0 && (
                        <div className="mt-3 flex items-center p-2 bg-white rounded-lg border border-indigo-100">
                          <FileText size={14} className="text-indigo-500 mr-2" />
                          <span className="text-sm text-gray-700">Promotion Letter.pdf</span>
                          <button className="ml-auto text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                            View Document
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {activeTab === "documents" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Documents</h2>

                <div className="flex items-center space-x-2">
                  {/* Sort dropdown for documents */}
                  <div className="relative">
                    <div className="flex items-center bg-white border border-gray-300 rounded-lg p-2 cursor-pointer shadow-sm">
                      <ArrowDownUp size={16} className="mr-2 text-indigo-500" />
                      <span className="text-sm">Sort by:</span>
                      <select
                        className="ml-2 text-sm bg-transparent outline-none cursor-pointer"
                        value={documentSortBy}
                        onChange={(e) => setDocumentSortBy(e.target.value)}
                      >
                        <option value="name">Name (A-Z)</option>
                        <option value="type">Type (A-Z)</option>
                        <option value="date">Date (Latest first)</option>
                      </select>
                    </div>
                  </div>

                  <Button className="bg-indigo-600 hover:bg-indigo-700 transition flex items-center shadow-sm">
                    <FileText size={16} className="mr-2" /> Upload Document
                  </Button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 shadow-sm">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-indigo-700 bg-indigo-100 rounded-tl-lg">
                          Document Name
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-indigo-700 bg-indigo-100">Type</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-indigo-700 bg-indigo-100">
                          Date Added
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-indigo-700 bg-indigo-100">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-indigo-700 bg-indigo-100 rounded-tr-lg">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-indigo-100">
                      {sortDocuments().map((doc, index) => (
                        <tr
                          key={doc.id}
                          className={`hover:bg-white transition-colors ${index % 2 === 0 ? "bg-white/50" : "bg-white/80"}`}
                        >
                          <td className="px-4 py-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-md bg-indigo-100 flex items-center justify-center mr-3">
                                <FileText className="text-indigo-500" size={16} />
                              </div>
                              <span className="font-medium">{doc.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-gray-600">{doc.type}</td>
                          <td className="px-4 py-4 text-gray-600">{doc.date}</td>
                          <td className="px-4 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${getDocStatusColor(doc.status)}`}>
                              {doc.status}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
                                title="Download"
                              >
                                <Download size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
                                title="Print"
                              >
                                <Printer size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
                                title="Share"
                              >
                                <Share2 size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
                                title="Email"
                              >
                                <Send size={16} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Location & Contacts */}
          {activeTab === "location" && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Location & Contacts</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Map and Location Information */}
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center mb-4">
                    <MapPin size={24} className="text-indigo-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800">Location</h3>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-inner mb-4 h-48 flex items-center justify-center relative overflow-hidden">
                    <img
                      src={`https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(persona.location)}&zoom=13&size=600x300&maptype=roadmap&markers=color:blue%7C${encodeURIComponent(persona.location)}&key=YOUR_API_KEY`}
                      alt="Map location"
                      className="absolute inset-0 w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                    <div className="relative z-10 text-center">
                      <MapPin size={36} className="mx-auto mb-2 text-indigo-600" />
                      <p className="font-medium text-gray-800">{persona.location}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                      <Building2 className="text-indigo-500 mr-3" size={20} />
                      <div>
                        <p className="text-sm text-gray-500">Office</p>
                        <p className="font-medium">Main Headquarters</p>
                      </div>
                    </div>

                    <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                      <Clock className="text-indigo-500 mr-3" size={20} />
                      <div>
                        <p className="text-sm text-gray-500">Time Zone</p>
                        <p className="font-medium">Pacific Time (PT)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center mb-4">
                      <Mail size={24} className="text-indigo-600 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                        <Mail className="text-indigo-500 mr-3" size={20} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium truncate">{persona.email}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="text-indigo-600">
                          <Copy size={16} />
                        </Button>
                      </div>

                      <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                        <Phone className="text-indigo-500 mr-3" size={20} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">{persona.phone}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="text-indigo-600">
                          <Copy size={16} />
                        </Button>
                      </div>

                      <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                        <Globe className="text-indigo-500 mr-3" size={20} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500">Google Account</p>
                          <p className="font-medium truncate">{persona.googleAccount}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="text-indigo-600">
                          <Copy size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-50 to-green-50 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center mb-4">
                      <Users size={24} className="text-indigo-600 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-800">Work Network</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                        <div className="relative mr-3">
                          <img
                            src="/placeholder.svg?height=40&width=40"
                            alt="Sarah"
                            className="w-10 h-10 rounded-full object-cover border-2 border-indigo-100"
                          />
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">Sarah Thompson</p>
                          <div className="flex items-center">
                            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 mr-2">
                              Manager
                            </Badge>
                            <p className="text-sm text-gray-500 truncate">Engineering</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-indigo-600">
                          <MessageCircle size={16} />
                        </Button>
                      </div>

                      <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                        <div className="relative mr-3">
                          <img
                            src="/placeholder.svg?height=40&width=40"
                            alt="Mike"
                            className="w-10 h-10 rounded-full object-cover border-2 border-indigo-100"
                          />
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">Mike Johnson</p>
                          <div className="flex items-center">
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 mr-2">
                              Director
                            </Badge>
                            <p className="text-sm text-gray-500 truncate">Product</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-indigo-600">
                          <MessageCircle size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Additional Details Tab */}
          {activeTab === "additional-details" && (
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Additional Details</h2>

              {/* Employee Details */}
              {persona.type === "Employees" && persona.additionalDetails &&  (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center mb-4">
                      <User size={24} className="text-indigo-600 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                        <Calendar className="text-indigo-500 mr-3" size={20} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500">Date of Birth</p>
                          <p className="font-medium">{persona.additionalDetails.date_of_birth || "Not provided"}</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                        <User className="text-indigo-500 mr-3" size={20} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500">Father's Name</p>
                          <p className="font-medium">{persona.additionalDetails.fatherName || "Not provided"}</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                        <Award className="text-indigo-500 mr-3" size={20} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500">Blood Group</p>
                          <p className="font-medium">{persona.additionalDetails.bloodGroup || "Not provided"}</p>
                        </div>
                      </div>
                      {/* <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                        <Phone className="text-indigo-500 mr-3" size={20} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500">Emergency Contact</p>
                          <p className="font-medium">{persona.additionalDetails.emergencyContact || "Not provided"}</p>
                        </div>
                      </div> */}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-50 to-green-50 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center mb-4">
                      <FileText size={24} className="text-indigo-600 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-800">Employment Details</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                        <FileText className="text-indigo-500 mr-3" size={20} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500">Aadhar Number</p>
                          <p className="font-medium">{persona.additionalDetails.aadharNumber || "Not provided"}</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                        <Calendar className="text-indigo-500 mr-3" size={20} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500">Joining Date</p>
                          <p className="font-medium">{persona.additionalDetails.joiningDate || "Not provided"}</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                        <Calendar className="text-indigo-500 mr-3" size={20} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500">Probation End Date</p>
                          <p className="font-medium">{persona.additionalDetails.probationEndDate || "Not provided"}</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                        <Building2 className="text-indigo-500 mr-3" size={20} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500">Previous Employer</p>
                          <p className="font-medium">{persona.additionalDetails.previousEmployer || "Not provided"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Vendor Details */}
              {persona.type === "Vendors" && persona.additionalDetails &&  (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center mb-4">
                      <MapPin size={24} className="text-indigo-600 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-800">Address Information</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                        <MapPin className="text-indigo-500 mr-3" size={20} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="font-medium">{persona.additionalDetails.address || "Not provided"}</p>
                        </div>
                      </div>
                      
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-50 to-green-50 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center mb-4">
                      <FileText size={24} className="text-indigo-600 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-800">Business Details</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                        <FileText className="text-indigo-500 mr-3" size={20} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500">PAN Number</p>
                          <p className="font-medium">{persona.additionalDetails.panNumber || "Not provided"}</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                        <FileText className="text-indigo-500 mr-3" size={20} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500">GST Number</p>
                          <p className="font-medium">{persona.additionalDetails.gstNumber || "Not provided"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center mb-4">
                      <Building2 size={24} className="text-indigo-600 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-800">Bank Details</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                        <Building2 className="text-indigo-500 mr-3" size={20} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500">Bank Name</p>
                          <p className="font-medium">{persona.additionalDetails.bankName || "Not provided"}</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                        <FileText className="text-indigo-500 mr-3" size={20} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500">Account Number</p>
                          <p className="font-medium">{persona.additionalDetails.accountNumber || "Not provided"}</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                        <FileText className="text-indigo-500 mr-3" size={20} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500">IFSC Code</p>
                          <p className="font-medium">{persona.additionalDetails.ifscCode || "Not provided"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Customer Details */}
              {persona.type === "Customers" && persona.additionalDetails && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center mb-4">
                      <User size={24} className="text-indigo-600 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                        <User className="text-indigo-500 mr-3" size={20} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500">Age</p>
                          <p className="font-medium">{persona.additionalDetails.age || "Not provided"}</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                        <MapPin className="text-indigo-500 mr-3" size={20} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium">{persona.additionalDetails.location || "Not provided"}</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                        <Briefcase className="text-indigo-500 mr-3" size={20} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500">Job</p>
                          <p className="font-medium">{persona.additionalDetails.job || "Not provided"}</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                        <DollarSign className="text-indigo-500 mr-3" size={20} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500">Income</p>
                          <p className="font-medium">{persona.additionalDetails.income || "Not provided"}</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                        <Users className="text-indigo-500 mr-3" size={20} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500">Family Members</p>
                          <p className="font-medium">{persona.additionalDetails.familyMembers || "Not provided"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-50 to-green-50 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center mb-4">
                      <Activity size={24} className="text-indigo-600 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-800">Health & Mobility</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                        <Activity className="text-indigo-500 mr-3" size={20} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500">Weight</p>
                          <p className="font-medium">{persona.additionalDetails.weight || "Not provided"}</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                        <Activity className="text-indigo-500 mr-3" size={20} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500">Wheelchair Type</p>
                          <p className="font-medium">{persona.additionalDetails.wheelchairType || "Not provided"}</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                        <Activity className="text-indigo-500 mr-3" size={20} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500">Commute Range</p>
                          <p className="font-medium">{persona.additionalDetails.commute_range || "Not provided"}</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                        <Activity className="text-indigo-500 mr-3" size={20} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500">Commute Mode</p>
                          <p className="font-medium">{persona.additionalDetails.commuteMode || "Not provided"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center mb-4">
                      <MessageCircle size={24} className="text-indigo-600 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-800">Preferences & Needs</h3>
                    </div>
                    <div className="space-y-4">
                      {/* <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                        <MessageCircle className="text-indigo-500 mr-3" size={20} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500">Interests</p>
                          <p className="font-medium">{persona.additionalDetails.interests || "Not provided"}</p>
                        </div>
                      </div> */}
                      <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                        <MessageCircle className="text-indigo-500 mr-3" size={20} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500">User Type</p>
                          <p className="font-medium">{persona.additionalDetails.userType || "Not provided"}</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                        <MessageCircle className="text-indigo-500 mr-3" size={20} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500">Speed</p>
                          <p className="font-medium">{persona.additionalDetails.speed || "Not provided"}</p>
                        </div>
                      </div>
                      {/* <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                        <MessageCircle className="text-indigo-500 mr-3" size={20} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500">Common Place</p>
                          <p className="font-medium">{persona.additionalDetails.commonPlace || "Not provided"}</p>
                        </div>
                      </div> */}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-50 to-red-50 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center mb-4">
                      <AlertCircle size={24} className="text-indigo-600 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-800">Pain Points & Solutions</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                        <AlertCircle className="text-indigo-500 mr-3" size={20} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500">Pains Daily</p>
                          <p className="font-medium">{persona.additionalDetails.painsDaily || "Not provided"}</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                        <AlertCircle className="text-indigo-500 mr-3" size={20} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500">Pains Commute</p>
                          <p className="font-medium">{persona.additionalDetails.painsCommute || "Not provided"}</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                        <AlertCircle className="text-indigo-500 mr-3" size={20} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500">Solutions Needed</p>
                          <p className="font-medium">{persona.additionalDetails.solutionsNeeded || "Not provided"}</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                        <AlertCircle className="text-indigo-500 mr-3" size={20} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500">Customer Segment</p>
                          <p className="font-medium">{persona.additionalDetails.customerSegment || "Not provided"}</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                        <AlertCircle className="text-indigo-500 mr-3" size={20} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500">Expected Gain</p>
                          <p className="font-medium">{persona.additionalDetails.expectedGain || "Not provided"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Profile Picture Change Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-center">Change Profile Picture</h3>

            <div className="mb-6">
              <div className="flex justify-center mb-4">
                <img
                  src="/placeholder.svg?height=150&width=150"
                  alt="Current profile"
                  className="w-24 h-24 rounded-full border-4 border-gray-100 object-cover"
                />
              </div>

              <div className="mb-4">
                <p className="block text-sm font-medium text-gray-700 mb-2">Upload new image</p>
                <div className="flex items-center justify-center w-full">
                  <label className="w-full flex flex-col items-center px-4 py-6 bg-indigo-50 text-indigo-500 rounded-lg border-2 border-dashed border-indigo-200 hover:bg-indigo-100 cursor-pointer">
                    <Camera size={24} />
                    <span className="mt-2 text-sm text-indigo-500">Select a file</span>
                    <input type="file" className="hidden" accept="image/*" />
                  </label>
                </div>
              </div>

              <p className="text-sm text-gray-500 mt-2">
                Recommended: Square image, at least 300x300 pixels. Maximum size: 5MB.
              </p>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowImageModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </Button>
              <Button
                onClick={handleProfilePictureChange}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-center">Edit Profile</h3>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target as HTMLFormElement)
                const updatedProfile = {
                  ...persona,
                  name: formData.get("name") as string,
                  role: formData.get("role") as string,
                  department: formData.get("department") as string,
                  email: formData.get("email") as string,
                  phone: formData.get("phone") as string,
                  location: formData.get("location") as string,
                  about: formData.get("about") as string,
                }
                handleEditProfile(updatedProfile)
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={persona.name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input
                    type="text"
                    name="role"
                    defaultValue={persona.role}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input
                    type="text"
                    name="department"
                    defaultValue={persona.department}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={persona.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={persona.phone}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    defaultValue={persona.location}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
                  <textarea
                    name="about"
                    defaultValue={persona.about}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={4}
                    required
                  />
                </div>
              </div>

              {/* Save and Cancel Buttons */}
              <div className="flex justify-end space-x-2 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

