import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import thunk from "redux-thunk";
import storage from "redux-persist/lib/storage";
import authReducer from "@/features/auth/slice";
import lqsReducer from "@/features/live/store/lqs-slice";
import modReducer from "@/features/live/store/mod-slice";
import participantsReducer from "@/features/live/store/participants-slice";
import liveMiddleware from "@/features/live/store/middleware";
import WS from "@/features/live/utils/ws";

const persistConfig = {
  timeout: 500,
  key: "root",
  version: 1,
  storage,
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    auth: authReducer,
    lqs: lqsReducer,
    participants: participantsReducer,
    mod: modReducer,
  })
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(thunk, liveMiddleware(new WS())),
});

export const persistor = persistStore(store);
