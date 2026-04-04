import { env } from '../config/env.config.js'

export function removeBucketName(s3Key) {
  const replaceString = env.STORAGE_BUCKET + '/'
  const newKey = s3Key.replace(replaceString, '')
  return newKey
}
