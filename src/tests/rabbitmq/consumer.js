const amqp = require('amqplib');

const runConsumer = async () => {
  try {
    const connect = await amqp.connect('amqp://localhost');
    const channel = await connect.createChannel();

    const queueName = 'test-topic';
    await channel.assertQueue(queueName, { durable: true });

    // send message
    channel.consume(
      queueName,
      (message) => {
        console.log(`Received message: ${message.content.toString()}`);
      },
      { noAck: true }
    );
  } catch (error) {
    console.error(error);
  }
};

runConsumer().catch(console.log);
