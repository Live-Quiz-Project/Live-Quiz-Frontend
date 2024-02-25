import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Emoji from "@/common/utils/emojis";

const initState = {
  value: {
    token: "",
    user: {
      id: "",
      name: "",
      displayName: "",
      displayEmoji: "",
      displayColor: "",
      isHost: false,
    },
    participant: {
      displayName: "",
      displayColor: "#FFBB60",
      displayEmoji: Emoji[0].value,
    },
    anonymous: true,
  } as AuthStoreState,
} as InitAuthStoreState;

export const auth = createSlice({
  name: "auth",
  initialState: initState,
  reducers: {
    logOut: (state) => {
      state.value = initState.value;
    },
    logIn: (state, action: PayloadAction<AuthStoreState>) => {
      state.value = {
        token: action.payload.token,
        user: action.payload.user,
        participant: action.payload.participant
          ? action.payload.participant
          : state.value.participant,
        anonymous: action.payload.anonymous,
      };
    },
    setAnonymous: (state, action: PayloadAction<boolean>) => {
      state.value.anonymous = action.payload;
    },
    setUserDisplayName: (state, action: PayloadAction<string>) => {
      state.value.user.displayName = action.payload;
    },
    setUserDisplayEmoji: (state, action: PayloadAction<string>) => {
      state.value.user.displayEmoji = action.payload;
    },
    setUserDisplayColor: (state, action: PayloadAction<string>) => {
      state.value.user.displayColor = action.payload;
    },
    setParticipantDisplayName: (state, action: PayloadAction<string>) => {
      state.value.participant!.displayName = action.payload;
    },
    setParticipantDisplayEmoji: (state, action: PayloadAction<string>) => {
      state.value.participant!.displayEmoji = action.payload;
    },
    setParticipantDisplayColor: (state, action: PayloadAction<string>) => {
      state.value.participant!.displayColor = action.payload;
    },
    setParticipant: (
      state,
      action: PayloadAction<{
        id: string;
        code: string;
        displayName: string;
        displayEmoji: string;
        displayColor: string;
      }>
    ) => {
      state.value.participant = action.payload;
    },
    resetParticipant: (state) => {
      state.value.participant = initState.value.participant;
    },
    resetParticipantDisplayData: (state) => {
      state.value.participant!.displayName =
        initState.value.participant!.displayName;
      state.value.participant!.displayEmoji =
        initState.value.participant!.displayEmoji;
      state.value.participant!.displayColor =
        initState.value.participant!.displayColor;
    },
    refreshToken: (state, action: PayloadAction<string>) => {
      state.value.token = action.payload;
    },
  },
});

export const {
  logOut,
  logIn,
  setAnonymous,
  setUserDisplayName,
  setUserDisplayEmoji,
  setUserDisplayColor,
  setParticipantDisplayName,
  setParticipantDisplayEmoji,
  setParticipantDisplayColor,
  setParticipant,
  resetParticipant,
  resetParticipantDisplayData,
  refreshToken,
} = auth.actions;
export default auth.reducer;
