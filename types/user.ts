export interface User {
  id: string
  email: string
  username: string
  name: string
  bio?: string | null
  location?: string | null
  createdAt?: Date
  updatedAt?: Date
}
