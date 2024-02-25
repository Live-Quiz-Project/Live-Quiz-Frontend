import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import WS from "@/features/live/utils/ws";
import wsActionTypes from "@/features/live/utils/action-types";
import { http } from "@/common/services/axios";

const initState = {
  value: {
    id: "",
    code: "",
    quizId: "",
    locked: false,
  } as LqsStoreState,
} as InitLqsStoreState;

export const lqs = createSlice({
  name: "lqs",
  initialState: initState,
  reducers: {
    setLqs: (state, action: PayloadAction<LqsStorePayload>) => {
      state.value.id = action.payload.id;
      state.value.code = action.payload.code;
      state.value.quizId = action.payload.quizId;
    },
    resetLqs: (state) => {
      state.value = initState.value;
    },
    connect: () => {},
    disconnect: () => {},
    trigger: (_, action: PayloadAction<WSAction>) => {
      console.log(`${action.payload.type} triggered`);
    },
    start: (state, action: PayloadAction<WS>) => {
      console.log(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createLqs.fulfilled, (state, action) => {
        state.value.id = action.payload.id;
        state.value.code = action.payload.code;
        state.value.quizId = action.payload.quizId;
      })
      .addCase(checkLqs.fulfilled, (state, action) => {
        state.value.id = action.payload.id;
        state.value.code = action.payload.code;
        state.value.quizId = action.payload.quizId;
      });
  },
});

export const createLqs = createAsyncThunk("lqs/createLqs", async (req: any) => {
  try {
    const { data } = await http.post(`/live`, {
      quiz_id: req.quizId,
      config: req.config,
    });
    return data;
  } catch (error) {
    return error;
  }
});

export const checkLqs = createAsyncThunk(
  "lqs/checkLqs",
  async (code: string) => {
    try {
      const { data } = await http.get(`/live/${code}/check`);
      return data;
    } catch (error) {
      return error;
    }
  }
);

export const endLqs = createAsyncThunk(
  "lqs/endLqs",
  async (_, { dispatch, getState }) => {
    const { lqs } = getState() as StoreRootState;
    const { code } = lqs.value;
    try {
      dispatch(trigger({ type: wsActionTypes.END_LQS }));
      const { data } = await http.get(`/live/${code}/end`);
      dispatch(resetLqs());
      return data;
    } catch (error) {
      return error;
    }
  }
);

export const connected = (state: StoreRootState) =>
  !!state.lqs.value.code && !!state.lqs.value.id && !!state.lqs.value.quizId;

export const { connect, disconnect, trigger, setLqs, start, resetLqs } =
  lqs.actions;
export default lqs.reducer;
