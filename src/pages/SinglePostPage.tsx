import { Avatar, Box, Chip, CircularProgress, Stack } from "@mui/material";
import FaceIcon from "@mui/icons-material/Face";
import { fetchSinglePost, getCommentsForPost } from "../redux/SinglePostSlice";
import { AppDispatchType, RootState } from "../redux/Store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SinglePost: React.FC = () => {
  const dispatch = useDispatch<AppDispatchType>();
  const singlePostDataStatus = useSelector(
    (state: RootState) => state.singlePostDetail
  );
  const { id }: any = useParams();
  const [singlePostData, setSinglePostData] = useState({
    firstName: "",
    lastName: "",
    profilePhotoPath: "",
    photo: "",
    title: "",
    description: "",
    taggedUser: [],
  });

  useEffect(() => {
    const getPostData = async () => {
      dispatch(getCommentsForPost(id));
      const response = await dispatch(fetchSinglePost(id));
      if (response.payload) {
        const payloadData = response.payload as {
          firstName: string;
          lastName: string;
          profilePhotoPath: string;
          photo: string;
          title: string;
          description: string;
          taggedUser: [];
        };
        const newSinglePostData = {
          firstName: payloadData.firstName,
          lastName: payloadData.lastName,
          profilePhotoPath: payloadData.profilePhotoPath,
          photo: payloadData.photo,
          title: payloadData.title,
          description: payloadData.description,
          taggedUser: payloadData.taggedUser,
        };
        setSinglePostData(newSinglePostData);
      }
    };
    getPostData();
  }, []);
  return (
    <>
      {singlePostDataStatus.status === "succeeded" && singlePostData ? (
        <div className="p-8 grid grid-cols-1 gap-4">
          <div className="border-solid border-2 border-black-600 p-4">
            <div className="flex items-center gap-x-2 my-3.5 font-medium">
              <Avatar alt="Remy Sharp" src={singlePostData.profilePhotoPath} />
              {`${singlePostData.firstName} ${singlePostData.lastName}`}
            </div>
            <div className=" w-full h-80 m-auto">
              <img
                src={singlePostData.photo}
                alt={`Post by ${singlePostData.firstName} ${singlePostData.lastName}`}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="font-bold my-2 text-2xl">
              {`• ${singlePostData.title}`}
            </div>
            <div
              dangerouslySetInnerHTML={{
                __html: singlePostData.description,
              }}
            ></div>

            <div className="flex gap-4 my-2">
              {singlePostData.taggedUser &&
                singlePostData.taggedUser.map((user: any) => (
                  <Stack direction="row" spacing={1} key={user}>
                    <Chip icon={<FaceIcon />} label={user} />
                  </Stack>
                ))}
            </div>
            <div className="flex flex-col gap-1">
              {singlePostDataStatus.commentData.map((commentObj: any) => (
                <div key={commentObj.comment}>
                  <span className="text-gray-500">{`- ${commentObj.comment}`}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Box sx={{ display: "flex items-center", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      )}
    </>
  );
};

export default SinglePost;
