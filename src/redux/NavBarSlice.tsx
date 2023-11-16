import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const initialState = {
  userDetails: null,
  status: "idle",
  error: null,
};

export const fetchUserDetails = createAsyncThunk(
  "fetchUserDetails",
  async (uid: string) => {
    console.log("uid->", uid);
    try {
      const userDoc = await getDocs(collection(db, "userDetails"));
      let userDetails = null;
      userDoc.forEach((doc: any) => {
        const data = doc.data();
        if (data.uid === uid) {
          userDetails = data;
        }
      });
      console.log("userDetataiil", userDetails);
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
        console.log("loadingngg");
        state.status = "loading";
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        console.log("action NAVBAR", action);
        state.status = "succeeded";
        state.userDetails = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state) => {
        console.log("failedd");
        state.status = "failed";
      });
  },
});
export default navBarSlice.reducer;
