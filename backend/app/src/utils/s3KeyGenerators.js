import { getExtensionFromMime } from './mime.js'
import { env } from '../config/env.config.js'

function generateUserProfileImageKey(userId, mimeType) {
  const fileExtension = getExtensionFromMime(mimeType)
  return `users/${userId}/profile.${fileExtension}`
}

function generateUserCoverImageKey(userId, mimeType) {
  const fileExtension = getExtensionFromMime(mimeType)
  return `users/${userId}/cover.${fileExtension}`
}

function generateThumbnailKey(userId, videoId, mimeType) {
  const fileExtension = getExtensionFromMime(mimeType)
  return `users/${userId}/${videoId}/thumbnail.${fileExtension}`
}

function generateTempVideoKey(userId, videoId, mimeType) {
  const fileExtension = getExtensionFromMime(mimeType)
  return `private/users/${userId}/${videoId}/tempVideo.${fileExtension}`
}

function generateVideoKey(userId, videoId) {
  return `users/${userId}/${videoId}/`
}

function generateUrl(Key) {
  if (env.STORAGE_EXTERNAL_ENDPOINT) {
    return `${env.STORAGE_EXTERNAL_ENDPOINT}/${env.STORAGE_BUCKET}/${Key}`
  } else {
    return `${env.STORAGE_ENDPOINT}/${env.STORAGE_BUCKET}/${Key}`
  }
}

export {
  generateUserProfileImageKey,
  generateUserCoverImageKey,
  generateThumbnailKey,
  generateTempVideoKey,
  generateVideoKey,
  generateUrl,
}
