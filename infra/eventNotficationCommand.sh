# Create direct exchange
rabbitmqadmin declare exchange name=s3-exchange type=direct durable=false

# Create queue
rabbitmqadmin declare queue name=s3-events durable=true

# Bind queue to exchange with routing key
rabbitmqadmin declare binding source=s3-exchange destination=s3-events routing_key=s3

# set minio alias
mc alias set myminio http://localhost:9000 <username> <password>

# configure minio for event notfication
mc event add myminio/socialmedia arn:minio:sqs::rabbitmq1:amqp --event put --prefix private/
