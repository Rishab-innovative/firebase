// import { useEffect, useState } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import "./App.css";
// import LoginPage from "./pages/LoginPage";
// import SignupPage from "./pages/SignupPage";
// import UserProfilePage from "./pages/UserProfilePage";
// import EditDetailsPage from "./pages/EditDetailsPage";
// import Navbar from "./components/Navbar";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "./firebase";
// import { useSelector, useDispatch } from "react-redux";
// import { AppDispatchType, RootState } from "./redux/Store";
// import { fetchUserDetails } from "./redux/NavBarSlice";
// import ProtectedRoute from "./ProtectedRoute";

// function App() {
//   const dispatch = useDispatch<AppDispatchType>();

// const [logInStatus, setLogInStatus] = useState(false);

// useEffect(() => {
//   onAuthStateChanged(auth, (user) => {
//     if (user) {
//       setLogInStatus(true);
//       dispatch(fetchUserDetails(user.uid));
//     } else {
//       setLogInStatus(false);
//     }
//   });
// }, []);

//   return (
//     <Router>
//       <Navbar logInStatus={logInStatus} />
//       <Routes>
//         <Route
//           path="/signup"
//           element={
//             logInStatus ? <Navigate to="/userProfile" /> : <SignupPage />
//           }
//         />
//         <Route
//           path="/"
//           element={logInStatus ? <Navigate to="/userProfile" /> : <LoginPage />}
//         />
//         <Route
//           path="/editDetail"
//           element={
//             <ProtectedRoute
//               component={EditDetailsPage}
//               isLoggedIn={logInStatus}
//             />
//           }
//         />
//         <Route
//           path="/userProfile"
//           element={
//             <ProtectedRoute
//               component={UserProfilePage}
//               isLoggedIn={logInStatus}
//             />
//           }
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import UserProfilePage from "./pages/UserProfilePage";
import { useEffect, useState } from "react";
import { fetchUserDetails } from "./redux/NavBarSlice";
import Navbar from "./components/Navbar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatchType, RootState } from "./redux/Store";
import EditDetailsPage from "./pages/EditDetailsPage";

function App() {
  const [logInStatus, setLogInStatus] = useState(false);
  const dispatch = useDispatch<AppDispatchType>();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLogInStatus(true);
        dispatch(fetchUserDetails(user.uid));
      } else {
        setLogInStatus(false);
      }
    });
  }, []);
  return (
    <Router>
      <Navbar logInStatus={logInStatus} />
      <Routes>
        <Route path="/signup" element={<SignupPage />}></Route>
        <Route path="/" element={<LoginPage />}></Route>
        <Route path="/userProfile" element={<UserProfilePage />}></Route>
        <Route path="/editDetail" element={<EditDetailsPage />}>
          {" "}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
