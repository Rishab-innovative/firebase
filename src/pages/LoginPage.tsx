import React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../redux/LoginSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatchType, RootState } from "../redux/Store";

interface loginDataType {
  email: string;
  password: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatchType>();
  const loginStatus = useSelector((state: RootState) => state.loginUser);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState<loginDataType>({
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

  const handleLogin = async () => {
    const response = await dispatch(loginUser(loginData));
    if (response.payload) {
      navigate("/userProfile");
    }
  };
  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="flex flex-col gap-y-4 border-solid border-2 border-black-500 p-8 rounded-lg text-center">
        <p className="text-3xl text-indigo-600">LOG IN</p>
        <TextField
          id="email"
          onChange={handleInputChange}
          label="E-mail"
          size="small"
        />
        <FormControl variant="outlined" size="small">
          <InputLabel htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            onChange={handleInputChange}
            id="password"
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword((show) => !show)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
        {loginStatus.isLoading === true ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <Button variant="contained" onClick={handleLogin}>
            Log In
          </Button>
        )}
        {loginStatus.isRejected === true ? (
          <p className="text-red-600">User Not Found</p>
        ) : null}
        <h3 className="">Not a member?</h3>
        <h3
          className="underline underline-offset-4 text-indigo-600 cursor-pointer"
          onClick={() => navigate("/signup")}
        >
          SIGNUP HERE
        </h3>
      </div>
    </div>
  );
};

export default LoginPage;
