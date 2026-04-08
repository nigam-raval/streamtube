#!/bin/sh


CMD="rabbitmqadmin -H $RABBITMQ_HOST -P $RABBITMQ_MANAGEMENT_PORT  -u $RABBITMQ_DEFAULT_USER -p $RABBITMQ_DEFAULT_PASS"

# > /dev/null : Sends success output to trash
# 2>&1 : Sends errors to trash too
# silent waiting loop
while ! $CMD list queues > /dev/null 2>&1; do
  echo "RabbitMQ not connected. Retrying in 2s"
  sleep 2
done

echo "RabbitMQ is up, init setup start"

echo "Running Video Processing Pipeline Setup"
$CMD declare exchange --name=${VIDEO_PROCESSING_EXCHANGE} --type=direct --durable=true
$CMD declare queue --name=${VIDEO_PROCESSING_QUEUE} --durable=true
$CMD declare binding --source=${VIDEO_PROCESSING_EXCHANGE} --destination=${VIDEO_PROCESSING_QUEUE} --routing-key=${VIDEO_PROCESSING_ROUTING_KEY} --destination-type=queue

echo "RabbitMQ init Setup Complete"
