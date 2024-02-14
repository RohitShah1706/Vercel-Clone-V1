import crypto from "crypto";

import {ENCRYPTION_KEY} from "./config";

crypto.randomBytes(16).toString("hex");

const algorithm = "aes-256-ctr";
const IV_LENGTH = 16;

export const encrypt = (text: string) => {
	let iv = crypto.randomBytes(IV_LENGTH);
	let cipher = crypto.createCipheriv(
		algorithm,
		Buffer.from(ENCRYPTION_KEY, "hex"),
		iv
	);
	let encrypted = cipher.update(text);
	encrypted = Buffer.concat([encrypted, cipher.final()]);
	return iv.toString("hex") + ":" + encrypted.toString("hex");
};

export const decrypt = (text: string) => {
	const textParts = text.split(":");
	const shifted = textParts.shift();

	if (typeof shifted !== "string") {
		throw new Error("Invalid encrypted text");
	}

	const iv = Buffer.from(shifted, "hex");
	const encryptedText = Buffer.from(textParts.join(":"), "hex");
	const decipher = crypto.createDecipheriv(
		algorithm,
		Buffer.from(ENCRYPTION_KEY, "hex"),
		iv
	);
	let decrypted = decipher.update(encryptedText);
	decrypted = Buffer.concat([decrypted, decipher.final()]);
	return decrypted.toString();
};
