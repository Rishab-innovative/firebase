import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface NavBarState {
  status: string;
}
interface SaveEditedUserDataType {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  DocId: string;
}
interface SaveEditedProfilePictureType {
  picture: File;
  uid: string;
  DocId: string;
}
const initialState: NavBarState = {
  status: "idle",
};
export const SaveEditedUserData = createAsyncThunk(
  "SaveEditedUserData",
  async (data: SaveEditedUserDataType) => {
    try {
      await updateDoc(doc(db, "userDetails", data.DocId), {
        firstName: data.firstName,
        lastName: data.lastName,
        mobileNumber: data.mobileNumber,
      });
    } catch (error) {
      console.error("Error Posting user details:", error);
      throw error;
    }
  }
);

export const SaveEditedProfilePicture = createAsyncThunk(
  "SaveEditedProfilePicture",
  async (data: SaveEditedProfilePictureType) => {
    const storage = getStorage();
    try {
      const storageRef = ref(storage, `userProfile/${data.uid}/profilepic`);
      await uploadBytes(storageRef, data.picture);
      const downloadURL = await getDownloadURL(storageRef);
      updateDoc(doc(db, "userDetails", data.DocId), {
        profilePhotoPath: downloadURL,
      });
      return downloadURL;
    } catch (error) {
      console.error("Error uploading profile photo:", error);
      throw error;
    }
  }
);

const EditUSerDetailSlice = createSlice({
  name: "EditUSerDetailSlice",
  initialState,
  reducers: {
    resetSuccess: (state) => {
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(SaveEditedUserData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(SaveEditedUserData.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(SaveEditedUserData.rejected, (state) => {
        state.status = "failed";
      });
  },
});
export const { resetSuccess } = EditUSerDetailSlice.actions;
export default EditUSerDetailSlice.reducer;
