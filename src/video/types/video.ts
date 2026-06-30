export interface StreamUser {
  id: string;
  name: string;
  image?: string;
}

export interface StreamContextType {
  initialized: boolean;
  initialize(user: StreamUser): Promise<void>;
  disconnect(): Promise<void>;
}