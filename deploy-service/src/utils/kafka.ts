import {Producer} from "kafkajs";

export const publishMessage = async ({
	producer,
	topic,
	key,
	message,
}: {
	producer: Producer;
	topic: string;
	key: string;
	message: string;
}) => {
	await producer.send({
		topic: topic,
		messages: [
			{
				key: key,
				value: message,
			},
		],
	});
};
