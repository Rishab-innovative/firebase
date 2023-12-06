import React, { ChangeEventHandler, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "../redux/NewPostSlice";
import { AppDispatchType, RootState } from "../redux/Store";
import {
  Avatar,
  Box,
  CircularProgress,
  TextField,
  Stack,
  Chip,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FaceIcon from "@mui/icons-material/Face";
import { addCommentOnPost, deleteComment } from "../redux/NewPostSlice";

const POSTS_DISPLAY_COUNT = 5;
const AllPost: React.FC = () => {
  const dispatch = useDispatch<AppDispatchType>();
  const [postData, setPostData] = useState([]);
  const userData = useSelector(
    (state: RootState) => state.navbarData.userDetails
  );
  const [displayedPostData, setDisplayedPostData] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [comment, setComment] = useState("");
  const newPostStatus = useSelector((state: RootState) => state.newPostDetail);
  const [comments, setComments] = useState<{
    [key: string]: { comment: string; updatedBy: string }[];
  }>({});
  useEffect(() => {
    const getData = async () => {
      const response = await dispatch(getAllPosts());
      if (response.payload) {
        setPostData(response.payload as []);
        setDisplayedPostData(
          (response.payload as []).slice(0, POSTS_DISPLAY_COUNT)
        );
        const initialComments: {
          [key: string]: { comment: string; updatedBy: string }[];
        } = {};
        (response.payload as []).forEach((post: any) => {
          initialComments[post.id] = post.comments.slice();
        });
        setComments(initialComments);
      }
    };
    getData();
  }, []);
  const handleShowMore = () => {
    setDisplayedPostData((currData) => [
      ...currData,
      ...postData.slice(currData.length, currData.length + POSTS_DISPLAY_COUNT),
    ]);
  };
  const splitDescription = (description: string, lines: number) => {
    const words = description.split(" ");
    if (words.length <= lines * 10) {
      return description;
    }
    return words.slice(0, lines * 10).join(" ") + "...";
  };
  const toggleShowMore = (postId: string) => {
    const post = postData.find((p: any) => p.id === postId);
    if (post) {
      setShowMore(!showMore);
    }
  };
  const addCommentsInPost = async (
    postId: any,
    fName: string,
    updatedBy: string
  ) => {
    if (!comment) return;
    setComments((prevState) => ({
      ...prevState,
      ...{ [postId]: [{ updatedBy, comment }, ...prevState[postId]] },
    }));
    dispatch(
      addCommentOnPost({
        comment: comment,
        postId: postId,
        updatedBy: updatedBy,
        firstName: fName,
      })
    );
  };
  const handleCommentValue = (event: any) => {
    setComment(event.target.value);
  };

  const handleDelete = async (commentId: string, postId: string) => {
    dispatch(deleteComment({ commentId, postId }));
    setComments((prevComments) => ({
      ...prevComments,
      [postId]: prevComments[postId].filter(
        (comment: any) => comment.id !== commentId
      ),
    }));
  };

  return (
    <>
      {newPostStatus.getPostStatus === "succeeded" ? (
        <div>
          <div className="p-8 grid grid-cols-2 gap-4">
            {displayedPostData.map((post: any) => (
              <div
                className="border-solid border-2 border-black-600 p-4"
                key={post.id}
              >
                <div className="flex items-center gap-x-2 my-3.5 font-medium">
                  <Avatar alt="Remy Sharp" src={post.profilePhotoPath} />
                  {`${post.firstName} ${post.lastName}`}
                </div>
                <div className=" w-full h-80 m-auto">
                  <img
                    src={post.photo}
                    alt={`Post by ${post.firstName} ${post.lastName}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="font-bold my-2 text-2xl">{post.title}</div>
                <div>
                  {!showMore ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: splitDescription(post.description, 2),
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
                        __html: splitDescription(post.description, 100),
                      }}
                    />
                  )}
                  {post.description.length > 170 ? (
                    <a
                      onClick={() => {
                        toggleShowMore(post.id);
                      }}
                      className="text-blue-500 cursor-pointer"
                    >
                      {showMore ? "show Less" : "show More"}
                    </a>
                  ) : null}
                </div>
                <div className="flex gap-4 my-2">
                  {post.taggedUser &&
                    post.taggedUser.map((user: any) => (
                      <Stack direction="row" spacing={1} key={user}>
                        <Chip icon={<FaceIcon />} label={user} />
                      </Stack>
                    ))}
                </div>
                <div className="flex flex-col gap-1">
                  {comments[post.id].map((commentObj: any) => (
                    <div key={commentObj.comment}>
                      <span className="text-gray-500">
                        {commentObj.comment}
                        {userData!.uid === post.updatedBy && (
                          <DeleteIcon
                            onClick={() => handleDelete(commentObj.id, post.id)}
                            className="cursor-pointer"
                          />
                        )}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4 py-2">
                  <TextField
                    id="comment"
                    type="text"
                    onChange={handleCommentValue}
                    label="Add a comment"
                    size="small"
                  />
                  <Button
                    variant="contained"
                    onClick={() =>
                      addCommentsInPost(post.id, post.firstName, post.updatedBy)
                    }
                  >
                    Post comment
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="px-8 pb-8 flex justify-center">
            <Button
              variant="contained"
              onClick={handleShowMore}
              disabled={displayedPostData.length === postData.length}
            >
              Show More Posts
            </Button>
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
export default AllPost;
