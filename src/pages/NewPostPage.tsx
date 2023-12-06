import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Checkbox,
  FormControl,
  Box,
  OutlinedInput,
  CircularProgress,
  InputLabel,
  Input,
  TextField,
  Chip,
  Stack,
  MenuItem,
} from "@mui/material";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import ListItemText from "@mui/material/ListItemText";
import { AddNewPost, resetSuccess } from "../redux/NewPostSlice";
import { AppDispatchType, RootState } from "../redux/Store";
import CustomModal from "../components/CustomModal";
import { userStore } from "../redux/UserList";

interface newPostDataType {
  title: string;
  picture: File | null;
  description: string;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export const NewPostPage = () => {
  const [taggedUser, setTaggedUser] = useState<string[]>([]);
  const [userList, setUserList] = useState<any[]>([]);
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
          taggedUser: taggedUser,
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
    navigate("/all-posts");
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

  const handleChange = (event: SelectChangeEvent<typeof taggedUser>) => {
    const {
      target: { value },
    } = event;
    setTaggedUser(typeof value === "string" ? value.split(",") : value);
  };

  const { getUsersList } = userStore();

  const fetchUsersList = async () => {
    let users = await getUsersList();
    setUserList(users);
  };

  useEffect(() => {
    fetchUsersList();
  }, []);

  const handleDelete = (deletedName: string) => {
    const updatedTaggedUser = taggedUser.filter((name) => name !== deletedName);
    setTaggedUser(updatedTaggedUser);
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

          <Stack direction="row" spacing={1}>
            {taggedUser.map((name: string) => (
              <Chip
                key={name}
                label={name}
                onDelete={() => handleDelete(name)}
              />
            ))}
          </Stack>

          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={taggedUser}
              onChange={handleChange}
              input={<OutlinedInput label="Tag" />}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={MenuProps}
            >
              {userList.map((name: any) => (
                <MenuItem key={name.firstName} value={name.firstName}>
                  <Checkbox checked={taggedUser.indexOf(name.firstName) > -1} />
                  <ListItemText primary={name.firstName} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
