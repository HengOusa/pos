import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Form,
  Input,
  InputNumber,
  Button,
  message,
  Switch,
  Card,
  Row,
  Col,
  Spin,
  Select,
} from "antd";
import { request } from "../../../utils/request";

const { Option } = Select;

const EditProduct = ({ categories = [], brands = [], suppliers = [] }) => {
  const navigate = useNavigate();
  const { id } = useParams(); // product_id from route
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch product detail
  const fetchProduct = async () => {
    try {
      const res = await request(`products/${id}`, "get");

      if (res?.product) {
        form.setFieldsValue({
          ...res.product,
          is_active: res.product.is_active === 1,
        });
      }
    } catch (error) {
      message.error("Failed to load product");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // Update product
  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      const payload = {
        ...values,
        is_active: values.is_active ? 1 : 0,
      };

      const res = await request(`products/${id}`, "put", payload);

      if (res && !res.errors) {
        message.success("Product updated successfully");
        navigate("/products/list");
      } else {
        message.error(res.errors?.message || "Update failed");
      }
    } catch (error) {
      message.error("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Spin style={{ marginTop: 100 }} />;

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <h2 className="text-xl text-blue-600 underline">
          <strong>Edit Product</strong>
        </h2>
      </div>

      <Card title="Update Product">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                label="Product Name"
                name="name"
                rules={[
                  { required: true, message: "Please enter product name" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Barcode"
                name="barcode"
                rules={[{ required: true, message: "Please enter barcode" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Category"
                name="category_id"
                rules={[{ required: true, message: "Please select category" }]}
              >
                <Select showSearch allowClear placeholder="Select Category">
                  {categories.map((cat) => (
                    <Option key={cat.category_id} value={cat.category_id}>
                      {cat.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Brand"
                name="brand_id"
                rules={[{ required: true, message: "Please select brand" }]}
              >
                <Select showSearch allowClear placeholder="Select Brand">
                  {brands.map((brand) => (
                    <Option key={brand.brand_id} value={brand.brand_id}>
                      {brand.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Supplier"
                name="supplier_id"
                rules={[{ required: true, message: "Please select supplier" }]}
              >
                <Select showSearch allowClear placeholder="Select Supplier">
                  {suppliers.map((sup) => (
                    <Option key={sup.supplier_id} value={sup.supplier_id}>
                      {sup.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Cost Price"
                name="cost_price"
                rules={[{ required: true, message: "Please enter cost price" }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Selling Price"
                name="selling_price"
                rules={[
                  { required: true, message: "Please enter selling price" },
                ]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Stock"
                name="stock"
                rules={[
                  { required: true, message: "Please enter stock quantity" },
                ]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Reorder Level"
                name="reorder_level"
                rules={[
                  { required: true, message: "Please enter reorder level" },
                ]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Status"
                name="is_active"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Row justify="end">
            <Form.Item>
              <Button onClick={() => navigate("/products/list")}>Back</Button>

              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ marginLeft: 8 }}
              >
                Update Product
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Card>
    </>
  );
};

export default EditProduct;
