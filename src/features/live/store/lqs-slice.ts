import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError, isAxiosError } from "axios";
import WS from "@/features/live/utils/ws";
import storeStatuses from "@/common/utils/async-store-statuses";
import wsActionTypes from "@/features/live/utils/action-types";
import { http } from "@/common/services/axios";

const initState = {
  value: {
    id: "",
    code: "",
    quizId: "",
    status: storeStatuses.IDLE,
    error: null,
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
    disconnect: (state) => {
      state.value = initState.value;
    },
    trigger: (_, action: PayloadAction<WSAction>) => {
      console.log(`${action.payload.type} triggered`);
    },
    start: (state, action: PayloadAction<WS>) => {
      console.log(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createLqs.pending, (state) => {
        state.value.status = storeStatuses.PENDING;
      })
      .addCase(createLqs.fulfilled, (state, action) => {
        state.value.status = storeStatuses.SUCCESS;
        state.value.id = action.payload.id;
        state.value.code = action.payload.code;
        state.value.quizId = action.payload.quizId;
      })
      .addCase(createLqs.rejected, (state, action) => {
        state.value.status = storeStatuses.FAILURE;
        if (isAxiosError(action.payload)) {
          state.value.error = action.payload as AxiosError;
        } else {
          state.value.error = action.payload as Error;
        }
      })
      .addCase(joinLqs.pending, (state) => {
        state.value.status = storeStatuses.PENDING;
      })
      .addCase(joinLqs.fulfilled, (state, action) => {
        state.value.status = storeStatuses.SUCCESS;
        state.value.id = action.payload.id;
        state.value.code = action.payload.code;
        state.value.quizId = action.payload.quizId;
      })
      .addCase(joinLqs.rejected, (state, action) => {
        state.value.status = storeStatuses.FAILURE;
        if (isAxiosError(action.payload)) {
          state.value.error = action.payload as AxiosError;
        } else {
          state.value.error = action.payload as Error;
        }
      });
  },
});

export const createLqs = createAsyncThunk(
  "lqs/createLqs",
  async (reqBody: CreateLqsReqBody) => {
    try {
      const { data } = await http.post(`/live`, {
        quiz_id: reqBody.quizId,
        config: reqBody.config,
      });
      return data;
    } catch (error) {
      return error;
    }
  }
);

export const joinLqs = createAsyncThunk("lqs/joinLqs", async (code: string) => {
  try {
    const { data } = await http.get(`/live/check/${code}`);
    return data;
  } catch (error) {
    return error;
  }
});

export const endLqs = createAsyncThunk(
  "lqs/endLqs",
  async (_, { dispatch, getState }) => {
    const { lqs } = getState() as StoreRootState;
    dispatch(trigger({ type: wsActionTypes.END_LQS }));
    dispatch(resetLqs());
    try {
      const { data } = await http.delete(`/live/${lqs.value.id}`);
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
