import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { createWriteStream, readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import { pipeline } from 'stream/promises'
import { s3 } from '../config/s3.config.js'
import { env } from '../config/env.config.js'

export async function downloadFromS3(s3Key, localPath) {
  console.log(`Downloading ${s3Key} from S3 bucket ${env.STORAGE_BUCKET}...`)
  const command = new GetObjectCommand({ Bucket: env.STORAGE_BUCKET, Key: s3Key })
  const response = await s3.send(command)
  await pipeline(response.Body, createWriteStream(localPath))
  console.log('Download complete.')
}

export async function uploadDirectoryToS3(localDir, s3Prefix) {
  const files = readdirSync(localDir)
  for (const file of files) {
    const filePath = join(localDir, file)
    const key = join(s3Prefix, file).replace(/\\/g, '/') // Fix Windows path issue
    const fileContent = readFileSync(filePath)
    await s3.send(new PutObjectCommand({ Bucket: env.STORAGE_BUCKET, Key: key, Body: fileContent }))
  }
  console.log('All files uploaded to S3.')
}
