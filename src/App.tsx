import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignupPage />}></Route>

        <Route path="/" element={<LoginPage />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
