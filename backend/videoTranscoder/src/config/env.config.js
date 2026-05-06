import dotenv from 'dotenv'
dotenv.config({ quiet: true })

// skip checking below variable in 'requiredVariables' as default value is provide
// SKIP_ENV_VALIDATION
// STORAGE_FORCE_PATH_STYLE
const requiredVariables = [
  'STORAGE_REGION',
  'STORAGE_ACCESS_KEY',
  'STORAGE_SECRET_KEY',
  'STORAGE_BUCKET',
  'STORAGE_ENDPOINT',
  'RABBITMQ_URL',
  'RABBITMQ_VIDEO_PROCESSING_QUEUE',
]

const missingVariables = requiredVariables.filter((Variable) => !process.env[Variable])

const SKIP_ENV_VALIDATION = process.env.SKIP_ENV_VALIDATION?.toLowerCase() === 'true'

if (missingVariables.length > 0 && SKIP_ENV_VALIDATION != true) {
  console.error(`Missing required ENV variables: ${missingVariables.join(', ')}\nexiting`)
  process.exit(1)
}

const {
  STORAGE_ENDPOINT,
  STORAGE_REGION,
  STORAGE_BUCKET,
  STORAGE_ACCESS_KEY,
  STORAGE_SECRET_KEY,
  RABBITMQ_VIDEO_PROCESSING_QUEUE,
  RABBITMQ_URL,
} = process.env

const STORAGE_FORCE_PATH_STYLE =
  String(process.env.STORAGE_FORCE_PATH_STYLE).toLowerCase() === 'true'

// not exporting SKIP_ENV_VALIDATION (Reason: not exporting build flag in runtime)
export const env = {
  STORAGE_ENDPOINT,
  STORAGE_REGION,
  STORAGE_BUCKET,
  STORAGE_ACCESS_KEY,
  STORAGE_SECRET_KEY,
  STORAGE_FORCE_PATH_STYLE,
  RABBITMQ_VIDEO_PROCESSING_QUEUE,
  RABBITMQ_URL,
}
