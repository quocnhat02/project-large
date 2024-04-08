'use strict';

async function consumerOrderedMessage() {
  const connect = await amqp.connect('amqp://localhost');
  const channel = await connect.createChannel();

  const queueName = 'ordered-queue-message';
  await channel.assertQueue(queueName, { durable: true });

  //   set prefetch to ensure only one ack at a time

  channel.prefetch(1);

  channel.consume(queueName, (msg) => {
    const message = msg.content.toString();

    setTimeout(() => {
      console.log('processed: ', message);
      channel.ack(msg);
    }, Math.random() * 1000);
  });
}

consumerOrderedMessage().catch(console.error);
