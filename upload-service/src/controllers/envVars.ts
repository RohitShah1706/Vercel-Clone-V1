import {EnvVarsModel} from "../models/envVars";

export const saveEnvVars = async (id: string, encryptedEnvVars: string) => {
	const envVarsDoc = new EnvVarsModel({
		_id: id,
		envVarsEncryptedString: encryptedEnvVars,
	});

	try {
		await envVarsDoc.save();
	} catch (error) {
		throw new Error("Error saving env vars");
	}
};

export const getEnvVars = async (id: string): Promise<string | null> => {
	try {
		const doc = await EnvVarsModel.findById(id);
		return doc ? doc.envVarsEncryptedString : null;
	} catch (error) {
		throw new Error("Error retrieving env vars");
	}
};
