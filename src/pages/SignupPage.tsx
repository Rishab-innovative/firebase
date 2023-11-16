import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import { AppDispatchType, RootState } from "../redux/Store";
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
import signUpSchema from "../schema";
import { useFormik } from "formik";
import { RegistrationFormData, SaveUserData } from "../redux/RegisterSlice";
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
  picture: File | null;
  confirmPassword: string;
}
const SignupPage: React.FC = () => {
  const [alreadyUser, setAlreadyUser] = useState(false);
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

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatchType>();
  const registerStatus = useSelector((state: RootState) => state.registerUser);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!(event.target.value.trim() === "")) {
      const updatedRegsterData = {
        ...registerData,
        [event.target.name]: event.target.value,
      };
      setResgisterData(updatedRegsterData);
    }
  };

  const formik = useFormik({
    initialValues: {
      fname: "",
      lname: "",
      phoneNumber: "",
      email: "",
      password: "",
      picture: registerData.picture,
      confirmPassword: "",
    },
    validationSchema: signUpSchema,
    onSubmit: async (values: any) => {
      const registrationAction: any = RegistrationFormData({
        email: values.email,
        password: values.password,
      });
      const response = await dispatch(registrationAction);

      if (!response.error) {
        dispatch(SaveUserData(registerData));

        navigate("/userProfile");
      } else {
        setAlreadyUser(true);
      }
    },
  });
  return (
    <div className="flex justify-center items-center h-screen ">
      <form onSubmit={formik.handleSubmit}>
        <FormControl sx={{ m: 1, width: "45ch" }} variant="outlined">
          <div className="flex flex-col gap-y-4 border-solid border-2 border-black-500 p-8 rounded-lg text-center">
            <p className="text-3xl text-indigo-600">Registration Form</p>
            <TextField
              name="fname"
              required
              label="First Name"
              type="text"
              size="small"
              value={formik.values.fname}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                formik.handleChange(event);
                handleInputChange(event);
              }}
              onBlur={formik.handleBlur}
              helperText={
                (formik.touched.fname && formik.errors.fname?.toString()) || ""
              }
              error={formik.touched.fname && Boolean(formik.errors.fname)}
            />
            <TextField
              required
              name="lname"
              label="Last Name"
              type="text"
              size="small"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                formik.handleChange(event);
                handleInputChange(event);
              }}
              onBlur={formik.handleBlur}
              value={formik.values.lname}
              error={formik.touched.lname && Boolean(formik.errors.lname)}
              helperText={
                (formik.touched.lname && formik.errors.lname?.toString()) || ""
              }
            />
            <TextField
              size="small"
              name="phoneNumber"
              required
              label="Phone Number"
              type="number"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                formik.handleChange(event);
                handleInputChange(event);
              }}
              onBlur={formik.handleBlur}
              value={formik.values.phoneNumber}
              error={
                formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)
              }
              helperText={
                (formik.touched.phoneNumber &&
                  formik.errors.phoneNumber?.toString()) ||
                ""
              }
            />
            <TextField
              id="email"
              name="email"
              label="E-mail"
              required
              size="small"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                formik.handleChange(event);
                handleInputChange(event);
              }}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={
                (formik.touched.email && formik.errors.email?.toString()) || ""
              }
            />

            <FormControl
              variant="outlined"
              size="small"
              error={formik.touched.password && Boolean(formik.errors.password)}
            >
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  formik.handleChange(event);
                  handleInputChange(event);
                }}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                name="password"
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
                      {showPassword.password ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
              <FormHelperText>
                {formik.touched.password && formik.errors.password?.toString()}
              </FormHelperText>
            </FormControl>

            <FormControl
              required
              variant="outlined"
              size="small"
              error={
                formik.touched.confirmPassword &&
                Boolean(formik.errors.confirmPassword)
              }
            >
              <InputLabel htmlFor="outlined-adornment-password">
                Confirm Password
              </InputLabel>
              <OutlinedInput
                name="confirmPassword"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  formik.handleChange(event);
                  handleInputChange(event);
                }}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
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
              <FormHelperText>
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword?.toString()}
              </FormHelperText>
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
            {registerData.picture ? (
              <p className="text-green-500">
                Proifle picture uploaded successfully
              </p>
            ) : null}
            {registerStatus.isLoading === true ? (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Box>
            ) : (
              <Button
                variant="contained"
                disabled={!formik.isValid || !registerData.picture}
                type="submit"
              >
                Register
              </Button>
            )}
            {alreadyUser ? (
              <p className="text-red-600">Email already registered</p>
            ) : null}

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
      </form>
    </div>
  );
};

export default SignupPage;
