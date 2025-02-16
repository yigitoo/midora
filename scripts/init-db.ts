import { MongoClient } from 'mongodb'
import 'dotenv/config'


const uri = process.env.MONGODB_URI
const options = {}

let client
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

async function initDB() {

  const client = await clientPromise.then()

  client.db('midora').collection('users').createIndex({ email: 1 }, { unique: true })
  client.db('midora').collection('users').createIndex({ username: 1 }, { unique: true })

  client.db('midora').createCollection('suspended_accounts')
  client.db('midora').collection('suspended_accounts').createIndex({ "email": 1 }, { unique: true })

  return client;

}

initDB();
