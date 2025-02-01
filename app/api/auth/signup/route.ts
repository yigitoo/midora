import { NextResponse } from 'next/server'
import clientPromise from '@/lib/database'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    // Input validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db('midora')

    // Check if user exists
    const existingUser = await db.collection('users').findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const result = await db.collection('users').insertOne({
      email,
      password: hashedPassword,
      name,
      bio: '',
      location: '',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    // Generate token
    const token = jwt.sign(
      { userId: result.insertedId, email },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    )

    return NextResponse.json({
      token,
      user: {
        id: result.insertedId,
        email,
        name,
        createdAt: new Date()
      }
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
