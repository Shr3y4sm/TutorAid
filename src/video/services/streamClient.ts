import {
  StreamVideoClient,
  User,
} from "@stream-io/video-react-native-sdk";

import { STREAM_API_KEY } from "../constants";

class StreamClientService {
  private static instance: StreamClientService;

  private client: StreamVideoClient | null = null;

  private constructor() {}

  public static getInstance(): StreamClientService {
    if (!StreamClientService.instance) {
      StreamClientService.instance =
        new StreamClientService();
    }

    return StreamClientService.instance;
  }

  public getClient() {
    return this.client;
  }

  public async initialize(
    user: User,
    token: string
  ) {
    if (this.client) {
      return this.client;
    }

    this.client = StreamVideoClient.getOrCreateInstance({
      apiKey: STREAM_API_KEY,
      user,
      token,
    });

    return this.client;
  }

  public async disconnect() {
    if (!this.client) return;

    await this.client.disconnectUser();

    this.client = null;
  }

  public isInitialized() {
    return this.client !== null;
  }
}

export default StreamClientService.getInstance();