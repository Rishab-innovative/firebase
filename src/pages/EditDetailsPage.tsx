import React, { useEffect } from "react";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatchType, RootState } from "../redux/Store";
import { onAuthStateChanged } from "firebase/auth";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { fetchUserDetails } from "../redux/NavBarSlice";
import { auth } from "../firebase";
import {
  SaveEditedUserData,
  SaveEditedProfilePicture,
  resetSuccess,
} from "../redux/EditDetailsSlice";

interface EditUserDataType {
  fname: string;
  lname: string;
  mobileNumber: string;
  picture: File | null;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const EditDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const LoggedInUserData = useSelector((state: RootState) => state.navbarData);
  const updateDetailStatus = useSelector(
    (state: RootState) => state.editUserDetail
  );
  const dispatch = useDispatch<AppDispatchType>();
  const [updatedData, setUpdatedData] = useState<EditUserDataType>({
    fname: "",
    lname: "",
    mobileNumber: "",
    picture: null,
  });

  const [openCloseModal, setOpenCloseModal] = useState(true);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedRegisterData = {
      ...updatedData,
      [event.target.id]: event.target.value,
    };
    setUpdatedData(updatedRegisterData);
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      user && dispatch(fetchUserDetails(user.uid));
    });
    if (
      LoggedInUserData.status === "succeeded" &&
      LoggedInUserData.userDetails
    ) {
      setUpdatedData({
        ...updatedData,
        fname: LoggedInUserData.userDetails.firstName,
        lname: LoggedInUserData.userDetails.lastName,
        mobileNumber: LoggedInUserData.userDetails.mobileNumber,
      });
    } else {
    }
  }, []);
  useEffect(() => {
    if (LoggedInUserData.userDetails) {
      setUpdatedData({
        ...updatedData,
        fname: LoggedInUserData.userDetails.firstName,
        lname: LoggedInUserData.userDetails.lastName,
        mobileNumber: LoggedInUserData.userDetails.mobileNumber,
      });
    }
  }, [LoggedInUserData.status]);

  const submitUpdatedData = async () => {
    if (LoggedInUserData.userDetails && updatedData.picture) {
      dispatch(
        SaveEditedUserData({
          DocId: LoggedInUserData.userDetails.DocId,
          firstName: updatedData.fname,
          lastName: updatedData.lname,
          mobileNumber: updatedData.mobileNumber,
        })
      );
      dispatch(
        SaveEditedProfilePicture({
          uid: LoggedInUserData.userDetails.uid,
          DocId: LoggedInUserData.userDetails.DocId,
          picture: updatedData.picture,
        })
      );
    }
  };
  const handleSuccessSignUp = () => {
    navigate("/userProfile");
    dispatch(resetSuccess());
  };
  return (
    <>
      {updateDetailStatus.status === "succeeded" ? (
        <Modal open={openCloseModal} onClose={() => setOpenCloseModal(false)}>
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              className="mb-4"
            >
              Data Updated successfully
            </Typography>
            <Button
              variant="contained"
              onClick={handleSuccessSignUp}
              sx={{ marginTop: "2rem" }}
            >
              OK
            </Button>
          </Box>
        </Modal>
      ) : null}
      {LoggedInUserData.status === "succeeded" &&
      LoggedInUserData.userDetails ? (
        <div className="flex justify-center items-center h-screen ">
          <div className="flex flex-col gap-y-4 border-solid border-2 border-black-500 p-8 rounded-lg text-center">
            <p className="text-3xl text-indigo-600">Update Details</p>
            <TextField
              id="fname"
              value={updatedData.fname}
              onChange={handleInputChange}
              label="First Name"
              size="small"
            />
            <TextField
              id="lname"
              value={updatedData.lname}
              onChange={handleInputChange}
              label="Last Name"
              size="small"
            />
            <TextField
              id="mobileNumber"
              value={updatedData.mobileNumber}
              onChange={handleInputChange}
              label="mobile Number"
              size="small"
            />
            <Input
              id="image"
              type="file"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files && e.target.files[0]) {
                  setUpdatedData({
                    ...updatedData,
                    picture: e.target.files[0] as File,
                  });
                }
              }}
              inputProps={{ accept: "image/*" }}
            />
            {updateDetailStatus.status === "loading" ? (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Box>
            ) : (
              <Button variant="contained" onClick={submitUpdatedData}>
                Update Changes
              </Button>
            )}
          </div>
        </div>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "50vh",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </>
  );
};

export default EditDetailsPage;
