"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AWS_S3_BASE_URL = exports.AWS_S3_BUCKET_NAME = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "";
exports.AWS_S3_BUCKET_NAME = AWS_S3_BUCKET_NAME;
const AWS_S3_BASE_URL = process.env.AWS_S3_BASE_URL || "";
exports.AWS_S3_BASE_URL = AWS_S3_BASE_URL;
