import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import RegisterUserSlice from "./RegisterSlice";
import loginUserSlice from "./LoginSlice";
const rootReducer = combineReducers({
  registerUser: RegisterUserSlice,
  loginUser: loginUserSlice,
});
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatchType = typeof store.dispatch;