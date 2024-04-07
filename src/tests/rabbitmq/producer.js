const amqp = require('amqplib');

const message = 'New a product: Shoe';

const runProducer = async () => {
  try {
    const connect = await amqp.connect('amqp://localhost');
    const channel = await connect.createChannel();

    const queueName = 'test-topic';
    await channel.assertQueue(queueName, { durable: true });

    // send message
    channel.sendToQueue(queueName, Buffer.from(message));

    console.log(`message send: `, message);
  } catch (error) {
    console.error(error);
  }
};

runProducer().catch(console.log);
