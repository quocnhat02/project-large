'use strict';

async function producerOrderedMessage() {
  const connect = await amqp.connect('amqp://localhost');
  const channel = await connect.createChannel();

  const queueName = 'ordered-queue-message';
  await channel.assertQueue(queueName, { durable: true });

  for (let i = 0; i < 10; i++) {
    const message = `ordered-queue-message: ${i}`;
    console.log(`message: ${message}`);
    channel.sendToQueue(queueName, Buffer.from(message), {
      persistent: true,
    });
  }

  setTimeout(() => {
    connect.close();
  }, 1000);
}

producerOrderedMessage().catch(console.error);
