import { S3Client } from '@aws-sdk/client-s3'
import { env } from './env.config.js'

export const s3Client = new S3Client({
  region: env.STORAGE_REGION,
  credentials: {
    accessKeyId: env.STORAGE_ACCESS_KEY,
    secretAccessKey: env.STORAGE_SECRET_KEY,
  },
  requestTimeout: 360000,
  endpoint: env.STORAGE_ENDPOINT || undefined,
  forcePathStyle: env.STORAGE_FORCE_PATH_STYLE,
})
