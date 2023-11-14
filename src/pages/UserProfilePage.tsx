import React from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="text-center text-orange-700">
        THis is user profile page
      </div>
      <Button variant="contained" onClick={() => navigate("/")}>
        LOGOUT
      </Button>
    </>
  );
};

export default UserProfilePage;
