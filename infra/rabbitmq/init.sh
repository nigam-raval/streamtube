#!/bin/sh

CMD="rabbitmqadmin -H rabbitmq -u $RABBITMQ_DEFAULT_USER -p $RABBITMQ_DEFAULT_PASS" # -H = hostname, DNS= rabbitmq 

# > /dev/null : Sends success output to trash
# 2>&1 : Sends errors to trash too
# slient waiting loop
while ! $CMD list queues > /dev/null 2>&1; do
  echo "RabbitMQ not ready. Retrying in 2s"
  sleep 2
done

echo "RabbitMQ is up, init setup start"

# 1. Create Exchange
$CMD declare exchange name=s3-exchange type=direct durable=true

# 2. Create Queue
$CMD declare queue name=s3-events durable=true

# 3. Create Binding
$CMD declare binding source=s3-exchange destination=s3-events routing_key=s3

echo "RabbitMQ init Setup Complete"