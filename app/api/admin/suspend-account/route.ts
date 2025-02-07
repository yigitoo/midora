import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const { email, reason, until, adminToken } = await request.json()

    // Verify admin token here
    if (adminToken !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db('midora')

    await db.collection('suspended_accounts').updateOne(
      { email },
      {
        $set: {
          email,
          reason,
          until: new Date(until),
          createdAt: new Date()
        }
      },
      { upsert: true }
    )

    return NextResponse.json({ message: 'Account suspended successfully' })

  } catch (error) {
    console.error('Suspension error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
