import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

interface LoginDataType {
  email: string;
  password: string;
}

export type loginState = {
  isLoading: boolean;
  isSuccess: boolean;
  isRejected: boolean;
};
const initialState: loginState = {
  isLoading: false,
  isSuccess: false,
  isRejected: false,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data: LoginDataType) => {
    console.log(data.email, data.password);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      return userCredential.user;
    } catch (error) {
      console.log(error);
    }
  }
);

const loginUserSlice = createSlice({
  name: "loginUserSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state) => {
      state.isLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(loginUser.rejected, (state) => {
      console.log("inside reject");
      state.isLoading = false;
      state.isRejected = true;
    });
  },
});

export default loginUserSlice.reducer;
