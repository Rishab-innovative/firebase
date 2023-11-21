import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import UserProfilePage from "./pages/UserProfilePage";
import EditDetailsPage from "./pages/EditDetailsPage";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/signup" element={<SignupPage />}></Route>
        <Route path="/" element={<LoginPage />}></Route>
        <Route path="/editDetail" element={<EditDetailsPage />}></Route>

        <Route path="/userProfile" element={<UserProfilePage />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
