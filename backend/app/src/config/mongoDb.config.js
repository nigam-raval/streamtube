import mongoose from 'mongoose'
import { env } from './env.config.js'

const connectMongoDb = async () => {
  await mongoose.connect(`${env.MONGODB_URI}/${env.DB_NAME}?authSource=${env.AUTH_SOURCE}`, {
    serverSelectionTimeoutMS: 5000,
  })
}

export default connectMongoDb
