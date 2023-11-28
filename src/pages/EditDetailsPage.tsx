import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Modal,
  TextField,
  Input,
  Button,
  CircularProgress,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatchType, RootState } from "../redux/Store";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { fetchUserDetails } from "../redux/NavBarSlice";
import { auth } from "../firebase";
import { saveEditedUserData, resetSuccess } from "../redux/EditDetailsSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import CustomModal from "../components/CustomModal";

interface EditUserDataType {
  fname: string;
  lname: string;
  mobileNumber: string;
  picture: File | null;
}
const validationSchema = Yup.object().shape({
  fname: Yup.string().required("First Name is required"),
  lname: Yup.string().required("Last Name is required"),
  mobileNumber: Yup.string().required("Mobile Number is required"),
  picture: Yup.mixed().required("Image required")
});

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
  
  const [openCloseModal, setOpenCloseModal] = useState(true);

  useEffect(() => {
    console.log("->", LoggedInUserData);
    console.log("insnide useEFFEct", formik.values);
    if(formik.values.fname) return;
    onAuthStateChanged(auth, async (user) => {
      user && dispatch(fetchUserDetails(user.uid));
      if (
        LoggedInUserData.status === "succeeded" &&
        LoggedInUserData.userDetails
      ) {
        console.log("logg");
        formik.setValues({
          fname: LoggedInUserData.userDetails.firstName,
          lname: LoggedInUserData.userDetails.lastName,
          mobileNumber: LoggedInUserData.userDetails.mobileNumber,
          picture: LoggedInUserData.userDetails.profilePhotoPath as any
        });
      }
    });
  }, [LoggedInUserData.status]);

  const submitUpdatedData = async () => {
    console.log("hello");
    formik.handleSubmit();
  };
  const handleSuccessUpdateInfo = async () => {
    navigate("/userProfile");
    await dispatch(fetchUserDetails(LoggedInUserData.userDetails!.uid));
    dispatch(resetSuccess());
  };
  const formik = useFormik({
    initialValues: {
      fname: "",
      lname: "",
      mobileNumber: "",
      picture: null,
    },
    validationSchema,
    onSubmit: async () => {
      console.log('ffff', formik.values)
        dispatch(
          saveEditedUserData({
            DocId: LoggedInUserData.userDetails!.DocId,
            firstName: formik.values.fname as string,
            lastName: formik.values.lname as string,
            mobileNumber: formik.values.mobileNumber as string,
            uid: LoggedInUserData.userDetails!.uid,
            picture: formik.values.picture as unknown as File,
          })
        );
    },
  });
  return (
    <>
      {updateDetailStatus.status === "succeeded" ? (
        <CustomModal
          title="Data Updated successfully"
          setOpenCloseModal={setOpenCloseModal}
          openCloseModal={openCloseModal}
          handleSuccessSignUp={handleSuccessUpdateInfo}
        />
      ) : null}
      {LoggedInUserData.status === "succeeded" &&
      LoggedInUserData.userDetails ? (
        <div className="flex justify-center items-center h-screen ">
          <div className="flex flex-col gap-y-4 border-solid border-2 border-black-500 p-8 rounded-lg text-center">
            <p className="text-3xl text-indigo-600">Update Details</p>
            <TextField
              id="fname"
              type="text"
              value={formik.values.fname}
              onChange={formik.handleChange}
              error={formik.touched.fname && Boolean(formik.errors.fname)}
              helperText={formik.touched.fname && formik.errors.fname}
              label="First Name"
              size="small"
            />
            <TextField
              id="lname"
              type="text"
              value={formik.values.lname}
              onChange={formik.handleChange}
              helperText={formik.touched.fname && formik.errors.lname}
              label="Last Name"
              size="small"
              error={formik.touched.fname && Boolean(formik.errors.lname)}
            />
            <TextField
              id="mobileNumber"
              type="number"
              value={formik.values.mobileNumber}
              helperText={formik.touched.mobileNumber && formik.errors.lname}
              onChange={formik.handleChange}
              label="mobile Number"
              size="small"
            />
            <Input
              id="picture"
              onChange={formik.handleChange}
              type="file"
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
