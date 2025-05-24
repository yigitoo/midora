export interface User {
  id: string
  email: string
  username: string
  fullName?: string
  avatarUrl?: string
  bio?: string
  isVerified: boolean
  isAdmin: boolean
  createdAt: Date
  updatedAt: Date
}

export interface UserProfile {
  id: string
  userId: string
  investmentExperience: "beginner" | "intermediate" | "advanced" | "expert"
  riskTolerance: "conservative" | "moderate" | "aggressive"
  preferredExchanges: string[]
  notificationPreferences: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserRequest {
  email: string
  username: string
  fullName?: string
  password: string
}

export interface UpdateUserRequest {
  fullName?: string
  bio?: string
  avatarUrl?: string
}
