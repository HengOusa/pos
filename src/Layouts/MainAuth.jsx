import React from "react";
import { Outlet } from "react-router-dom";

const MainAuth = () => {
  return (
    <>
      <div>
        <Outlet />
      </div>
    </>
  );
};

export default MainAuth;
