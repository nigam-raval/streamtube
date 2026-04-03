import mongoose from 'mongoose'
import { env } from './env.config.js'

const connectMongoDb = async () => {
  await mongoose.connect(
    `${env.MONGODB_URI}/${env.MONGODB_NAME}?authSource=${env.MONGODB_AUTH_SOURCE}`,
    {
      serverSelectionTimeoutMS: 5000,
    }
  )
}

export default connectMongoDb
