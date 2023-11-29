import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import UserProfilePage from "./pages/UserProfilePage";
import EditDetailsPage from "./pages/EditDetailsPage";
import Navbar from "./components/Navbar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useDispatch } from "react-redux";
import { AppDispatchType, RootState } from "./redux/Store";
import { fetchUserDetails } from "./redux/NavBarSlice";
import ProtectedRoute from "./ProtectedRoute";
import { Box, CircularProgress } from "@mui/material";

function App() {
  const dispatch = useDispatch<AppDispatchType>();

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
  }, []);

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
              component={EditDetailsPage}
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
