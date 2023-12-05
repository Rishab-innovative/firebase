import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "../redux/NewPostSlice";
import { AppDispatchType, RootState } from "../redux/Store";
import { Avatar, Box, CircularProgress, Stack, Chip } from "@mui/material";
import FaceIcon from "@mui/icons-material/Face";

const UserProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatchType>();
  const [postData, setPostData] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const newPostStatus = useSelector((state: RootState) => state.newPostDetail);

  useEffect(() => {
    const getData = async () => {
      const a = await dispatch(getAllPosts());
      if (a.payload) {
        setPostData(a.payload as []);
      }
    };
    getData();
  }, []);

  const splitDescription = (description: string, lines: number) => {
    const words = description.split(" ");
    if (words.length <= lines * 10) {
      return description;
    }
    return words.slice(0, lines * 10).join(" ") + "...";
  };

  const toggleShowMore = (postId: string) => {
    console.log("ibside toggle function", postId);
    const post = postData.find((p: any) => p.id === postId);
    if (post) {
      setShowMore(!showMore);
    }
  };

  return (
    <>
      {newPostStatus.getPostStatus === "succeeded" ? (
        <div className="p-8 grid grid-cols-2 gap-4">
          {postData.map((a: any) => (
            <div
              className="border-solid border-2 border-black-600 p-4"
              key={a.id}
            >
              <div className="flex items-center gap-x-2 my-3.5 font-medium">
                <Avatar alt="Remy Sharp" src={a.profilePhotoPath} />
                {`${a.firstName} ${a.lastName}`}
              </div>
              <div className=" w-full h-80 m-auto">
                <img
                  src={a.photo}
                  alt={`Post by ${a.firstName} ${a.lastName}`}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="font-bold my-3">{a.title}</div>
              <div>
                {!showMore ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: splitDescription(a.description, 2),
                    }}
                  />
                ) : (
                  <div
                    style={{
                      maxHeight: "150px",
                      overflowY: "auto",
                    }}
                    className="border border-gray-300 p-4"
                    dangerouslySetInnerHTML={{
                      __html: splitDescription(a.description, 100),
                    }}
                  />
                )}
                {a.description.length > 170 ? (
                  <a
                    onClick={() => {
                      toggleShowMore(a.id);
                    }}
                    className="text-blue-500 cursor-pointer"
                  >
                    Show More
                  </a>
                ) : null}
              </div>
              <div className="tagged-user">
                  {a.taggedUser &&
                    a.taggedUser.map((user: any) => (
                      <Stack direction="row" spacing={1} >
                        <Chip icon={<FaceIcon />} label={user} />
                      </Stack>
                    ))}
                </div>
            </div>
          ))}
        </div>
      ) : (
        <Box sx={{ display: "flex items-center", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      )}
    </>
  );
};

export default UserProfilePage;
