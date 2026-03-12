import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  message,
  Switch,
  Card,
  Row,
  Space,
  Col,
  Spin,
} from "antd";
import { request } from "../../../utils/request";

const CreateCategory = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Transform is_active to 0/1 before sending
      const payload = {
        ...values,
        is_active: values.is_active ? 1 : 0,
      };
      alert(JSON.stringify(payload));
      const res = await request("categories", "post", payload);

      alert(JSON.stringify(res));
      // Check if API returned errors
      if (res && !res.errors) {
        message.success("Category added successfully");
        navigate("/products/categories"); // go back to category list
      } else if (res.errors) {
        // Show first error message
        message.error(res.errors.message || "Failed to add category");
        console.log("Validation errors:", res.errors);
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spin style={{ marginTop: 100 }} />;

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <h2 className="text-xl text-blue-600 underline">
          <strong>Add New Category</strong>
        </h2>
      </div>
      <Card title="Add Category">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                label="Category Name"
                name="name"
                rules={[
                  { required: true, message: "Please enter category name" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Description"
                name="description"
                rules={[
                  { required: true, message: "Please enter description" },
                ]}
              >
                <Input.TextArea rows={1} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Status"
                name="is_active"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16} justify="end" align="middle">
            <Form.Item>
              <Space>
                <Button onClick={() => navigate("/products/categories")}>
                  Back
                </Button>
                <Button type="primary" htmlType="submit">
                  Add Category
                </Button>
              </Space>
            </Form.Item>
          </Row>
        </Form>
      </Card>
    </>
  );
};

export default CreateCategory;
