import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initState = {
  value: {
    participants: [],
  } as LobbyStoreState,
} as InitLobbyStoreState;

export const lobby = createSlice({
  name: "lobby",
  initialState: initState,
  reducers: {
    setParticipants: (state, action: PayloadAction<User[]>) => {
      if (action.payload) {
        state.value.participants = action.payload.map((p: any) => ({
          id: p.id,
          displayName: p.display_name,
          displayEmoji: p.display_emoji,
          displayColor: p.display_color,
          marks: p.marks,
        }));
      } else {
        state.value.participants = [];
      }
    },
    resetLobby: (state) => {
      state.value = initState.value;
    },
  },
});

export default lobby.reducer;
export const { setParticipants, resetLobby } = lobby.actions;
