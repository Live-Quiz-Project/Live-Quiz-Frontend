import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import wsStatuses from "@/features/live/utils/statuses";

const initState = {
  value: {
    qCount: 0,
    curQ: 0,
    timeLeft: -1,
    status: wsStatuses.IDLING,
    question: null,
    answer: null,
  } as ModStoreState,
} as InitModStoreState;

export const mod = createSlice({
  name: "mod",
  initialState: initState,
  reducers: {
    setMod: (state, action: PayloadAction<ModStorePayload>) => {
      state.value.curQ = action.payload.curQ;
      state.value.status = action.payload.status;
    },
    setStatus: (state, action: PayloadAction<wsStatuses>) => {
      state.value.status = action.payload;
    },
    setQuestionCount: (state, action: PayloadAction<number>) => {
      state.value.qCount = action.payload;
    },
    setTimeLeft: (state, action: PayloadAction<number>) => {
      state.value.timeLeft = action.payload;
    },
    setQuestion: (state, action: PayloadAction<Question>) => {
      state.value.question = action.payload;
    },
    setOptions: (
      state,
      action: PayloadAction<OptionChoice[] | OptionText[]>
    ) => {
      if (!state.value.question) {
        state.value.question = {} as Question;
      }
      state.value.question.options = action.payload;
    },
    setAnswer: (state, action: PayloadAction<Answer>) => {
      if (!state.value.question) {
        state.value.question = {} as Question;
      }
      state.value.question.answer = action.payload;
    },
    setSelectedOption: (state, action: PayloadAction<unknown>) => {
      state.value.answer = action.payload;
    },
    resetMod: (state) => {
      state.value.qCount = initState.value.qCount;
      state.value.curQ = initState.value.curQ;
      state.value.timeLeft = initState.value.timeLeft;
      state.value.status = initState.value.status;
      state.value.question = initState.value.question;
      state.value.answer = initState.value.answer;
    },
    resetQuestion: (state) => {
      state.value.question = initState.value.question;
      state.value.answer = initState.value.answer;
    },
  },
});

export const {
  setMod,
  setStatus,
  setQuestionCount,
  setTimeLeft,
  setQuestion,
  setOptions,
  setSelectedOption,
  setAnswer,
  resetMod,
  resetQuestion,
} = mod.actions;
export default mod.reducer;
