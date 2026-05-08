import { S3Client } from '@aws-sdk/client-s3'
import { STSClient } from '@aws-sdk/client-sts'
import { env } from './env.config.js'

const s3Config = {
  region: env.STORAGE_REGION,
  bucket: env.STORAGE_BUCKET,
  credentials: {
    accessKeyId: env.STORAGE_ACCESS_KEY,
    secretAccessKey: env.STORAGE_SECRET_KEY,
  },
  stsCredentials: {
    accessKeyId: env.STORAGE_STS_USER,
    secretAccessKey: env.STORAGE_STS_PASSWORD,
  },
  endpoint: env.STORAGE_ENDPOINT || undefined,
  externalEndpoint: env.STORAGE_EXTERNAL_ENDPOINT,
  forcePathStyle: env.STORAGE_FORCE_PATH_STYLE,
  assumeRoleCommand: {
    RoleArn: 'arn:aws:iam::123456789012:role/test', // any string for MinIO
    RoleSessionName: 'minio-session',
    DurationSeconds: 900, // min 900 sec
  },
  putObjectCommand: { ChecksumAlgorithm: 'SHA256' },
}

const s3Client = new S3Client({
  region: s3Config.region,
  credentials: s3Config.credentials,
  endpoint: s3Config.endpoint,
  forcePathStyle: s3Config.forcePathStyle,
})

// External presign client: used ONLY to generate presigned URLs that Postman/browser can resolve
const s3PresignClient = new S3Client({
  region: s3Config.region,
  credentials: s3Config.credentials,
  endpoint: s3Config.externalEndpoint || s3Config.endpoint,
  forcePathStyle: s3Config.forcePathStyle,
})

const stsClient = new STSClient({
  region: s3Config.region,
  credentials: s3Config.stsCredentials,
  endpoint: s3Config.endpoint,
  forcePathStyle: s3Config.forcePathStyle,
})

export { s3Config, s3Client, s3PresignClient, stsClient }
