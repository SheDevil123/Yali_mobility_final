"use client"

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Checkbox } from "../components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
// import type { Persona } from "../types/persona"
import { Textarea } from "../components/ui/textarea"
import axios from "axios"

interface FormValues {
  // Define the fields expected in the form
  name: string;
  age: number;
  // Add other fields as needed
}

// Update the Zod schema to include the new fields for each persona type
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }).optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  state: z.string().optional().or(z.literal("")),
  pinCode: z.string().optional().or(z.literal("")),
  message: z.string().optional().or(z.literal("")),
  type: z.enum(["Vendors", "Employees", "Customers", "Others"], {
    required_error: "Please select a persona type.",
  }),
  profilePhoto: z.any().optional(),
  // Vendor specific fields
  address: z.string().optional().or(z.literal("")),
  panNumber: z.string().optional().or(z.literal("")),
  gstNumber: z.string().optional().or(z.literal("")),
  bankName: z.string().optional().or(z.literal("")),
  accountNumber: z.string().optional().or(z.literal("")),
  ifscCode: z.string().optional().or(z.literal("")),
  // Employee specific fields
  dateOfBirth: z.string().optional().or(z.literal("")),
  fatherName: z.string().optional().or(z.literal("")),
  bloodGroup: z.string().optional().or(z.literal("")),
  emergencyContact: z.string().optional().or(z.literal("")),
  aadharNumber: z.string().optional().or(z.literal("")),
  joiningDate: z.string().optional().or(z.literal("")),
  probationEndDate: z.string().optional().or(z.literal("")),
  previousEmployer: z.string().optional().or(z.literal("")),
  // User specific fields
  age: z.string().optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
  job: z.string().optional().or(z.literal("")),
  income: z.string().optional().or(z.literal("")),
  familyMembers: z.string().optional().or(z.literal("")),
  weight: z.string().optional().or(z.literal("")),
  interests: z.string().optional().or(z.literal("")),
  userType: z.string().optional().or(z.literal("")),
  wheelchairType: z.string().optional().or(z.literal("")),
  commuteRange: z.string().optional().or(z.literal("")),
  commuteMode: z.string().optional().or(z.literal("")),
  speed: z.string().optional().or(z.literal("")),
  commonPlace: z.string().optional().or(z.literal("")),
  painsDaily: z.string().optional().or(z.literal("")),
  painsCommute: z.string().optional().or(z.literal("")),
  solutionsNeeded: z.string().optional().or(z.literal("")),
  customerSegment: z.string().optional().or(z.literal("")),
  expectedGain: z.string().optional().or(z.literal("")),
  isFavorite: z.boolean().default(false),
})

interface AddPersonaModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (newPersona: FormValues) => Promise<void>;
}


