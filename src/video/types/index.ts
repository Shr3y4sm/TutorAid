import { Call } from "@stream-io/video-react-native-sdk";

export interface UserInfo {
  id: string;
  name: string;
  image?: string;
}

export interface CallContextType {
  call?: Call;
  loading: boolean;
  joinCall: (id: string) => Promise<void>;
  leaveCall: () => Promise<void>;
}