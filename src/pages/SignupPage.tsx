import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import { RootState } from "../redux/Store";
import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useState, FocusEvent } from "react";
import InputLabel from "@mui/material/InputLabel";
import { styled } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate } from "react-router-dom";
import { imageDb } from "../firebase";
import { ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { RegistrationFormData } from "../redux/RegisterSlice";
import { useDispatch, useSelector } from "react-redux";

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
  phoneNumber: string | number;
  email: string;
  password: string;
  picture?: File | null;
  confirmPassword: string;
}
const SignupPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const [registerData, setResgisterData] = useState<registerDataType>({
    fname: "",
    lname: "",
    phoneNumber: "",
    email: "",
    password: "",
    picture: null,
    confirmPassword: "",
  });
  const [inputFieldError, setInputFieldError] = useState({
    firstNameError: false,
    lastNameError: false,
    phoneNumberError: false,
    emailInputError: false,
    passwordError: false,
    confirmPasswordError: false,
  });
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
  let fname = false;
  let lname = false;
  let emailInputError = false;
  let passError = false;
  let confirmPassword = false;
  let numError = false;

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    if (event.target.id === "fname") {
      if (registerData.fname.length < 5) {
        fname = true;
      }
    } else if (event.target.id === "lname") {
      if (registerData.lname.length < 5) {
        lname = true;
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
    } else if (event.target.id === "phoneNumber") {
      if (registerData.phoneNumber.toString().length < 10) {
        numError = true;
      }
    } else if (event.target.id === "password") {
      if (!passwordRegex.test(registerData.password)) {
        passError = true;
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
      phoneNumberError: numError,
      emailInputError: emailInputError,
      confirmPasswordError: confirmPassword,
    });
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const registerStatus = useSelector((state: RootState) => state.registerUser);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!(event.target.value.trim() === "")) {
      const updatedRegsterData = {
        ...registerData,
        [event.target.id]: event.target.value,
      };
      setResgisterData(updatedRegsterData);
    }
  };

  const handleRegister = async () => {
    if (
      inputFieldError.firstNameError ||
      inputFieldError.lastNameError ||
      inputFieldError.phoneNumberError ||
      inputFieldError.emailInputError ||
      inputFieldError.passwordError ||
      inputFieldError.confirmPasswordError
    ) {
      return;
    }
    const registrationAction: any = RegistrationFormData({
      email: registerData.email,
      password: registerData.password,
    });

    if (registerData.picture) {
      const pictureRef = ref(imageDb, `files/${v4()}`);
      uploadBytes(pictureRef, registerData.picture).then((value) => {});
    }
    const response = await dispatch(registrationAction);
    if (response.payload) {
      navigate("/userProfile");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen ">
      <FormControl sx={{ m: 1, width: "45ch" }} variant="outlined">
        <div className="flex flex-col gap-y-4 border-solid border-2 border-black-500 p-8 rounded-lg text-center">
          <p className="text-3xl text-indigo-600">Registration Form</p>
          <TextField
            id="fname"
            required
            error={inputFieldError.firstNameError ? true : false}
            label="First Name"
            type="text"
            size="small"
            helperText={
              inputFieldError.firstNameError ? "Must contain 5 alphabets" : ""
            }
            onChange={handleInputChange}
            onBlur={handleBlur}
          />
          <TextField
            required
            error={inputFieldError.lastNameError ? true : false}
            id="lname"
            label="Last Name"
            type="text"
            size="small"
            helperText={
              inputFieldError.lastNameError ? "Must contain 5 alphabets" : ""
            }
            onChange={handleInputChange}
            onBlur={handleBlur}
          />
          <TextField
            size="small"
            required
            error={inputFieldError.phoneNumberError ? true : false}
            id="phoneNumber"
            label="Phone Number"
            helperText={
              inputFieldError.phoneNumberError
                ? "Number must have 10 digits"
                : ""
            }
            type="number"
            onChange={handleInputChange}
            onBlur={handleBlur}
          />
          <TextField
            id="email"
            label="E-mail"
            required
            error={inputFieldError.emailInputError ? true : false}
            size="small"
            helperText={
              inputFieldError.emailInputError ? "Enter a valid email" : ""
            }
            onChange={handleInputChange}
            onBlur={handleBlur}
          />

          <FormControl
            required
            variant="outlined"
            size="small"
            error={inputFieldError.passwordError ? true : false}
          >
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              onChange={handleInputChange}
              onBlur={handleBlur}
              id="password"
              type={showPassword.password ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password"
                    onClick={() =>
                      setShowPassword({
                        ...showPassword,
                        password: !showPassword.password,
                      })
                    }
                    edge="end"
                  >
                    {showPassword.password ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
            {inputFieldError.passwordError ? (
              <FormHelperText>
                Password must contain 8 letters including 1 Number, 1 Upper &
                lower case and 1 special character.
              </FormHelperText>
            ) : (
              false
            )}
          </FormControl>

          <FormControl
            required
            variant="outlined"
            size="small"
            error={inputFieldError.confirmPasswordError ? true : false}
          >
            <InputLabel htmlFor="outlined-adornment-password">
              Confirm Password
            </InputLabel>
            <OutlinedInput
              id="confirmPassword"
              onBlur={handleBlur}
              onChange={handleInputChange}
              size="small"
              type={showPassword.confirmPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle passwosrd visibility"
                    onClick={() =>
                      setShowPassword({
                        ...showPassword,
                        confirmPassword: !showPassword.confirmPassword,
                      })
                    }
                    edge="end"
                  >
                    {showPassword.confirmPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              }
              label="Confirm-Password"
            />
            {inputFieldError.confirmPasswordError ? (
              <FormHelperText>
                Please Write the same Password as above
              </FormHelperText>
            ) : (
              false
            )}
          </FormControl>
          <Button
            id="picture"
            component="label"
            size="small"
            variant="contained"
            startIcon={<CloudUploadIcon />}
          >
            Upload Profile Pic
            <VisuallyHiddenInput
              type="file"
              accept="image/png,image/jpeg"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files && e.target.files[0]) {
                  setResgisterData({
                    ...registerData,
                    picture: e.target.files[0] as File,
                  });
                }
              }}
            />
          </Button>
          {registerStatus.isLoading === true ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : (
            <Button variant="contained" onClick={handleRegister}>
              Register
            </Button>
          )}

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
