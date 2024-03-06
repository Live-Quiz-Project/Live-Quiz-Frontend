import wsStatuses from "@/features/live/utils/statuses";
import AsyncStoreStatus from "@/common/utils/async-store-statuses";
import { participants } from "./../../features/lobby/slice";
import { store } from "@/app/store";
import { AxiosError } from "axios";

declare global {
  type StoreRootState = ReturnType<typeof store.getState>;
  type StoreDispatch = typeof store.dispatch;

  type AuthStoreState = {
    token: string;
    user: User & { isHost: boolean };
    participant: User & { code?: string; marks: number; rank: number };
    anonymous: boolean;
  };
  type InitAuthStoreState = {
    value: AuthStoreState;
  };

  type LqsStoreState = {
    id: string;
    code: string;
    quizId: string;
  };
  type LqsStorePayload = {
    id: string;
    code: string;
    quizId: string;
  };
  type InitLqsStoreState = {
    value: LqsStoreState;
  };

  type ModStoreState = {
    pending: boolean;
    quizId: string;
    quizTitle: string;
    curQ: number;
    totalQ: number;
    question: Question | null;
    answers?: any;
    timeLeft: number;
    status: wsStatuses;
    locked: boolean;
    resCount: number;
    participantCount: number;
    config: {
      shuffle: {
        question: bool;
        option: bool;
      };
      participant: { reanswer: bool };
      leaderboard: {
        during: bool;
        after: bool;
      };
      option: {
        colorless: bool;
        show_correct_answer: bool;
      };
    };
  };
  type InitModStoreState = {
    value: ModStoreState;
  };

  type ParticipantsStoreState = (User & { marks: number })[];
  type InitParticipantStoreState = {
    value: ParticipantsStoreState;
  };

  type LobbyStoreState = {
    participants: User[];
  };
  type InitLobbyStoreState = {
    value: LobbyStoreState;
  };
}

export {};
