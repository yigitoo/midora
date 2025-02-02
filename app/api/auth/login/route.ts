import { NextResponse } from 'next/server'
import clientPromise from '@/lib/database'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    const client = await clientPromise
    const db = client.db('midora')

    // Check if account is suspended
    const isSuspended = await db.collection('suspended_accounts').findOne({ email })
    if (isSuspended) {
      return NextResponse.json({
        error: 'Account suspended',
        suspendedAt: isSuspended.createdAt,
        suspensionReason: isSuspended.reason,
        suspendedUntil: isSuspended.until
      }, { status: 403 })
    }

    // Find user
    const user = await db.collection('users').findOne({ email })
    if (!user) {
      return NextResponse.json(
        { error: 'Yanlış bilgiler girildi. Bilgilerinizi kontrol ediniz.' },
        { status: 401 }
      )
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Yanlış bilgiler girildi. Bilgilerinizi kontrol ediniz.' },
        { status: 401 }
      )
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id, email: user.email, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    )

    // Return user data and token
    return NextResponse.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        username: user.username,
        bio: user.bio,
        location: user.location,
        createdAt: user.createdAt
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
