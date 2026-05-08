import { S3Client } from '@aws-sdk/client-s3'
import { env } from './env.config.js'

export const s3Config = {
  region: env.STORAGE_REGION,
  credentials: {
    accessKeyId: env.STORAGE_ACCESS_KEY,
    secretAccessKey: env.STORAGE_SECRET_KEY,
  },
  requestTimeout: 360000,
  endpoint: env.STORAGE_ENDPOINT || undefined,
  forcePathStyle: env.STORAGE_FORCE_PATH_STYLE,
  bucket: env.STORAGE_BUCKET,
}

export const s3Client = new S3Client({
  region: s3Config.region,
  credentials: {
    accessKeyId: s3Config.credentials.accessKeyId,
    secretAccessKey: s3Config.credentials.secretAccessKey,
  },
  requestTimeout: s3Config.requestTimeout,
  endpoint: s3Config.endpoint,
  forcePathStyle: s3Config.forcePathStyle,
})
