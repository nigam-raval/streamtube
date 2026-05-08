import dotenv from 'dotenv'
import { extname } from 'path'
import { fileTypeFromFile } from 'file-type'
import { generateOutputPrefix } from './utils/generateOutputPrefix.utils.js'
import { checkDirectoriesExist } from './utils/checkDirectoriesExist.utils.js'
import { removeBucketName } from './utils/removeBucketName.js'
import { downloadFromS3, uploadDirectoryToS3 } from './service/s3.service.js'
import { processHLS } from './service/ffmpeg.service.js'
import { connectRabbitMQ } from './config/rabbitmq.config.js'
import { fetchOneRabbitmqMessage, sendRabbitmqAck } from './service/rabbitmq.service.js'

dotenv.config({ quiet: true })
;(async () => {
  try {
    console.log('Starting Video Worker')

    const { connection, channel } = await connectRabbitMQ()
    if (!connection || !channel) {
      console.error('Error: RabbitMQ is not connected, exiting ')
      process.exit(1)
    }
    console.log('Rabbitmq is connected')

    const { msg, key } = await fetchOneRabbitmqMessage(connection, channel)
    if (!msg || !key) {
      console.error('Error: queue is empty,exiting ')
      process.exit(1)
    }
    const S3_INPUT_KEY = removeBucketName(key)
    const S3_OUTPUT_PREFIX = generateOutputPrefix(S3_INPUT_KEY) // S3 prefix for upload

    const fileExtension = extname(S3_INPUT_KEY).toLowerCase()
    if (fileExtension !== '.mp4') {
      console.error('Error: Only MP4 files are supported. The provided file is not an MP4.')
      await sendRabbitmqAck(connection, channel, msg)
      process.exit(1)
    }

    // check if required directories is exist, if not then  it will create it
    checkDirectoriesExist()

    // Configuration
    const LOCAL_DOWNLOAD_PATH = './tmp/input/video.mp4' // Local path for download (without extension)
    const LOCAL_OUTPUT_PATH = './tmp/output' // Local output path

    await downloadFromS3(S3_INPUT_KEY, LOCAL_DOWNLOAD_PATH)

    // Verifying Magic Bytes to ensure that malicious file can not process and only .mp4 get process via ffmpeg
    console.log('Verifying Magic Bytes')

    const fileType = await fileTypeFromFile(LOCAL_DOWNLOAD_PATH)

    if (!fileType || fileType.mime !== 'video/mp4') {
      console.error('Security Alert: File Signature Mismatch')
      console.error(`Expected: video/mp4, Detected: ${fileType?.mime || 'Unknown'}`)

      //send Rabbitmq Ack so malicious file or fake .mp4 did not reprocess
      await sendRabbitmqAck(connection, channel, msg)

      process.exit(1)
    }

    console.log('Starting Transcoding')
    await processHLS(LOCAL_DOWNLOAD_PATH, LOCAL_OUTPUT_PATH)

    console.log('Starting upload Directory')
    await uploadDirectoryToS3(LOCAL_OUTPUT_PATH, S3_OUTPUT_PREFIX)

    console.log('Sending Rabbitmq Ack')
    await sendRabbitmqAck(connection, channel, msg)

    console.log('Job Completed Successfully')
    process.exit(0)
  } catch (err) {
    console.error('System Error:', err)
    process.exit(1)
  }
})()
