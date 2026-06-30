import {
  StreamVideoClient,
  User,
} from "@stream-io/video-react-native-sdk";

import { STREAM_API_KEY } from "../constants";
import { getStreamToken } from "@/api/streamApi";

class StreamClientService {
  private client: StreamVideoClient | null = null;

  getClient() {
    return this.client;
  }

  async initialize(user: User) {
    if (this.client) return this.client;

    this.client = StreamVideoClient.getOrCreateInstance({
      apiKey: STREAM_API_KEY,
      user,
      tokenProvider: async () => {
        const response = await getStreamToken(user.id);

        return response.token;
      },
    });

    return this.client;
  }

  async disconnect() {
    if (!this.client) return;

    await this.client.disconnectUser();

    this.client = null;
  }
}

export default new StreamClientService();