const amqp = require('amqplib');

const message = 'New a product: Shoe';

const log = console.log;

console.log = function () {
  log.apply(console, [new Date()].concat(arguments));
};

const runProducer = async () => {
  try {
    const connect = await amqp.connect('amqp://localhost');
    const channel = await connect.createChannel();

    const notificationExchange = 'notificationEx'; // notificationEx direct
    const notificationQueue = 'notificationQueueProcess'; // assertQueue
    const notificationExchangeDLX = 'notificationExDLX';
    const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX';

    // 1. create Exchange
    await channel.assertExchange(notificationExchange, 'direct', {
      durable: true,
    });

    // 2. create Queue
    const queueResult = await channel.assertQueue(notificationQueue, {
      exclusive: false, // cho phep cac ket noi truy cap cung 1 luc hang doi
      deadLetterExchange: notificationExchangeDLX,
      deadLetterRoutingKey: notificationRoutingKeyDLX,
    });

    // 3.bindQueue
    await channel.bindQueue(queueResult.queue, notificationExchange);

    // 4.send message
    const msg = 'A new product';

    console.log(`producer msg: `, msg);

    await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
      expiration: '10000',
    });

    setTimeout(() => {
      connect.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error(error);
  }
};

runProducer().catch(console.log);
