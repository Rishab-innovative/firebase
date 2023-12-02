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
  picture?: File;
  uid: string;
}

const initialState: NavBarState = {
  status: "idle",
};
export const saveEditedUserData = createAsyncThunk(
  "saveEditedUserData",
  async (data: SaveEditedUserDataType) => {
    if (!data.picture) {
      throw new Error("Profile picture is undefined");
    }

    const storage = getStorage();
    const storageRef = ref(storage, `files/${data.uid}/profilepicture`);

    try {
      await updateDoc(doc(db, "userDetails", data.DocId), {
        firstName: data.firstName,
        lastName: data.lastName,
        mobileNumber: data.mobileNumber,
      });

      await uploadBytes(storageRef, data.picture);
      const downloadURL = await getDownloadURL(storageRef);

      await updateDoc(doc(db, "userDetails", data.DocId), {
        profilePhotoPath: downloadURL,
      });

      return { data, profilePictureURL: downloadURL };
    } catch (error) {
      console.error("Error saving user data and profile photo:", error);
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
      .addCase(saveEditedUserData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveEditedUserData.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(saveEditedUserData.rejected, (state) => {
        state.status = "failed";
      });
  },
});
export const { resetSuccess } = EditUSerDetailSlice.actions;
export default EditUSerDetailSlice.reducer;
