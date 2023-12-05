import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
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
interface NewPostState {
  status: string;
  getPostStatus: string;
  allPostData: any;
}
const initialState: NewPostState = {
  status: "idle",
  getPostStatus: "idle",
  allPostData: [],
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
  console.log("inside async");
  let posts = [];
  try {
    const querySnapshot = await getDocs(
      query(collection(db, "Posts"), orderBy("createdAt", "desc"))
    );
    if (!querySnapshot.empty) {
      for (const doc of querySnapshot.docs) {
        const post = { ...doc.data(), id: doc.id };
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
      console.log(action.payload);
    });
    builder.addCase(getAllPosts.rejected, (state) => {
      state.getPostStatus = "failed";
    });
  },
});
export const { resetSuccess } = NewPostSlice.actions;
export default NewPostSlice.reducer;
