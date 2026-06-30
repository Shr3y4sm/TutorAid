import { StreamClient } from "@stream-io/node-sdk";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.STREAM_API_KEY;
const secret = process.env.STREAM_SECRET;

if (!apiKey || !secret) {
  throw new Error(
    "Missing STREAM_API_KEY or STREAM_SECRET in .env"
  );
}

export const streamClient = new StreamClient(
  apiKey,
  secret
);