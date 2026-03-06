import React from "react";
import { Row, Col, Card, Typography } from "antd";

const { Title, Text } = Typography;

const HomeGrid = ({ data = [] }) => {
  return (
    <Row gutter={[16, 16]}>
      {data.map((item, index) => (
        <Col key={index} xs={24} sm={12} md={8} lg={6} xl={6}>
          <Card hoverable style={{ borderRadius: 12 }}>
            <Text type="primary">{item?.title}</Text>
            <Title level={3} style={{ margin: 0 }}>
              {item?.obj?.total ?? 0}
            </Title>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default HomeGrid;
