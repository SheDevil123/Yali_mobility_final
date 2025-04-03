export type Persona = {
  id: string
  name: string
  type: string
  email?: string
  phone?: string
  location: string
  state?: string
  pinCode?: string
  message?: string
  added: string
  lastInteraction?: string
  isFavorite: boolean
  status?: string
  profilePhoto?: string

  // Common fields for all personas
  about?: string
  services?: string[]
  hobbies?: string[]

  // Employee specific fields
  role?: string
  department?: string
  dateOfBirth?: string
  fatherName?: string
  bloodGroup?: string
  emergencyContact?: string
  aadharNumber?: string
  joiningDate?: string
  probationEndDate?: string
  previousEmployer?: string

  // Vendor specific fields
  category?: string
  address?: string
  panNumber?: string
  gstNumber?: string
  bankName?: string
  accountNumber?: string
  ifscCode?: string

  // Customer specific fields
  revenue?: string
  age?: string
  job?: string
  income?: string
  familyMembers?: string
  weight?: string
  interests?: string
  userType?: string
  wheelchairType?: string
  commuteRange?: string
  commuteMode?: string
  speed?: string
  commonPlace?: string
  painsDaily?: string
  painsCommute?: string
  solutionsNeeded?: string
  customerSegment?: string
  expectedGain?: string

  // Investor specific fields
  investment?: string
}

