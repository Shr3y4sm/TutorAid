import { StreamClient } from "@stream-io/node-sdk";
import dotenv from "dotenv";

dotenv.config();

const client = new StreamClient(
  process.env.STREAM_API_KEY!,
  process.env.STREAM_SECRET!
);

let activeCallId: string | null = null;

export async function createUserToken(userId: string) {
  return client.createToken(userId);
}

export function createCall() {
  activeCallId = `room-${Date.now()}`;

  return {
    callId: activeCallId,
  };
}

export function getActiveCall() {
  return activeCallId;
}

export function endCall() {
  activeCallId = null;

  return true;
}