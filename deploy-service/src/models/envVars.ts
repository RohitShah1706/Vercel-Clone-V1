import mongoose, {Schema, Document} from "mongoose";

interface IEnvVars extends Document {
	_id: string;
	envVarsEncryptedString: string;
}

const EnvVarsSchema: Schema = new Schema({
	_id: {type: String, required: true},
	envVarsEncryptedString: {type: String, required: true},
});

export const EnvVarsModel = mongoose.model<IEnvVars>("EnvVars", EnvVarsSchema);
