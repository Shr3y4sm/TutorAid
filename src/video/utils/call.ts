import { StreamVideoClient } from "@stream-io/video-react-native-sdk";

let client: StreamVideoClient | null = null;

export function getClient() {
  if (!client) {
    throw new Error("Stream Client not initialized");
  }

  return client;
}

export function setClient(instance: StreamVideoClient) {
  client = instance;
}