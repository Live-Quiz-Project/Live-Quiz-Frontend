import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initState = {
  value: [] as ParticipantsStoreState,
} as InitParticipantStoreState;

export const participants = createSlice({
  name: "participants",
  initialState: initState,
  reducers: {
    setParticipants: (state, action: PayloadAction<User[]>) => {
      if (action.payload) {
        state.value = action.payload.map((p: any) => ({
          id: p.id,
          displayName: p.display_name,
          displayEmoji: p.display_emoji,
          displayColor: p.display_color,
          marks: p.marks,
        }));
      } else {
        state.value = [];
      }
    },
    resetParticipants: (state) => {
      state.value = initState.value;
    },
  },
});

export default participants.reducer;
export const { setParticipants, resetParticipants } = participants.actions;
