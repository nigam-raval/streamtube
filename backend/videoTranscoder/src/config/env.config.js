import dotenv from 'dotenv'
dotenv.config({ path: '../../.env', quiet: true }) // '../../.env' is relative to process.cwd(), not this file

// SKIP_ENV_VALIDATION is not check 'requiredVariables' as default value is provided
const requiredVariables = [
  'STORAGE_ENDPOINT',
  'STORAGE_REGION',
  'STORAGE_BUCKET',
  'STORAGE_ACCESS_KEY',
  'STORAGE_SECRET_KEY',
  'STORAGE_FORCE_PATH_STYLE',
  'RABBITMQ_QUEUE',
  'RABBITMQ_URL',
]

const missingVariables = requiredVariables.filter((Variable) => !process.env[Variable])

const SKIP_ENV_VALIDATION = process.env.SKIP_ENV_VALIDATION?.toLowerCase() === 'true'

if (missingVariables.length > 0 && SKIP_ENV_VALIDATION != true) {
  console.error(`Missing required ENV variables: ${missingVariables.join(', ')}`)
}

const {
  STORAGE_ENDPOINT,
  STORAGE_REGION,
  STORAGE_BUCKET,
  STORAGE_ACCESS_KEY,
  STORAGE_SECRET_KEY,
  STORAGE_FORCE_PATH_STYLE,
  RABBITMQ_QUEUE,
  RABBITMQ_URL,
} = process.env

// not exporting SKIP_ENV_VALIDATION (Reason: not exporting build flag in runtime)
export const env = {
  STORAGE_ENDPOINT,
  STORAGE_REGION,
  STORAGE_BUCKET,
  STORAGE_ACCESS_KEY,
  STORAGE_SECRET_KEY,
  STORAGE_FORCE_PATH_STYLE,
  RABBITMQ_QUEUE,
  RABBITMQ_URL,
}
