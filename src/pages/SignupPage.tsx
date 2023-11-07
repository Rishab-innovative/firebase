import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import React from "react";
import { useState, FocusEvent } from "react";
import InputLabel from "@mui/material/InputLabel";
import { styled } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

interface registerDataType {
  fname: string;
  lname: string;
  phoneNumber: null | number;
  email: string;
  password: string;
  confirmPassword: string;
}
const SignupPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [registerData, setResgisterData] = useState<registerDataType>({
    fname: "",
    lname: "",
    phoneNumber: null,
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [inputFieldError, setInputFieldError] = useState({
    firstNameError: "",
    lastNameError: "",
    phoneNumberError: false,
    emailInputError: false,
    passwordError: true,
    confirmPasswordError: false,
  });
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
  let fname = "";
  let lname = "";
  let emailInputError = false;
  let passError = true;
  let confirmPassword = false;
  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    if (event.target.id === "fname") {
      if (registerData.fname.length < 5) {
        fname = "firstName";
      }
    } else if (event.target.id === "lname") {
      if (registerData.lname.length < 5) {
        lname = "lastName";
      }
    } else if (event.target.id === "email") {
      const emailParts = event.target.value.split("@");
      if (
        emailParts.length !== 2 ||
        emailParts[1].split(".").length !== 2 ||
        emailParts[1].split(".")[1].length < 2
      ) {
        emailInputError = true;
      }
    } else if (event.target.id === "password") {
      if (!passwordRegex.test(registerData.password)) {
        passError = false;
      }
    } else if (event.target.id === "confirmPassword") {
      if (!(registerData.confirmPassword === registerData.password)) {
        confirmPassword = true;
      }
    }
    setInputFieldError({
      ...inputFieldError,
      firstNameError: fname,
      lastNameError: lname,
      passwordError: passError,
      emailInputError: emailInputError,
      confirmPasswordError: confirmPassword,
    });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const navigate = useNavigate();
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!(event.target.value.trim() === "")) {
      const updatedRegsterData = {
        ...registerData,
        [event.target.id]: event.target.value,
      };
      setResgisterData(updatedRegsterData);
    }
  };
  const handleRegister = () => {
    createUserWithEmailAndPassword(
      auth,
      registerData.email,
      registerData.password
    )
      .then((res) => {
        console.log(res, "inside auth");
      })
      .catch((err) => console.log(err, "AUTH---error"));
  };
  return (
    <div className="flex justify-center items-center h-screen ">
      <FormControl sx={{ m: 1, width: "45ch" }} variant="outlined">
        <div className="flex flex-col gap-y-4 border-solid border-2 border-black-500 p-8 rounded-lg text-center">
          <p className="text-3xl text-indigo-600">Registration Form</p>
          <TextField
            id="fname"
            label="First Name"
            type="text"
            size="small"
            onChange={handleInputChange}
            onBlur={handleBlur}
          />
          <TextField
            id="lname"
            label="Last Name"
            type="text"
            size="small"
            onChange={handleInputChange}
            onBlur={handleBlur}
          />
          <TextField
            size="small"
            id="phoneNumber"
            label="Phone Number"
            type="number"
            onChange={handleInputChange}
          />
          <TextField
            id="email"
            label="E-mail"
            size="small"
            onChange={handleInputChange}
            onBlur={handleBlur}
          />

          <FormControl variant="outlined" size="small">
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              onChange={handleInputChange}
              onBlur={handleBlur}
              id="password"
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((show) => !show)}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
          <FormControl variant="outlined" size="small">
            <InputLabel htmlFor="outlined-adornment-password">
              Confirm Password
            </InputLabel>
            <OutlinedInput
              id="confirmPassword"
              onBlur={handleBlur}
              onChange={handleInputChange}
              size="small"
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle passwosrd visibility"
                    onClick={() => setShowPassword((show) => !show)}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Confirm-Password"
            />
          </FormControl>
          <Button
            component="label"
            size="small"
            variant="contained"
            startIcon={<CloudUploadIcon />}
          >
            Upload Profile Pic
            <VisuallyHiddenInput type="file" />
          </Button>
          <Button variant="contained" onClick={handleRegister}>
            Register
          </Button>
          <h3 className="underline underline-offset-4">
            Already have an account
          </h3>
          <h3
            className="underline underline-offset-4 cursor-pointer"
            onClick={() => navigate("/")}
          >
            LOG IN
          </h3>
        </div>
      </FormControl>
    </div>
  );
};

export default SignupPage;
