import {Kafka, logLevel} from "kafkajs";
import fs from "fs";
import path from "path";

import {KAFKA_BROKER, KAFKA_USERNAME, KAFKA_PASSWORD} from "../config";

export const getKafkaInstance = (clientId: string) => {
	const rootDir = path.join(__dirname, "..", "..");
	return new Kafka({
		clientId: clientId,
		brokers: [KAFKA_BROKER],
		ssl: {
			ca: [fs.readFileSync(path.join(rootDir, "kafka.pem"), "utf-8")],
		},
		sasl: {
			username: KAFKA_USERNAME,
			password: KAFKA_PASSWORD,
			mechanism: "plain",
		},
		// ! wait for 10s before disconnecting
		connectionTimeout: 10000,
		// ! only log errors
		logLevel: logLevel.ERROR,
	});
};
