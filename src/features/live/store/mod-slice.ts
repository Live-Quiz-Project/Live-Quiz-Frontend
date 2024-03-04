import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import wsStatuses from "@/features/live/utils/statuses";
import { http } from "@/common/services/axios";

const initState = {
  value: {
    pending: false,
    quizId: "",
    quizTitle: "",
    curQ: 0,
    totalQ: 0,
    timeLeft: -1,
    status: wsStatuses.IDLE,
    question: null,
    answers: null,
    locked: false,
    resCount: 0,
    participantCount: 0,
    config: {
      shuffle: {
        question: false,
        option: false,
      },
      participant: {
        reanswer: false,
      },
      leaderboard: {
        during: false,
        after: false,
      },
      option: {
        colorless: false,
        show_correct_answer: false,
      },
    },
  } as ModStoreState,
} as InitModStoreState;

export const mod = createSlice({
  name: "mod",
  initialState: initState,
  reducers: {
    setQuizTitle: (state, action: PayloadAction<string>) => {
      state.value.quizTitle = action.payload;
    },
    setTimeLeft: (state, action: PayloadAction<number>) => {
      state.value.timeLeft = action.payload;
    },
    setCountDown: (state, action: PayloadAction<any>) => {
      state.value.timeLeft = action.payload.time_left;
      state.value.curQ = action.payload.current_question;
      state.value.status = action.payload.status;
    },
    setAnswers: (state, action: PayloadAction<any>) => {
      state.value.answers = action.payload;
    },
    setStatus: (state, action: PayloadAction<wsStatuses>) => {
      state.value.status = action.payload;
    },
    resetMod: (state) => {
      state.value = initState.value;
    },
    resetQuestion: (state) => {
      state.value.question = initState.value.question;
      state.value.answers = initState.value.answers;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateMod.fulfilled, (state, action) => {
      state.value.pending = false;
      state.value.quizId = action.payload.quiz_id;
      state.value.quizTitle = action.payload.quiz_title;
      state.value.curQ = action.payload.current_question;
      state.value.totalQ = action.payload.question_count;
      state.value.timeLeft = action.payload.time_left;
      state.value.status = action.payload.status;
      state.value.resCount = action.payload.response_count;
      state.value.participantCount = action.payload.participant_count;
      state.value.locked = action.payload.locked;
      state.value.config = {
        shuffle: {
          question: action.payload.config.shuffle.question,
          option: action.payload.config.shuffle.option,
        },
        participant: {
          reanswer: action.payload.config.participant.reanswer,
        },
        leaderboard: {
          during: action.payload.config.leaderboard.during,
          after: action.payload.config.leaderboard.between,
        },
        option: {
          colorless: action.payload.config.option.colorless,
          show_correct_answer: action.payload.config.option.show_correct_answer,
        },
      };
      if (action.payload.current_question > 0) {
        const payloadQuestion =
          action.payload.questions[
            action.payload.orders[action.payload.current_question - 1] - 1
          ];
        const newQuestion: Question = {
          id: payloadQuestion.id,
          content: payloadQuestion.content,
          note: payloadQuestion.note,
          fontSize: payloadQuestion.font_size,
          layout: payloadQuestion.layout_idx,
          type: payloadQuestion.type,
          haveTimeFactor: payloadQuestion.have_time_factor,
          timeFactor: payloadQuestion.time_factor,
          timeLimit: payloadQuestion.time_limit,
          pool: payloadQuestion.pool,
          poolRequired: payloadQuestion.pool_required,
          mediaType: payloadQuestion.media_type,
          media: payloadQuestion.media,
          selectMin: payloadQuestion.select_min,
          selectMax: payloadQuestion.select_max,
          options: payloadQuestion.options,
          subquestions: payloadQuestion.subquestions,
        };
        state.value.question = newQuestion;
      }
    });
  },
});

export const updateMod = createAsyncThunk(
  "mod/updateMod",
  async (_, { getState }) => {
    const { auth } = getState() as StoreRootState;
    const {
      participant: { code },
    } = auth.value;
    try {
      const { data } = await http.get(`/live/${code}/mod`);
      return data;
    } catch (error) {
      return error;
    }
  }
);

export const {
  setQuizTitle,
  setTimeLeft,
  setCountDown,
  setAnswers,
  setStatus,
  resetMod,
  resetQuestion,
} = mod.actions;
export default mod.reducer;
