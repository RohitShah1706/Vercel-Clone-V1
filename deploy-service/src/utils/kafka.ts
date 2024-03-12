import { Producer } from "kafkajs";
import { DEPLOY_SERVICE_LOGS_KAFKA_TOPIC } from "../config";

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

export const _publishLog = async (
	id: string,
	log: string,
	producer: Producer
) => {
	const now = new Date();
	await publishMessage({
		producer,
		key: "deploy-log",
		topic: DEPLOY_SERVICE_LOGS_KAFKA_TOPIC,
		message: JSON.stringify({
			deploymentId: id,
			log,
			time: now.toISOString(),
		}),
	});
};
