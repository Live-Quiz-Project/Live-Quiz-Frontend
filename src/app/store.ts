import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import thunk from "redux-thunk";
import storage from "redux-persist/lib/storage";
import authReducer from "@/features/auth/store/slice";
import lqsReducer from "@/features/live/store/lqs-slice";
import modReducer from "@/features/live/store/mod-slice";
import lobbyReducer from "@/features/lobby/store/slice";
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
    lobby: lobbyReducer,
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
