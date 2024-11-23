const amqp = require('amqplib'); // Advance Message Queue Protocol aka amqp
const { QUEUE_NAME } = require('./constants');
const msg = { number: process.argv[2] }; // command: npm run publish 100, here number will get 100

async function connect() {
	try {
		const rabbitMqConnection = await amqp.connect('amqp://localhost:5672');
		const channel = await rabbitMqConnection.createChannel();
		await channel.assertQueue(QUEUE_NAME); // create a queue with given name, if queue already exist then msg will go existing queue name
		channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(msg)));
		console.log(`Job sent successfully ${msg.number}`);

		await channel.close();
		await rabbitMqConnection.close();
	} catch (ex) {
		console.error(ex);
	}
}

connect();
  