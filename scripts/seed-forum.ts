import { MongoClient } from 'mongodb'

const seedData = Array(30).fill(null).map((_, i) => ({
  id: i + 1,
  title: `Forum Başlığı ${i + 1}`,
  content: `Bu ${i + 1}. gönderinin içeriğidir. Lorem ipsum dolor sit amet...`,
  author: `User${Math.floor(Math.random() * 10) + 1}`,
  uploadTime: new Date(Date.now() - Math.random() * 10000000000)
}))

async function seedDatabase() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI!)
    const db = client.db('midora')

    await db.collection('forum_posts').deleteMany({})
    const result = await db.collection('forum_posts').insertMany(seedData)

    console.log(`Seeded ${result.insertedCount} forum posts`)
    client.close()
  } catch (error) {
    console.error('Seeding error:', error)
  }
}

seedDatabase()
