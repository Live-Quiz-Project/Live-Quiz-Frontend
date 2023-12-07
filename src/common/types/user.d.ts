declare global {
  type User = {
    id: string;
    name: string;
    displayName: string;
    displayEmoji: string;
    displayColor: string;
    isHost: boolean;
  };
}

export {};
