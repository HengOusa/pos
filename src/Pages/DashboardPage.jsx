import React, { useEffect, useState } from "react";
import HomeGrid from "./components/HomeGrid";
import { request } from "../utils/request";
import LineChart from "../Charts/LineChart";

const Dashboard = () => {
  const [home, setHome] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);

      const res = await request("home", "get");

      if (res) {
        setHome(res.list || []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <HomeGrid data={home} loading={loading} />
      <LineChart />
    </div>
  );
};

export default Dashboard;
