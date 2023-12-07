import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
        user: {
          id: action.payload.user.id,
          name: action.payload.user.name,
          displayName: action.payload.user.displayName,
          displayEmoji: action.payload.user.displayEmoji,
          displayColor: action.payload.user.displayColor,
          isHost: action.payload.user.isHost,
        },
      };
    },
    refreshToken: (state, action: PayloadAction<string>) => {
      state.value.token = action.payload;
    },
  },
});

export const { logOut, logIn, refreshToken } = auth.actions;
export default auth.reducer;
