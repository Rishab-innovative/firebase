import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ref, getDownloadURL, getStorage, uploadBytes } from "firebase/storage";
import slugify from "@sindresorhus/slugify";

interface AddNewPostType {
  title: string;
  photo: File;
  description: string;
  user: {
    firstName: string;
    lastName: string;
    updatedBy: string;
    profilePhotoPath: string;
  };
}
interface NewPostState {
  status: string;
}
const initialState: NewPostState = {
  status: "idle",
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
    };
    try {
      await addDoc(collection(db, "Posts"), postData);
    } catch (error) {
      console.log("Unable to add new post", error);
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
  },
});
export const { resetSuccess } = NewPostSlice.actions;
export default NewPostSlice.reducer;
