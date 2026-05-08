import { rabbitmqConfig } from '../config/rabbitmq.config.js'

export async function fetchOneRabbitmqMessage(connection, channel) {
  try {
    console.log('Waiting for one message')

    // Get a single message (no consumer loop)
    const msg = await channel.get(rabbitmqConfig.videoProcessingQueue, { noAck: false })

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
    return { msg, key }
  } catch (err) {
    console.error('RabbitMQ error:', err)
    process.exit(1)
  }
}

export async function sendRabbitmqAck(connection, channel, msg) {
  channel.ack(msg)

  await channel.close()
  await connection.close()

  console.log('Ack sended, exiting')
  process.exit(0)
}
