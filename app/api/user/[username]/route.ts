import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
  try {
    const username = params.username

    const client = await clientPromise
    const db = client.db("midora")

    // Find user by username
    const user = await db.collection("users").findOne(
      { username },
      { projection: { password: 0 } }, // Exclude password from response
    )

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get user's forum posts
    const posts = await db
      .collection("forum_posts")
      .find({ author: username })
      .sort({ uploadTime: -1 })
      .limit(5)
      .toArray()

    // Get user's portfolio if it exists
    const portfolio = await db.collection("user_portfolios").findOne({ userId: user._id.toString() })

    return NextResponse.json({
      user: {
        ...user,
        _id: user._id.toString(),
      },
      recentPosts: posts.map((post) => ({
        ...post,
        _id: post._id.toString(),
      })),
      portfolio: portfolio
        ? {
            ...portfolio,
            _id: portfolio._id.toString(),
          }
        : null,
    })
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 })
  }
}
