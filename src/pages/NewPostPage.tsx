import { Button, Input, TextField } from "@mui/material";
import { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

interface newPostDataType {
  title: string;
  picture: File | null;
  description: string;
}
export const NewPostPage = () => {
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
    console.log("-->", newPostData);
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen ">
        <div className="flex flex-col gap-y-4 border-solid border-2 border-black-500 p-8 rounded-lg text-center">
          <p className="text-3xl text-indigo-600">New Post</p>
          <TextField
            id="title"
            type="text"
            onChange={handleInputChange}
            label="TITLE"
            size="medium"
          />

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
            onReady={(editor: any) => {
              console.log("CKEditor5 React Component is ready to use!", editor);
            }}
            // onChange={(editor: any) => {
            //   const data = editor.getData();
            //   setNewPostData({
            //     ...newPostData,
            //     description: data,
            //   });
            // }}
          />
          <Button variant="contained" onClick={handleSubmitNewPost}>
            Add Post
          </Button>
        </div>
      </div>
    </>
  );
};
