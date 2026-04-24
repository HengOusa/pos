import React, { useEffect, useState } from "react";
import { Row, Col, Button } from "antd";
import HomeGrid from "./components/HomeGrid";
import { request } from "../utils/request";
import LineChart from "../Charts/LineChart";
import Counter from "./components/Counter";
import { configStore } from "../Stores/config.store";

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

      <Row gutter={24}>
        <Col span={12}>
          <LineChart />
        </Col>

        <Col span={12}>
          <LineChart />
        </Col>
        <Counter />
      </Row>
    </div>
  );
};

export default Dashboard;
