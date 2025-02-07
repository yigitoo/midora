import { NextResponse } from 'next/server'
import clientPromise from '@/lib/database'
import bcrypt from 'bcryptjs'
import { ObjectId } from 'mongodb'

export async function POST(request: Request) {
  try {
    const { name, username, email, password } = await request.json()

    const client = await clientPromise
    const db = client.db('midora')

    // Check if user already exists
    let existingUser = await db.collection('users').findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu email adresi ile kayıtlı bir kullanıcı zaten var.' },
        { status: 400 }
      )
    }

    existingUser = await db.collection('users').findOne({ username })
    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu kullanıcı adı ile kayıtlı bir kullanıcı zaten var.' },
        { status: 400 }
      )
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const newUser = {
      _id: new ObjectId(),
      name,
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await db.collection('users').insertOne(newUser)

    return NextResponse.json({ message: 'Kullanıcı başarıyla oluşturuldu.' }, { status: 201 })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
