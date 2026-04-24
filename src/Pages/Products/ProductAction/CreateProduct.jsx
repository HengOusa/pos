import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Upload,
} from "antd";
import { request } from "../../../utils/request";

const { Option } = Select;

const CreateProduct = ({ categories = [], brands = [], suppliers = [] }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [fileList, setFileList] = useState([]);

  const handleSubmit = async (values) => {
    console.log("Form Values:", values);
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === "is_active") {
          formData.append(key, value ? 1 : 0);
        } else {
          formData.append(key, value);
        }
      });
      if (imageFile) {
        formData.append("image", imageFile);
      }

      
      const res = await request("products", "post", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("API Response:", res);
      if (res && !res.errors) {
        message.success("Product added successfully");
        navigate("/products/list");
      } else if (res.errors) {
        message.error(res.errors.message || "Failed to add product");
        console.log("Validation errors:", res.errors);
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spin style={{ marginTop: 100 }} />;

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <h2 className="text-xl text-blue-600 underline">
          <strong>Add New Product</strong>
        </h2>
      </div>

      <Card title="Add Product">
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
                <Select
                  optionFilterProp="children"
                  showSearch
                  allowClear
                  placeholder="Select Category"
                >
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
                <Select
                  optionFilterProp="children"
                  showSearch
                  allowClear
                  placeholder="Select Brand"
                >
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
                <Select
                  optionFilterProp="children"
                  showSearch
                  allowClear
                  placeholder="Select Supplier"
                >
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
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  formatter={(value) => `$ ${value}`}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
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
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  formatter={(value) => `$ ${value}`}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
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
              <Form.Item label="Product Image" name="image">
                <Upload
                  accept="image/*"
                  listType="picture-card"
                  fileList={fileList}
                  beforeUpload={(file) => {
                    setImageFile(file);
                    const reader = new FileReader();
                    reader.onloadend = () => setImagePreview(reader.result);
                    reader.readAsDataURL(file);
                    setFileList([
                      {
                        uid: file.uid,
                        name: file.name,
                        status: "done",
                        url: URL.createObjectURL(file),
                      },
                    ]);
                    return false; // Prevent auto upload
                  }}
                  onRemove={() => {
                    setImageFile(null);
                    setImagePreview(null);
                    setFileList([]);
                  }}
                  showUploadList={{ showPreviewIcon: true }}
                >
                  {fileList.length >= 1 ? null : (
                    <div>
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
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
              <Button onClick={() => navigate("/products/list")}>Back</Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginLeft: 8 }}
              >
                Add Product
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Card>
    </>
  );
};

export default CreateProduct;
