import React from "react";
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

const LoginPage = () => {
  const [showPassword, setShowPassword] = React.useState(false);

  const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="flex flex-col gap-y-4 border-solid border-2 border-black-500 p-8 rounded-lg text-center">
        <p className="text-3xl text-indigo-600">LOG IN</p>
        <TextField id="email-id" label="E-mail" size="small" />
        <FormControl variant="outlined" size="small">
          <InputLabel htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
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
        <Button variant="contained">Log In</Button>
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
