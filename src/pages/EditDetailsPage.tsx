import React, { useEffect } from "react";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

const EditDetailsPage: React.FC = () => {
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

  useEffect(() => {
    const docId = "e7el1PtNeZqwK0yQJaBG";
    const update = async () => {
      return await updateDoc(doc(db, "userDetails", docId), {
      lastName: "test1"
    })
    };
    update().then((res) => console.log('res', res));
  }, []);

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
