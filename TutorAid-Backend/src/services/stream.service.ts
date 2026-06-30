import { streamClient } from "../config/stream";

class StreamService {

  async generateToken(userId: string) {

    await streamClient.upsertUsers([
      {
        id: userId,
        role: "user",
      },
    ]);

    const token =
      streamClient.generateUserToken({
        user_id: userId,
      });

    return token;
  }

}

export default new StreamService();