import { s3Config, s3Client, s3PresignClient, stsClient } from '../config/s3.config.js'
import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import fs from 'fs'
import { ApiError } from '../utils/ApiError.js'
import { AssumeRoleCommand } from '@aws-sdk/client-sts'

const uploadObjectOnS3 = async function (file, Key) {
  try {
    const fileBuffer = fs.readFileSync(file.path)

    const command = new PutObjectCommand({
      Bucket: s3Config.bucket,
      Key: Key,
      ContentType: file.mimetype,
      Body: fileBuffer,
    })

    await s3Client.send(command)
    return {
      Key,
      url: `${s3Config.externalEndpoint}/${s3Config.bucket}/${Key}`,
    }
  } catch (error) {
    throw new ApiError(500, `uploadOnS3 error: ${error}`)
  }
}

const generatePresignedDownloadUrl = async function (Key, time = '300') {
  try {
    const command = new GetObjectCommand({
      Bucket: s3Config.bucket,
      Key,
    })
    let url = await getSignedUrl(s3PresignClient, command, { expiresIn: time })

    return url
  } catch (error) {
    throw new ApiError(500, `downloadOnS3 error: ${error}`)
  }
}

const generatePresignedUploadUrl = async function (
  ContentType,
  ContentLength,
  ChecksumSHA256,
  Key,
  time = '300'
) {
  try {
    const command = new PutObjectCommand({
      Bucket: s3Config.bucket,
      Key,
      ContentType,
      ContentLength,
      ChecksumSHA256, // use Base64
      ChecksumAlgorithm: s3Config.putObjectCommand.ChecksumAlgorithm,
    })

    let uploadUrl = await getSignedUrl(s3PresignClient, command, {
      expiresIn: time,
      signableHeaders: new Set(['content-type', 'content-length', 'host']),
    })

    return uploadUrl
  } catch (error) {
    throw new ApiError(500, `PresignedUploadUrl of S3 error: ${error}`)
  }
}

const deleteObjectOnS3 = async function (Key) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: s3Config.bucket,
      Key,
    })
    const del = await s3Client.send(command)
    return del
  } catch (error) {
    throw new ApiError(500, `deleteOnS3 error: ${error}`)
  }
}

const listObjectsByPrefixOnS3 = async function (Prefix) {
  try {
    const list = await s3Client.send(
      new ListObjectsV2Command({
        Bucket: s3Config.bucket,
        Prefix,
      })
    )

    if (!list.KeyCount) {
      return []
    }

    return list
  } catch (error) {
    throw new ApiError(500, `listing by prefix on s3 error: ${error}`)
  }
}

const deleteByPrefixOnS3 = async function (Prefix) {
  try {
    const list = await listObjectsByPrefixOnS3(Prefix)
    if (list.KeyCount > 0) {
      const objectsToDelete = list.Contents.map((x) => ({ Key: x.Key }))

      const del = await s3Client.send(
        new DeleteObjectsCommand({
          Bucket: s3Config.bucket,
          Delete: { Objects: objectsToDelete },
        })
      )
      return del
    } else {
      return null
    }
  } catch (error) {
    throw new ApiError(500, `deleting by prefix error: ${error}`)
  }
}

const stsOnS3 = async function () {
  try {
    const command = new AssumeRoleCommand({
      RoleArn: s3Config.assumeRoleCommand.RoleArn,
      RoleSessionName: s3Config.assumeRoleCommand.RoleSessionName,
      DurationSeconds: s3Config.assumeRoleCommand.DurationSeconds,
    })

    const res = await stsClient.send(command)

    return {
      credentials: res.Credentials,
      endpoint: s3Config.externalEndpoint || s3Config.endpoint,
      region: s3Config.region,
      forcePathStyle: s3Config.forcePathStyle,
      bucket: s3Config.bucket,
    }
  } catch (error) {
    throw new ApiError(500, `STS error: ${error}`)
  }
}

export {
  uploadObjectOnS3,
  generatePresignedUploadUrl,
  generatePresignedDownloadUrl,
  deleteObjectOnS3,
  deleteByPrefixOnS3,
  listObjectsByPrefixOnS3,
  stsOnS3,
}
