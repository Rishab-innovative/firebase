import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ref, getDownloadURL, getStorage, uploadBytes } from "firebase/storage";
import slugify from "@sindresorhus/slugify";
interface AddNewPostType {
  title: string;
  photo: File;
  description: string;
  taggedUser: any;
  user: {
    firstName: string;
    lastName: string;
    updatedBy: string;
    profilePhotoPath: string;
  };
}
interface commentDataType {
  comment: string;
  postId: string;
  firstName: string;
  updatedBy: string;
}
interface NewPostState {
  status: string;
  getPostStatus: string;
  allPostData: any;
  addCommentStatus: string;
  getCommentStatus: string;
  getCommentsData: any;
}
const initialState: NewPostState = {
  status: "idle",
  getPostStatus: "idle",
  addCommentStatus: "idle",
  allPostData: [],
  getCommentStatus: "idle",
  getCommentsData: [],
};
export const AddNewPost = createAsyncThunk(
  "AddNewPost",
  async (data: AddNewPostType) => {
    const slug = slugify(data.title, {
      lowercase: false,
    });
    const timestamp = new Date().toISOString();
    const storage = getStorage();
    const storageRef = ref(
      storage,
      `Posts/${data.user.updatedBy}/postphotos${timestamp}`
    );
    await uploadBytes(storageRef, data.photo);
    const downloadURL = await getDownloadURL(storageRef);
    const postData = {
      title: data.title,
      description: data.description,
      slug: slug,
      createdAt: timestamp,
      updatedAt: timestamp,
      updatedBy: data.user.updatedBy,
      photo: downloadURL,
      firstName: data.user.firstName,
      lastName: data.user.lastName,
      profilePhotoPath: data.user.profilePhotoPath,
      taggedUser: data.taggedUser,
    };
    try {
      await addDoc(collection(db, "Posts"), postData);
    } catch (error) {
      console.log("Unable to add new post", error);
    }
  }
);
export const getAllPosts = createAsyncThunk("getAllPosts", async () => {
  let posts: any[] = [];
  try {
    const querySnapshot = await getDocs(
      query(collection(db, "Posts"), orderBy("createdAt", "desc"))
    );
    if (!querySnapshot.empty) {
      const getComments = async (postId: string) => {
        try {
          const comments: any = [];
          const commentsSnapshot = await getDocs(
            query(
              collection(db, `Posts/${postId}/comment`),
              orderBy("createdAt", "desc")
            )
          );
          commentsSnapshot.forEach((commentDoc) => {
            const comment = { ...commentDoc.data(), id: commentDoc.id };
            comments.push(comment);
          });
          return comments;
        } catch (error) {
          console.error(error);
        }
      };
      for (const doc of querySnapshot.docs) {
        const post = { ...doc.data(), id: doc.id };
        const comments = await getComments(doc.id);
        (post as any).comments = comments;
        posts.push(post);
      }
      return posts;
    } else {
      console.error("not found ");
    }
  } catch (error) {
    console.log(error);
  }
});
export const addCommentOnPost = createAsyncThunk(
  "addCommentOnPost",
  async (data: commentDataType) => {
    try {
      if (data.comment.trim() !== "") {
        const timestamp = new Date().toISOString();
        const commentData = {
          comment: data.comment,
          firstName: data.firstName,
          updatedBy: data.updatedBy,
          createdAt: timestamp,
          updatedAt: timestamp,
        };
        const commentsRef = collection(db, `Posts/${data.postId}/comment`);
        await addDoc(commentsRef, commentData);
      }
    } catch (error) {
      console.error(error);
    }
  }
);

export const deleteComment = createAsyncThunk(
  "deleteComment",
  async ({ commentId, postId }: { commentId: string; postId: string }) => {
    try {
      const commentsRef = collection(db, `Posts/${postId}/comment`);
      const commentDocRef = doc(commentsRef, commentId);
      await deleteDoc(commentDocRef);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  }
);
const NewPostSlice = createSlice({
  name: "NewPostSlice",
  initialState,
  reducers: {
    resetSuccess: (state) => {
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(AddNewPost.pending, (state) => {
        state.status = "loading";
      })
      .addCase(AddNewPost.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(AddNewPost.rejected, (state) => {
        state.status = "failed";
      });
    builder.addCase(getAllPosts.pending, (state) => {
      state.getPostStatus = "loading";
    });
    builder.addCase(getAllPosts.fulfilled, (state, action) => {
      state.getPostStatus = "succeeded";
      state.allPostData = action.payload;
    });
    builder.addCase(getAllPosts.rejected, (state) => {
      state.getPostStatus = "failed";
    });
    builder.addCase(addCommentOnPost.pending, (state) => {
      state.addCommentStatus = "loading";
    });
    builder.addCase(addCommentOnPost.fulfilled, (state) => {
      state.addCommentStatus = "succeeded";
    });
    builder.addCase(addCommentOnPost.rejected, (state) => {
      state.addCommentStatus = "failed";
    });
  },
});
export const { resetSuccess } = NewPostSlice.actions;
export default NewPostSlice.reducer;
