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
const validationSchema = Yup.object({
  fname: Yup.string().required("First Name is required"),
  lname: Yup.string().required("Last Name is required"),
  mobileNumber: Yup.string().required("Mobile Number is required"),
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
  const [updatedData, setUpdatedData] = useState<EditUserDataType>({
    fname: "",
    lname: "",
    mobileNumber: "",
    picture: null,
  });

  const [openCloseModal, setOpenCloseModal] = useState(true);
  const [error, setError] = useState(false);

  const handleBlur = (event: any) => {
    if (event.target.value === "") {
      setError(true);
    }
  };
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      user && dispatch(fetchUserDetails(user.uid));
    });
    console.log("->", LoggedInUserData);
    if (
      LoggedInUserData.status === "succeeded" &&
      LoggedInUserData.userDetails
    ) {
      console.log("logg");
      setUpdatedData({
        ...updatedData,
        fname: LoggedInUserData.userDetails.firstName,
        lname: LoggedInUserData.userDetails.lastName,
        mobileNumber: LoggedInUserData.userDetails.mobileNumber,
      });
    }
    console.log("insnide useEFFEct");
  }, []);

  const submitUpdatedData = async () => {
    console.log("hello");
    formik.handleSubmit();
  };
  const handleSuccessUpdateInfo = () => {
    navigate("/userProfile");
    dispatch(resetSuccess());
  };
  const formik = useFormik({
    initialValues: {
      fname: LoggedInUserData.userDetails?.firstName,
      lname: LoggedInUserData.userDetails?.lastName,
      mobileNumber: LoggedInUserData.userDetails?.mobileNumber,
      picture: null,
    },
    validationSchema,
    onSubmit: async () => {
      if (LoggedInUserData.userDetails && updatedData.picture && !error) {
        dispatch(
          saveEditedUserData({
            DocId: LoggedInUserData.userDetails.DocId,
            firstName: updatedData.fname,
            lastName: updatedData.lname,
            mobileNumber: updatedData.mobileNumber,
            uid: LoggedInUserData.userDetails.uid,
            picture: updatedData.picture,
          })
        );
      } else {
        setError(true);
      }
    },
  });
  const handleInputChange = (e: any) => {
    const { id, value } = e.target;
    setUpdatedData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
    formik.handleChange(e);
  };
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
              onChange={handleInputChange}
              onBlur={formik.handleBlur}
              error={formik.touched.fname && Boolean(formik.errors.fname)}
              helperText={formik.touched.fname && formik.errors.fname}
              label="First Name"
              size="small"
            />
            <TextField
              id="lname"
              type="text"
              value={formik.values.lname}
              onChange={handleInputChange}
              helperText={formik.touched.fname && formik.errors.lname}
              label="Last Name"
              size="small"
              onBlur={formik.handleBlur}
              error={formik.touched.fname && Boolean(formik.errors.lname)}
            />
            <TextField
              id="mobileNumber"
              type="number"
              value={formik.values.mobileNumber}
              helperText={formik.touched.mobileNumber && formik.errors.lname}
              onChange={handleInputChange}
              label="mobile Number"
              size="small"
              onBlur={handleBlur}
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
            {error ? (
              <p className="text-red-500">Please Fill all input fields</p>
            ) : null}
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
