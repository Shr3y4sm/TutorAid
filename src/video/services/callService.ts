import {
  Call,
} from "@stream-io/video-react-native-sdk";

import streamClient from "./streamClient";

class CallService {
  private currentCall: Call | null = null;

  get activeCall() {
    return this.currentCall;
  }

  async join(
    callType: string,
    callId: string
  ) {
    const client = streamClient.getClient();

    if (!client) {
      throw new Error(
        "Stream client not initialized."
      );
    }

    const call = client.call(
      callType,
      callId
    );

    await call.join({
      create: true,
    });

    this.currentCall = call;

    return call;
  }

  async leave() {
    if (!this.currentCall) return;

    await this.currentCall.leave();

    this.currentCall = null;
  }

  async end() {
    if (!this.currentCall) return;

    await this.currentCall.endCall();

    this.currentCall = null;
  }

  getCall() {
    return this.currentCall;
  }

  hasCall() {
    return this.currentCall !== null;
  }
}

export default new CallService();