const AddPersonaModal = ({ isOpen, onClose, onAdd }: AddPersonaModalProps) => {
  const [activeTab, setActiveTab] = useState("basic")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      state: "",
      pinCode: "",
      message: "",
      type: "Employees",
      profilePhoto: null,
      // Vendor specific
      address: "",
      panNumber: "",
      gstNumber: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      // Employee specific
      dateOfBirth: "",
      fatherName: "",
      bloodGroup: "",
      emergencyContact: "",
      aadharNumber: "",
      joiningDate: "",
      probationEndDate: "",
      previousEmployer: "",
      // User specific
      age: "",
      location: "",
      job: "",
      income: "",
      familyMembers: "",
      weight: "",
      interests: "",
      userType: "",
      speed:"",
      wheelchairType: "",
      commuteRange: "",
      commuteMode: "",
      painsDaily: "",
      painsCommute: "",
      solutionsNeeded: "",
      customerSegment: "",
      isFavorite: false,
    },
  })


  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData();

      // ✅ Append Basic Info
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("state", data.state || "");
      formData.append("pinCode", data.pinCode || "");
      formData.append("message", data.message || "");
      formData.append("type", data.type);
      formData.append("isFavorite", data.isFavorite.toString());

      // ✅ Append Profile Photo (Only If Selected)
      if (data.profilePhoto instanceof File) {
        formData.append("profilePhoto", data.profilePhoto);
      }

      // ✅ Append Additional Fields Based on Selected Type
      if (data.type === "Vendors") {
        formData.append("address", data.address || "");
        formData.append("panNumber", data.panNumber || "");
        formData.append("gstNumber", data.gstNumber || "");
        formData.append("bankName", data.bankName || "");
        formData.append("accountNumber", data.accountNumber || "");
        formData.append("ifscCode", data.ifscCode || "");
      } else if (data.type === "Employees") {
        formData.append("dateOfBirth", data.dateOfBirth || "");
        formData.append("fatherName", data.fatherName || "");
        formData.append("bloodGroup", data.bloodGroup || "");
        formData.append("emergencyContact", data.emergencyContact || "");
        formData.append("aadharNumber", data.aadharNumber || "");
        formData.append("joiningDate", data.joiningDate || "");
        formData.append("probationEndDate", data.probationEndDate || "");
        formData.append("previousEmployer", data.previousEmployer || "");
      } else if (data.type === "Customers") {
        // formData.append("age", data.age || "");
        formData.append("location", data.location || "");
        formData.append("job", data.job || "");
        formData.append("income", data.income || "");
        formData.append("age", data.age ? parseInt(data.age, 10).toString() : "null");
        formData.append("familyMembers", data.familyMembers ? String(data.familyMembers) : "null");
        formData.append("weight", data.weight ? parseInt(data.weight, 10).toString() : "null");
        formData.append("userType", data.userType || "");
        formData.append("speed", data.speed || "");
        formData.append("wheelchairType", data.wheelchairType || "");
        formData.append("commuteRange", data.commuteRange || "");
        formData.append("commuteMode", data.commuteMode || "");
        formData.append("painsDaily", data.painsDaily || "");
        formData.append("painsCommute", data.painsCommute || "");
        formData.append("solutionsNeeded", data.solutionsNeeded || "");
        formData.append("customerSegment", data.customerSegment || "");
        formData.append("expectedGain", data.expectedGain || "");
      }

      // ✅ Debugging - Log FormData
      console.log("🚀 FormData being sent:", [...formData.entries()]);

      // ✅ Make API Call
      const response = await axios.post("http://localhost:5000/api/personas", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ Persona added successfully:", response.data);

      // ✅ Call onAdd to update UI instantly
      await onAdd(response.data.data);

      // Reset the form after submission
      form.reset();

      // ✅ Close Modal After Submission
      onClose();
    } catch (error) {
      console.error("❌ Error adding persona:", error);
    }
  };

  // Reset the form when the modal is closed
  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen]);



  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Persona</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Additional Details</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="Karnataka" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pinCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PIN Code</FormLabel>
                      <FormControl>
                        <Input placeholder="560001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Persona Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue="select">
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="select">Select</SelectItem>
                          <SelectItem value="Employees">Employee</SelectItem>
                          <SelectItem value="Vendors">Vendor</SelectItem>
                          <SelectItem value="Customers">Customer</SelectItem>
                          <SelectItem value="Others">Others</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="profilePhoto"
                  render={({ field }) => {
                    const [preview, setPreview] = useState(null);

                    useEffect(() => {
                      if (field.value instanceof File) {
                        const objectUrl = URL.createObjectURL(field.value);
                        setPreview(objectUrl);

                        return () => URL.revokeObjectURL(objectUrl); // Cleanup
                      }
                    }, [field.value]);

                    return (
                      <FormItem>
                        <FormLabel>Profile Photo</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-4">
                            {/* Show Image Preview */}
                            {preview && (
                              <img
                                src={preview}
                                alt="Profile Preview"
                                className="w-16 h-16 rounded-full object-cover border"
                              />
                            )}
                            <div>
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  if (e.target.files?.[0]) {
                                    field.onChange(e.target.files[0]); // Update form value
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message/Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Any additional notes..." {...field} className="resize-none" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isFavorite"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Add to Favorites</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                {form.watch("type") === "Vendors" && (
                  <div className="space-y-4">
                    <h3 className="font-medium text-sm text-muted-foreground">Vendor Details</h3>

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Full address..." {...field} className="resize-none" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="panNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>PAN Number</FormLabel>
                            <FormControl>
                              <Input placeholder="ABCDE1234F" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="gstNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>GST Number</FormLabel>
                            <FormControl>
                              <Input placeholder="29ABCDE1234F1Z5" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <h3 className="font-medium text-sm text-muted-foreground mt-4">Bank Details</h3>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="bankName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bank Name</FormLabel>
                            <FormControl>
                              <Input placeholder="HDFC Bank" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="accountNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Number</FormLabel>
                            <FormControl>
                              <Input placeholder="1234567890" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="ifscCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>IFSC Code</FormLabel>
                            <FormControl>
                              <Input placeholder="HDFC0001234" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {form.watch("type") === "Employees" && (
                  <div className="space-y-4">
                    <h3 className="font-medium text-sm text-muted-foreground">Personal Details</h3>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="fatherName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Father's Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe Sr." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bloodGroup"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Blood Group</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select blood group" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="A+">A+</SelectItem>
                                <SelectItem value="A-">A-</SelectItem>
                                <SelectItem value="B+">B+</SelectItem>
                                <SelectItem value="B-">B-</SelectItem>
                                <SelectItem value="AB+">AB+</SelectItem>
                                <SelectItem value="AB-">AB-</SelectItem>
                                <SelectItem value="O+">O+</SelectItem>
                                <SelectItem value="O-">O-</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="emergencyContact"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Emergency Contact</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 (555) 987-6543" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <h3 className="font-medium text-sm text-muted-foreground mt-4">ID Details</h3>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="panNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>PAN Number</FormLabel>
                            <FormControl>
                              <Input placeholder="ABCDE1234F" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="aadharNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Aadhar Number</FormLabel>
                            <FormControl>
                              <Input placeholder="1234 5678 9012" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <h3 className="font-medium text-sm text-muted-foreground mt-4">Employment Details</h3>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="joiningDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Joining Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="probationEndDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Probation End Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="previousEmployer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Previous Employer</FormLabel>
                            <FormControl>
                              <Input placeholder="ABC Corporation" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {form.watch("type") === "Customers" && (
                  <div className="space-y-4">
                    <h3 className="font-medium text-sm text-muted-foreground">Customer Demographics</h3>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" placeholder="35" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input placeholder="Bengaluru" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="job"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job/Occupation</FormLabel>
                            <FormControl>
                              <Input placeholder="Software Engineer" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="income"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Income Range</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select income range" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="0-3L">₹0 - ₹3,00,000</SelectItem>
                                <SelectItem value="3-6L">₹3,00,000 - ₹6,00,000</SelectItem>
                                <SelectItem value="6-10L">₹6,00,000 - ₹10,00,000</SelectItem>
                                <SelectItem value="10-15L">₹10,00,000 - ₹15,00,000</SelectItem>
                                <SelectItem value="15L+">₹15,00,000+</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="familyMembers"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Family Members</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" placeholder="4" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weight (kg)</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" placeholder="70" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <h3 className="font-medium text-sm text-muted-foreground mt-4">Mobility & Commute</h3>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="wheelchairType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Wheelchair Type</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select wheelchair type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="manual">Manual</SelectItem>
                                <SelectItem value="power">Power</SelectItem>
                                <SelectItem value="specialized">Specialized</SelectItem>
                                <SelectItem value="none">None</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="speed"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Speed</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" placeholder="Enter speed (e.g., 10 km/h)" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="userType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>User Type</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter user type (e.g., Regular, Premium)" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="commuteRange"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Daily Commute Range (km)</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" placeholder="10" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="commuteMode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Commute Mode</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select commute mode" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Public Transport">Public Transport</SelectItem>
                                <SelectItem value="Private Vehicle">Private Vehicle</SelectItem>
                                <SelectItem value="Taxi/Ride-sharing">Taxi/Ride-sharing</SelectItem>
                                <SelectItem value="Walking">Walking</SelectItem>
                                <SelectItem value="Wheelchair">Wheelchair</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <h3 className="font-medium text-sm text-muted-foreground mt-4">Challenges & Needs</h3>

                    <FormField
                      control={form.control}
                      name="painsDaily"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Daily Challenges</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe daily mobility challenges..."
                              {...field}
                              className="resize-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="painsCommute"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Commute Challenges</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe commute-specific challenges..."
                              {...field}
                              className="resize-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="solutionsNeeded"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Solutions Needed</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="What solutions would help this customer?"
                              {...field}
                              className="resize-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="customerSegment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Customer Segment</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter customer segment (e.g., High Income, Students)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="expectedGain"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expected Gain</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the expected gain for this customer..."
                              {...field}
                              className="resize-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Add Persona</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddPersonaModal;