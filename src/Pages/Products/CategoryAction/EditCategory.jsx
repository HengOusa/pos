import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  message,
  Switch,
  Card,
  Row,
  Col,
  Spin,
  Space,
} from "antd";
import { request } from "../../../utils/request";

const EditCategory = () => {
  const { id } = useParams(); // get category id from URL
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState(null);
  const [state, setState] = useState([]);

  useEffect(() => {
    fetchCategory();
  }, [id]);

  const fetchCategory = async () => {
    setLoading(true);
    try {
      const res = await request(`categories/${id}`, "get"); // get category by ID
      // alert(JSON.stringify(res))
      const category = res.category;
      setState(category);
      if (res?.status == "success") {
        setCategory(res);
        form.setFieldsValue({
          name: res.category.name,
          description: res.category.description,
          is_active: res.category.is_active === 1,
        });
      } else {
        message.error("Failed to load category");
      }
    } catch (error) {
      message.error("Failed to load category");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const res = await request(`categories/${id}`, "put", {
        ...values,
        is_active: values.is_active ? 1 : 0,
      });
      if (res.status == "success") {
        message.success("Category updated successfully");
        navigate("/products/categories"); // go back to category list
      } else {
        message.warning(res.errors.message);
      }
    } catch (error) {
      message.error("Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !category) return <Spin style={{ marginTop: 100 }} />;

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <h2>
          Edit Category:{" "}
          <strong className="text-blue-500 text-xl"> {state.name}</strong>
        </h2>
      </div>
      <Card title="Edit Category">
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
                  Update
                </Button>
              </Space>
            </Form.Item>
          </Row>
        </Form>
      </Card>
    </>
  );
};

export default EditCategory;
