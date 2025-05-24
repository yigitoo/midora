import { supabase } from "../database/supabase"
import type { IUserRepository } from "../../domain/repositories/IUserRepository"
import type { User, UserProfile, CreateUserRequest, UpdateUserRequest } from "../../domain/entities/User"

export class SupabaseUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const { data, error } = await supabase.from("users").select("*").eq("id", id).single()

    if (error || !data) return null

    return this.mapToUser(data)
  }

  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase.from("users").select("*").eq("email", email).single()

    if (error || !data) return null

    return this.mapToUser(data)
  }

  async findByUsername(username: string): Promise<User | null> {
    const { data, error } = await supabase.from("users").select("*").eq("username", username).single()

    if (error || !data) return null

    return this.mapToUser(data)
  }

  async create(userData: CreateUserRequest): Promise<User> {
    const { data, error } = await supabase
      .from("users")
      .insert({
        email: userData.email,
        username: userData.username,
        full_name: userData.fullName,
      })
      .select()
      .single()

    if (error) throw new Error(`Failed to create user: ${error.message}`)

    return this.mapToUser(data)
  }

  async update(id: string, userData: UpdateUserRequest): Promise<User> {
    const { data, error } = await supabase
      .from("users")
      .update({
        full_name: userData.fullName,
        bio: userData.bio,
        avatar_url: userData.avatarUrl,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw new Error(`Failed to update user: ${error.message}`)

    return this.mapToUser(data)
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("users").delete().eq("id", id)

    if (error) throw new Error(`Failed to delete user: ${error.message}`)
  }

  async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase.from("user_profiles").select("*").eq("user_id", userId).single()

    if (error || !data) return null

    return this.mapToUserProfile(data)
  }

  async createProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> {
    const { data, error } = await supabase
      .from("user_profiles")
      .insert({
        user_id: userId,
        investment_experience: profileData.investmentExperience,
        risk_tolerance: profileData.riskTolerance,
        preferred_exchanges: profileData.preferredExchanges,
        notification_preferences: profileData.notificationPreferences,
      })
      .select()
      .single()

    if (error) throw new Error(`Failed to create user profile: ${error.message}`)

    return this.mapToUserProfile(data)
  }

  async updateProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> {
    const { data, error } = await supabase
      .from("user_profiles")
      .update({
        investment_experience: profileData.investmentExperience,
        risk_tolerance: profileData.riskTolerance,
        preferred_exchanges: profileData.preferredExchanges,
        notification_preferences: profileData.notificationPreferences,
      })
      .eq("user_id", userId)
      .select()
      .single()

    if (error) throw new Error(`Failed to update user profile: ${error.message}`)

    return this.mapToUserProfile(data)
  }

  private mapToUser(data: any): User {
    return {
      id: data.id,
      email: data.email,
      username: data.username,
      fullName: data.full_name,
      avatarUrl: data.avatar_url,
      bio: data.bio,
      isVerified: data.is_verified,
      isAdmin: data.is_admin,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    }
  }

  private mapToUserProfile(data: any): UserProfile {
    return {
      id: data.id,
      userId: data.user_id,
      investmentExperience: data.investment_experience,
      riskTolerance: data.risk_tolerance,
      preferredExchanges: data.preferred_exchanges || [],
      notificationPreferences: data.notification_preferences || {},
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    }
  }
}
