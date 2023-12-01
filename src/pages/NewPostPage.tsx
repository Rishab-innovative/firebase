import { Button, Box, CircularProgress, Input, TextField } from "@mui/material";
import { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { AddNewPost } from "../redux/NewPostSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatchType, RootState } from "../redux/Store";
import CustomModal from "../components/CustomModal";
import { useNavigate } from "react-router-dom";
import { resetSuccess } from "../redux/NavBarSlice";
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

  const LoggedInUserData = useSelector((state: RootState) => state.navbarData);

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
          firstName: LoggedInUserData.userDetails!.firstName,
          lastName: LoggedInUserData.userDetails!.lastName,
          updatedBy: LoggedInUserData.userDetails!.uid,
          profilePhotoPath: LoggedInUserData.userDetails!.profilePhotoPath,
        })
      );
    }
  };
  const handleSuccessUpdateInfo = async () => {
    navigate("/userProfile");
    dispatch(resetSuccess());
  };
  const handleOnBlur = (event: any) => {
    if (newPostData.title.trim() === "") {
      setInputFieldError({
        ...inputFieldError,
        title: true,
      });
    } else {
      setInputFieldError({
        ...inputFieldError,
        title: false,
      });
    }
  };
  const handleOnBlurDescription = () => {
    if (newPostData.description.trim() === "") {
      setInputFieldError({
        ...inputFieldError,
        description: true,
      });
    } else {
      setInputFieldError({
        ...inputFieldError,
        description: false,
      });
    }
  };

  return (
    <>
      {newPostStatus.status === "succeeded" ? (
        <CustomModal
          title="Post Added successfully"
          setOpenCloseModal={setOpenCloseModal}
          openCloseModal={openCloseModal}
          handleSuccessSignUp={handleSuccessUpdateInfo}
        />
      ) : null}
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
            onBlur={handleOnBlur}
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
            onBlur={handleOnBlurDescription}
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
