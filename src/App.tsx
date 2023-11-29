import { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { AppDispatchType, RootState } from "./redux/Store";
import { fetchUserDetails } from "./redux/NavBarSlice";
import ProtectedRoute from "./ProtectedRoute";
import SignupPage from "./pages/SignupPage";
import UserProfilePage from "./pages/UserProfilePage";
import EditUserDetailsPage from "./pages/EditUserDetailsPage";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import "./App.css";

function App() {
  const dispatch = useDispatch<AppDispatchType>();
  const successSignUp = useSelector(
    (state: RootState) => state.registerUser.saveUserDataFulfil
  );

  const [logInStatus, setLogInStatus] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLogInStatus(true);
        dispatch(fetchUserDetails(user.uid));
      } else {
        setLogInStatus(false);
      }
      setLoading(false);
    });
  }, [successSignUp]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Router>
      <Navbar logInStatus={logInStatus} />
      <Routes>
        <Route
          path="/signup"
          element={
            logInStatus ? <Navigate to="/userProfile" /> : <SignupPage />
          }
        />
        <Route
          path="/"
          element={logInStatus ? <Navigate to="/userProfile" /> : <LoginPage />}
        />
        <Route
          path="/editDetail"
          element={
            <ProtectedRoute
              component={EditUserDetailsPage}
              isLoggedIn={logInStatus}
            />
          }
        />
        <Route
          path="/userProfile"
          element={
            <ProtectedRoute
              component={UserProfilePage}
              isLoggedIn={logInStatus}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
