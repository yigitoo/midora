import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

interface TokenPayload {
  userId: string;
  username: string;
  email: string;
}

export async function getToken(request: NextRequest) {
   try {
    // Try to get token from Authorization header
    const authHeader = request.headers.get('Authorization')
    let token = authHeader?.split(' ')[1]

    // If no token in header, try cookies
    if (!token) {
      const cookieStore = cookies()
      token = cookieStore.get('token')?.value
    }

    if (!token) {
      return null
    }

    // Verify and decode token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as TokenPayload

    if (!decoded?.userId || !decoded?.username) {
      return null
    }

    return {
      userId: decoded.userId,
      username: decoded.username,
      email: decoded.email
    }

  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}
