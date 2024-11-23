const amqp = require('amqplib');
const { QUEUE_NAME } = require('./constants');

async function connect() {
	try {
		const rabbitMqConnection = await amqp.connect('amqp://localhost:5672');
		const channel = await rabbitMqConnection.createChannel();

		// Set prefetch to process one message at a time (optional)
		channel.prefetch(1);

		channel.consume(QUEUE_NAME, async (message) => {
			try {
				if (message) {
					const msg = JSON.parse(message.content.toString());
					console.log(`Received Job with input ${msg.number}`);

					// Simulate processing
					await processMessage(msg);

					// Acknowledge after successful processing
					channel.ack(message);
					console.log(`Acknowledged Job: ${msg.number}`);
				}
			} catch (error) {
				console.error(`Error processing message: ${error.message}`);

				// Optionally requeue the message if it fails
				// channel.nack(message, false, true);
			}
		});

		console.log('Waiting for messages....');
	} catch (ex) {
		console.error(`Connection error: ${ex.message}`);
	}
}

// Simulated message processing function
async function processMessage(msg) {
	return new Promise((resolve, reject) => {
		// Example condition: simulate error for specific inputs
		if (msg.number < 0) {
			return reject(new Error('Invalid number'));
		}

		// Simulate async processing
		setTimeout(() => {
			console.log(`Processing Job: ${msg.number}`);
			resolve();
		}, 1000);
	});
}

connect();
