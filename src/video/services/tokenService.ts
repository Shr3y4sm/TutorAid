export interface StreamTokenResponse {
  token: string;
}

class TokenService {
  async getToken(
    userId: string
  ): Promise<StreamTokenResponse> {
    throw new Error(
      "Token endpoint not implemented."
    );
  }

  async refreshToken(
    userId: string
  ): Promise<StreamTokenResponse> {
    throw new Error(
      "Refresh endpoint not implemented."
    );
  }
}

export default new TokenService();