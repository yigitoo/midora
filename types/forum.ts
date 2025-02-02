import { ObjectId } from "mongodb"

export interface Comment {
  _id: string
  content: string
  author: string
  uploadTime: string
  likes: number
  replies: Comment[]
  parentId?: string
  depth: number
}

export interface ForumEntry {
  _id: string
  title: string
  content: string
  author: string
  uploadTime: string
  likes: number
  comments: Comment[]
}

interface ForumResponse {
  posts: ForumEntry[];
  totalPages: number;
  currentPage: number;
}

export type { ForumResponse};
