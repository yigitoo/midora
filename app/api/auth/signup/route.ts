import { NextResponse } from 'next/server'
import clientPromise from '@/lib/database'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// POST signup
export async function POST(request: Request) {
  try {
    const { email, password, name, username } = await request.json()

    // Input validation
    if (!email || !password || !name || !username) {
      return NextResponse.json(
        { error: 'Bütün kişisel bilgileri doldurmadınız.' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db('midora')

    // Check if email exists
    const emailExists = await db.collection('users').findOne({ email })
    if (emailExists) {
      return NextResponse.json(
        { error: 'Bu mail adresi zaten başka bir hesap tarafından kullanılıyor.' },
        { status: 409 }
      )
    }

    // Check if username exists
    const usernameExists = await db.collection('users').findOne({ username })
    if (usernameExists) {
      return NextResponse.json(
        { error: 'Bu kullanıcı adı zaten başka bir hesapta kullanılıyor.' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const result = await db.collection('users').insertOne({
      email,
      username,
      password: hashedPassword,
      name,
      bio: '',
      location: '',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    // Create token
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
        username,
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

