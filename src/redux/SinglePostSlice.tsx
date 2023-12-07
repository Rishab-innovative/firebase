import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { doc, getDoc, getDocs, collection, query } from "firebase/firestore";
import { db } from "../firebase";

interface NavBarState {
  status: string;
  postData: any;
  commentData: any;
}

const initialState: NavBarState = {
  status: "idle",
  postData: [],
  commentData: [],
};
export const fetchSinglePost = createAsyncThunk(
  "fetchSinglePost",
  async (postId: string) => {
    let post = {};
    try {
      const postDocRef = doc(db, "Posts", postId);
      const postDocSnapshot = await getDoc(postDocRef);
      if (postDocSnapshot.exists()) {
        post = { ...postDocSnapshot.data(), id: postId };
      }
      return post;
    } catch (error) {
      console.error(error);
    }
  }
);
export const getCommentsForPost = createAsyncThunk(
  "getCommentsForPost",
  async (postId: string) => {
    try {
      const comments: any = [];
      const commentsSnapshot = await getDocs(
        query(collection(db, `Posts/${postId}/comment`))
      );
      commentsSnapshot.forEach((commentDoc) => {
        const comment = { ...commentDoc.data(), id: commentDoc.id };
        comments.push(comment);
      });
      return comments;
    } catch (error) {
      console.error(error);
    }
  }
);

const singlePostSlice = createSlice({
  name: "singlePostSlice",
  initialState,
  reducers: {
    resetSuccess: (state) => {
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSinglePost.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSinglePost.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(fetchSinglePost.rejected, (state) => {
        state.status = "failed";
      });
    builder.addCase(getCommentsForPost.fulfilled, (state, action) => {
      state.commentData = action.payload;
    });
  },
});
export const { resetSuccess } = singlePostSlice.actions;
export default singlePostSlice.reducer;
