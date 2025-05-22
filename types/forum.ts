import { ObjectId } from "mongodb"

export const DEPTH_LIMIT = 5;
export interface Comment {
  _id: string
  content: string
  author: string
  uploadTime: string
  likes: number
  replies: Comment[]
  parentId?: string
  depth: number
  likedBy?: string[]
}

export interface ForumEntry {
  _id: string
  title: string
  content: string
  author: string
  uploadTime: string
  likes: number
  comments: Comment[]
  likedBy: string[]
  tags?: string[]
}

export interface ForumResponse {
  posts: ForumEntry[]
  totalPages: number
  currentPage: number
  totalEntries: number
}
