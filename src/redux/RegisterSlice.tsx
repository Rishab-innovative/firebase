import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, imageDb } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface RegistrationInputData {
  email: string;
  password: string;
}
interface SaveUserDataType {
  fname: string;
  lname: string;
  phoneNumber: string | number;
  email: string;
  picture?: File | null;
  pictureURL?: string | null;
  uid?: string;
}
export type registerState = {
  isLoading: boolean;
  uid: string;
  isSuccess: boolean;
  saveUserDataFulfil: boolean;
  saveUserDataLoading: boolean;
};

const initialState: registerState = {
  isLoading: false,
  isSuccess: false,
  uid: "",
  saveUserDataFulfil: false,
  saveUserDataLoading: false,
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
export const SaveAuthUserData = createAsyncThunk(
  "SaveAuthUserData",
  async (data: SaveUserDataType) => {
    const userData = {
      uid: data.uid,
      firstName: data.fname,
      lastName: data.lname,
      mobileNumber: data.phoneNumber || "",
      email: data.email,
      profilePhotoPath: data.pictureURL,
    };
    try {
      await addDoc(collection(db, "userDetails"), userData);
    } catch (error) {
      console.log("Unable to process", error);
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
      await addDoc(collection(db, "userDetails"), userData);
    } catch (error) {
      console.log("Unable to process", error);
    }
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
    builder.addCase(SaveUserData.fulfilled, (state) => {
      state.saveUserDataFulfil = true;
      state.saveUserDataLoading = false;
    });
    builder.addCase(SaveUserData.pending, (state) => {
      state.saveUserDataLoading = true;
    });
    builder.addCase(SaveAuthUserData.fulfilled, (state) => {
      state.saveUserDataFulfil = true;
    });
  },
});
export const { resetSuccess } = RegisterUserSlice.actions;
export default RegisterUserSlice.reducer;
