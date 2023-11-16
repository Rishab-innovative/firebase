import React from "react";
import Navbar from "../components/Navbar";

const UserProfilePage: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="text-center text-orange-700">
        THis is user profile page
      </div>
    </>
  );
};

export default UserProfilePage;
