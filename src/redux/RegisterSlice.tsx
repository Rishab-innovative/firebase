import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, imageDb } from "../firebase";

interface RegistrationInputData {
  email: string;
  password: string;
}
export type registerState = {
  isLoading: boolean;
  isSuccess: boolean;
};
const initialState: registerState = {
  isLoading: false,
  isSuccess: false,
};
export const RegistrationFormData = createAsyncThunk(
  "registration/registerUser",
  async (data: RegistrationInputData, thunkAPI) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
const RegisterUserSlice = createSlice({
  name: "SignUpData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(RegistrationFormData.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(RegistrationFormData.pending, (state) => {
      state.isLoading = true;
    });
  },
});
export default RegisterUserSlice.reducer;
