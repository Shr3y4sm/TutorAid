import { getStreamToken } from "@/api/streamApi";

class TokenService {
  async getToken(userId: string) {
    const response =
      await getStreamToken(userId);

    return {
      token: response.token,
    };
  }
}

export default new TokenService();