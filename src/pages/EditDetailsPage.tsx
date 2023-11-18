import React from "react";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import Input from "@mui/material/Input";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatchType, RootState } from "../redux/Store";

const EditDetailsPage: React.FC = () => {
  const userUid = useSelector((state: RootState) => state.navbarData);
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedRegisterData = {
      ...loginData,
      [event.target.id]: event.target.value,
    };
    setLoginData(updatedRegisterData);
  };
  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="flex flex-col gap-y-4 border-solid border-2 border-black-500 p-8 rounded-lg text-center">
        <p className="text-3xl text-indigo-600">Update Details</p>
        <TextField
          id="fname"
          onChange={handleInputChange}
          label="First Name"
          size="small"
        />
        <TextField
          id="lname"
          onChange={handleInputChange}
          label="Last Name"
          size="small"
        />

        <TextField
          id="phoneNumber"
          onChange={handleInputChange}
          label="Phone Number"
          size="small"
        />
        <Input
          id="image"
          type="file"
          onChange={handleInputChange}
          inputProps={{ accept: "image/*" }}
        />
        {/* {loginStatus.isLoading === true ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : ( */}
        <Button
          variant="contained"
          // onClick={handleLogin}
          // disabled={isLoginButtonDisabled}
        >
          Update Changes
        </Button>
        {/* )} */}
      </div>
    </div>
  );
};

export default EditDetailsPage;
