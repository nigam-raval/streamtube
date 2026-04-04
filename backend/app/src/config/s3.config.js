import { S3Client } from '@aws-sdk/client-s3'
import { STSClient } from '@aws-sdk/client-sts'
import { env } from './env.config.js'

const s3Client = new S3Client({
  region: env.STORAGE_REGION,
  credentials: {
    accessKeyId: env.STORAGE_ACCESS_KEY,
    secretAccessKey: env.STORAGE_SECRET_KEY,
  },
  endpoint: env.STORAGE_ENDPOINT || undefined,
  forcePathStyle: env.STORAGE_FORCE_PATH_STYLE,
})

// External presign client: used ONLY to generate presigned URLs that Postman/browser can resolve
const s3PresignClient = new S3Client({
  region: env.STORAGE_REGION,
  credentials: {
    accessKeyId: env.STORAGE_ACCESS_KEY,
    secretAccessKey: env.STORAGE_SECRET_KEY,
  },
  endpoint: env.STORAGE_EXTERNAL_ENDPOINT || env.STORAGE_ENDPOINT || undefined,
  forcePathStyle: env.STORAGE_FORCE_PATH_STYLE,
})

const stsClient = new STSClient({
  region: env.STORAGE_REGION,
  credentials: {
    accessKeyId: env.STORAGE_STS_USER,
    secretAccessKey: env.STORAGE_STS_PASSWORD,
  },
  endpoint: env.STORAGE_ENDPOINT || undefined,
  forcePathStyle: env.STORAGE_FORCE_PATH_STYLE,
})

export { s3Client, s3PresignClient, stsClient }
