import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, imageDb } from "../firebase";
import { getDownloadURL } from "firebase/storage";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

interface RegistrationInputData {
  email: string;
  password: string;
}
interface SaveUserDataType {
  fname: string;
  lname: string;
  phoneNumber: string | number;
  email: string;
  password: string;
  picture: File | null;
  confirmPassword: string;
}
export type registerState = {
  isLoading: boolean;
  uid: string;
  isSuccess: boolean;
};
const initialState: registerState = {
  isLoading: false,
  isSuccess: false,
  uid: "",
};
export const RegistrationFormData = createAsyncThunk(
  "registerUser",
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
export const SaveUserData = createAsyncThunk(
  "SaveUserData",
  async (data: SaveUserDataType, { getState }) => {
    const state: any = getState();
    const pictureRef = ref(
      imageDb,
      `files/${state.registerUser.uid}/profilePicture`
    );
    data.picture && (await uploadBytes(pictureRef, data.picture));

    const downloadURL = await getDownloadURL(pictureRef);

    const userData = {
      uid: state.registerUser.uid,
      firstName: data.fname,
      lastName: data.lname,
      mobileNumber: data.phoneNumber || "",
      email: data.email,
      profilePhotoPath: downloadURL,
    };
    try {
      const storedata = await addDoc(collection(db, "userDetails"), userData);
    } catch (e) {}
    // if (storedata) {
    //   state.userDetails = userData;
    // }
  }
);

const RegisterUserSlice = createSlice({
  name: "SignUpData",
  initialState,
  reducers: {
    resetSuccess: (state) => {
      state.isSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(RegistrationFormData.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.uid = action.payload.user.uid;
    });
    builder.addCase(RegistrationFormData.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(RegistrationFormData.rejected, (state) => {
      state.isLoading = false;
    });
  },
});
export const { resetSuccess } = RegisterUserSlice.actions;
export default RegisterUserSlice.reducer;
