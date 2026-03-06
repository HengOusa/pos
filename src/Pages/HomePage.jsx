import React from "react";
import { useEffect } from "react";
import { request } from "../utils/resquest";
import { useState } from "react";
import HomeGrid from "./components/HomeGrid";

const HomePage = () => {
  const [home, setHome] = useState([]);
  useEffect(() => {
    getList();
  });
  const getList = async () => {
    const res = await request("home", "get");
    if (res) {
      setHome(res.list);
    }
  };
  return (
    <div>
      <HomeGrid data={home} />
    </div>
  );
};

export default HomePage;
