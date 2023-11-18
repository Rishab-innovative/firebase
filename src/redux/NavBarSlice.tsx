import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

interface NavBarState {
  userDetails: {
    firstName: string;
    lastName: string;
    email: string;
    profilePhotoPath: string;
  } | null;
  status: string;
  logInStatus: boolean;
  userUid: string | null;
}

const initialState: NavBarState = {
  userDetails: null,
  status: "idle",
  logInStatus: false,
  userUid: "",
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
          userDetails = data;
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
        console.log("action-->", action.payload);
        state.userUid = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default navBarSlice.reducer;
