import amqp from 'amqplib'
import { env } from '../config/env.config.js'

export const rabbitmqConfig = {
  url: env.RABBITMQ_URL,
  videoProcessingQueue: env.RABBITMQ_VIDEO_PROCESSING_QUEUE,
}

export async function connectRabbitMQ() {
  try {
    console.log('connecting to RabbitMQ')
    const connection = await amqp.connect(rabbitmqConfig.url)
    const channel = await connection.createChannel()
    return { connection, channel }
  } catch (error) {
    console.error('RabbitMQ connection error:', error)
    process.exit(1)
  }
}
