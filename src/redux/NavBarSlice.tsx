import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

interface NavBarState {
  userDetails: {
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    uid: string;
    DocId: string;
    profilePhotoPath: string;
  } | null;
  status: string;
  logInStatus: boolean;
}

const initialState: NavBarState = {
  userDetails: null,
  status: "idle",
  logInStatus: false,
};
export const fetchUserDetails = createAsyncThunk(
  "fetchUserDetails",
  async (uid: string) => {
    try {
      const userDoc = await getDocs(collection(db, "userDetails"));
      let userDetails = null;
      userDoc.forEach((doc: any) => {
        const data = doc.data();
        if (data.uid === uid) {
          userDetails = { ...data, DocId: doc.id };
        }
      });
      return userDetails;
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    }
  }
);

const navBarSlice = createSlice({
  name: "navBarSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.userDetails = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchUserDetails.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default navBarSlice.reducer;
