import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Box, CircularProgress, Input, TextField } from "@mui/material";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { AddNewPost } from "../redux/NewPostSlice";
import { resetSuccess } from "../redux/NewPostSlice";
import { AppDispatchType, RootState } from "../redux/Store";
import CustomModal from "../components/CustomModal";

interface newPostDataType {
  title: string;
  picture: File | null;
  description: string;
}
export const NewPostPage = () => {
  const [openCloseModal, setOpenCloseModal] = useState(true);
  const [inputFieldError, setInputFieldError] = useState({
    title: false,
    description: false,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatchType>();
  const newPostStatus = useSelector((state: RootState) => state.newPostDetail);

  const UserData = useSelector((state: RootState) => state.navbarData);

  const [newPostData, setNewPostData] = useState<newPostDataType>({
    title: "",
    picture: null,
    description: "",
  });
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!(event.target.value.trim() === "")) {
      const postData = {
        ...newPostData,
        [event.target.id]: event.target.value,
      };
      setNewPostData(postData);
    }
  };
  const handleSubmitNewPost = () => {
    if (newPostData.picture) {
      dispatch(
        AddNewPost({
          title: newPostData.title,
          photo: newPostData.picture,
          description: newPostData.description,
          user: {
            firstName: UserData.userDetails!.firstName,
            lastName: UserData.userDetails!.lastName,
            updatedBy: UserData.userDetails!.uid,
            profilePhotoPath: UserData.userDetails!.profilePhotoPath,
          },
        })
      );
    }
  };
  const handleSuccessAddPost = async () => {
    navigate("/user-profile");
    dispatch(resetSuccess());
  };
  const handleOnBlur = (fieldName: string) => {
    const fieldValue = (newPostData as any)[fieldName].trim();
    const updatedErrors = { ...inputFieldError };
    if (fieldName === "title" || fieldName === "description") {
      updatedErrors[fieldName] = fieldValue === "";
    }
    setInputFieldError(updatedErrors);
  };

  return (
    <>
      {newPostStatus.status === "succeeded" && (
        <CustomModal
          title="Post Added successfully"
          setOpenCloseModal={setOpenCloseModal}
          openCloseModal={openCloseModal}
          handleSuccessSignUp={handleSuccessAddPost}
        />
      )}
      <div
        className="flex justify-center items-center"
        style={{ height: "88vh" }}
      >
        <div className="flex flex-col gap-y-4 border-solid border-2 border-black-500 p-8 rounded-lg text-center">
          <p className="text-3xl text-indigo-600">New Post</p>
          <TextField
            id="title"
            type="text"
            onChange={handleInputChange}
            label="TITLE"
            size="medium"
            onBlur={() => handleOnBlur("title")}
          />
          {inputFieldError.title === true ? (
            <p className="text-red-500">Please Enter Title</p>
          ) : null}

          <Input
            id="picture"
            type="file"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.files && e.target.files[0]) {
                setNewPostData({
                  ...newPostData,
                  picture: e.target.files[0] as File,
                });
              }
            }}
            inputProps={{ accept: "image/*" }}
          />
          <CKEditor
            editor={ClassicEditor}
            id="description"
            data=""
            onBlur={() => handleOnBlur("description")}
            onChange={(event, editor) => {
              const data = editor.getData();
              setNewPostData({
                ...newPostData,
                description: data,
              });
            }}
          />
          {inputFieldError.description === true ? (
            <p className="text-red-500">Please Enter description</p>
          ) : null}
          {newPostStatus.status === "loading" ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : (
            <Button
              variant="contained"
              disabled={
                inputFieldError.title ||
                inputFieldError.description ||
                !newPostData.picture
              }
              onClick={handleSubmitNewPost}
            >
              Add Post
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
