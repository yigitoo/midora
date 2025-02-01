import { NextResponse } from 'next/server'
import clientPromise from '@/lib/database'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'

// GET user data
export async function GET(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1]

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    const client = await clientPromise
    const db = client.db('midora')

    const user = await db.collection('users').findOne(
      { _id: new ObjectId(decoded.userId) },
      { projection: { password: 0 } } // Exclude password from response
    )

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// UPDATE user data
export async function PUT(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1]

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    const { name, bio, location } = await request.json()

    const client = await clientPromise
    const db = client.db('midora')

    const result = await db.collection('users').findOneAndUpdate(
      { _id: new ObjectId(decoded.userId) },
      {
        $set: {
          name,
          bio,
          location,
          updatedAt: new Date()
        }
      },
      {
        returnDocument: 'after',
        projection: { password: 0 }
      }
    )

    if (!result) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json({ error: 'İç sunucu hatası' }, { status: 500 })
  }
}
