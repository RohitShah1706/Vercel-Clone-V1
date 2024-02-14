import mongoose from "mongoose";

export const connectMongo = (mongoURI: string) => {
	return mongoose.connect(mongoURI);
};
