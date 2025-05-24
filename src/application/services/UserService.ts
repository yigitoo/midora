import { createClient } from "@supabase/supabase-js"

export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export class UserService {
  private supabase

  constructor() {
    this.supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  }

  async getCurrentUser(): Promise<User | null> {
    const {
      data: { user },
    } = await this.supabase.auth.getUser()

    if (!user) return null

    const { data, error } = await this.supabase.from("users").select("*").eq("id", user.id).single()

    if (error) return null
    return data
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const { data, error } = await this.supabase.from("users").update(updates).eq("id", userId).select().single()

    if (error) throw error
    return data
  }

  async signIn(email: string, password: string) {
    return await this.supabase.auth.signInWithPassword({
      email,
      password,
    })
  }

  async signUp(email: string, password: string, fullName?: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    return { data, error }
  }

  async signOut() {
    return await this.supabase.auth.signOut()
  }

  async resetPassword(email: string) {
    return await this.supabase.auth.resetPasswordForEmail(email)
  }
}
