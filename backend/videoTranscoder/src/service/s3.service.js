import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { createWriteStream, readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import { pipeline } from 'stream/promises'
import { s3Client, s3Config } from '../config/s3.config.js'

export async function downloadFromS3(s3Key, localPath) {
  console.log(`Downloading ${s3Key} from S3 bucket: ${s3Config.bucket}`)
  const command = new GetObjectCommand({ Bucket: s3Config.bucket, Key: s3Key })
  const response = await s3Client.send(command)
  await pipeline(response.Body, createWriteStream(localPath))
  console.log('Download complete.')
}

export async function uploadDirectoryToS3(localDir, s3Prefix) {
  const files = readdirSync(localDir)
  for (const file of files) {
    const filePath = join(localDir, file)
    const key = join(s3Prefix, file)
    const fileContent = readFileSync(filePath)
    await s3Client.send(
      new PutObjectCommand({ Bucket: s3Config.bucket, Key: key, Body: fileContent })
    )
  }
  console.log('All files uploaded to S3.')
}
