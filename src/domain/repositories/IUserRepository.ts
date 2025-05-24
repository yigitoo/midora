import type { User, UserProfile, CreateUserRequest, UpdateUserRequest } from "../entities/User"

export interface IUserRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findByUsername(username: string): Promise<User | null>
  create(userData: CreateUserRequest): Promise<User>
  update(id: string, userData: UpdateUserRequest): Promise<User>
  delete(id: string): Promise<void>

  // Profile methods
  getProfile(userId: string): Promise<UserProfile | null>
  createProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile>
  updateProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile>
}
