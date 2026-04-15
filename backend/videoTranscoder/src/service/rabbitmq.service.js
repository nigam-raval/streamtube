import amqp from 'amqplib'
import { env } from '../config/env.config.js'

export async function fetchOneRabbitmqMessage() {
  let connection
  let channel

  try {
    console.log('rabbitmq service started')
    connection = await amqp.connect(env.RABBITMQ_URL)
    channel = await connection.createChannel()
    await channel.assertQueue(env.RABBITMQ_VIDEO_PROCESSING_QUEUE, { durable: true })

    console.log('Waiting for one message')

    // Get a single message (no consumer loop)
    const msg = await channel.get(env.RABBITMQ_VIDEO_PROCESSING_QUEUE, { noAck: false })

    if (!msg) {
      console.log('! No message in queue')
      await channel.close()
      await connection.close()
      process.exit(0)
    }

    let key = null

    try {
      const data = JSON.parse(msg.content.toString('utf8'))
      key = data?.Key
    } catch (error) {
      console.error(`error: ${error}`)
      console.error('Invalid JSON:', msg.content.toString())
    }

    console.log('RabbitMq messaged fetched')
    return { msg, key, channel, connection }
  } catch (err) {
    console.error('RabbitMQ error:', err)
    process.exit(1)
  }
}

export async function sendRabbitmqAck(msg, channel, connection) {
  channel.ack(msg)

  await channel.close()
  await connection.close()

  console.log('Ack sended, exiting')
  process.exit(0)
}
