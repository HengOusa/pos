import React, { useEffect, useState } from "react";
import {
  Table,
  message,
  Spin,
  Card,
  Button,
  Space,
  Input,
  Switch,
  Tooltip,
  Row,
  Col,
  Tag,
  Image,
} from "antd";

import {
  EditOutlined,
  EyeOutlined,
  SearchOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import { request } from "../../utils/request";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { configStore } from "../../Stores/config.store";
import { useNavigate } from "react-router-dom";
import configImage from "../../utils/config";

const ProductPage = () => {
  const [state, setState] = useState({
    total: 0,
    products: [],
    loading: false,
    search: "",
  });
  const navigate = useNavigate();
  const { config } = configStore();

  useEffect(() => {
    getList();
  }, []);

  // ================================
  // Fetch Products
  // ================================
  const getList = async () => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const res = await request("products", "get");

      if (res.status === "success") {
        setState((prev) => ({
          ...prev,
          total: res.total,
          products: res.products,
        }));
      }
    } catch (error) {
      message.error("Failed to load products");
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  // ================================
  // Excel Export
  // ================================
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(state.products);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Products");

    const buffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    saveAs(new Blob([buffer]), "products.xlsx");
  };

  // ================================
  // PDF Export
  // ================================
  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Product List", 14, 22);

    const columns = [
      "ID",
      "Name",
      "Barcode",
      "Cost Price",
      "Selling Price",
      "Stock",
    ];

    const rows = state.products.map((p) => [
      p.product_id,
      p.name,
      p.barcode,
      p.cost_price,
      p.selling_price,
      p.stock,
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 30,
      theme: "grid",
    });

    doc.save("products.pdf");
  };

  // ================================
  // Edit
  // ================================
  const handleEdit = (record) => {
    navigate(`/products/edit/${record.product_id}`);
  };

  // ================================
  // Delete
  // ================================
  const handleDelete = (id) => {
    console.log("Delete:", id);
  };
  const handleToggleStatus = async (id, status) => {
    const numericStatus = status ? 1 : 0;
    var changeStatus = {
      is_active: numericStatus,
    };
    try {
      // Send PATCH request to toggle status
      const res = await request(`products/${id}/status`, "patch", changeStatus);

      // Check response
      if (res.status === "success") {
        message.success("Product status updated!");
        getList(); // Refresh table
      } else {
        message.error("Failed to update status");
      }
    } catch (error) {
      message.error("Failed to update status");
      console.error(error);
    }
  };
  // ================================
  // Search Filter
  // ================================
  const filteredData = state.products.filter(
    (item) =>
      item.name.toLowerCase().includes(state.search.toLowerCase()) ||
      item.barcode.toLowerCase().includes(state.search.toLowerCase()),
  );

  // ================================
  // Table Columns
  // ================================
  const columns = [
    {
      title: "No.",
      align: "center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Product_Name",
      dataIndex: "name",
      width: 150,
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (value) => <strong className="font-semibold">{value}</strong>,
    },
    {
      title: "Barcode",
      dataIndex: "barcode",
      width: 100,
    },
    {
      title: "Category",
      dataIndex: "category_id",
      render: (value) => {
        const category = config?.categories.find(
          (item) => item.category_id == value,
        );
        return category ? category.name : value;
      },
    },
    {
      title: "Brand",
      dataIndex: "brand_id",
      render: (value) => {
        const brand = config?.brands.find((item) => item.brand_id == value);
        return brand ? brand.name : "-";
      },
    },
    {
      title: "Supplier",
      dataIndex: "supplier_id",
      render: (value) => {
        const supplier = config?.suppliers.find(
          (item) => item.supplier_id === value,
        );
        return supplier ? supplier.name : "-";
      },
    },
    {
      title: "Cost_Price",
      dataIndex: "cost_price",

      render: (value) => `$${value}`,
    },
    {
      title: "Selling_Price",
      dataIndex: "selling_price",
      width: 120,
      render: (value) => `$${value}`,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      width: 50,
      align: "center",
      renderMethod: (value) => (
        <Tag color={value < 10 ? "red" : "green"}>{value}</Tag>
      ),
    },
    {
      title: "Reorder_Level",
      dataIndex: "reorder_level",
      width: 110,
      align: "center",
    },

    {
      title: "Created_By",
      dataIndex: "created_by",
      width: 120,
      render: (value) => {
        const user = config?.users.find((item) => item.user_id === value);
        return user ? user.name : "-";
      },
    },
    {
      title: "Image",
      dataIndex: "image",
      align: "center",
      fixed: "right",
      render: (url) =>
        url ? (
          <Image
            src={configImage.image_path + url}
            alt="Product"
            width={50}
            height={50}
            style={{ objectFit: "cover", borderRadius: 4 }}
            preview={{ mask: <EyeOutlined style={{ fontSize: 20 }} /> }}
          />
        ) : (
          "No Image"
        ),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      align: "center",
      render: (value) => (
        <span
          style={{
            color: value === 1 ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {value === 1 ? "Active" : "Inactive"}
        </span>
      ),
    },

    {
      title: "Action",
      key: "action",
      align: "center",
      fixed: "right",
      width: 140,
      overflow: "hidden",
      render: (_, record) => (
        <Space size="small">
          {/* Toggle Active Status */}
          <Switch
            checked={record.is_active}
            onChange={(checked) =>
              handleToggleStatus(record.product_id, checked)
            }
          />

          {/* Edit Button */}
          <Tooltip title="Edit Product">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>

          {/* View Button */}
          <Tooltip title="View Product">
            <Button
              type="default"
              shape="circle"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="mb-3 flex justify-between items-center">
        <h2 className="font-semibold text-lg bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent underline">
          Products
        </h2>
      </div>

      <Card size="default" className="shadow-sm">
        <Row className="mb-4">
          <Space size="middle" wrap align="center">
            <Col>
              <Input
                placeholder="Search product..."
                prefix={<SearchOutlined />}
                allowClear
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    search: e.target.value,
                  }))
                }
              />
            </Col>

            <Tooltip title="Export Excel">
              <Button
                type="default"
                icon={<FileExcelOutlined />}
                onClick={exportToExcel}
              >
                Excel
              </Button>
            </Tooltip>

            <Tooltip title="Export PDF">
              <Button
                type="primary"
                icon={<FilePdfOutlined />}
                onClick={exportToPDF}
              >
                PDF
              </Button>
            </Tooltip>

            <Button
              onClick={() => navigate("/products/create")}
              type="primary"
              icon={<PlusOutlined />}
            >
              Add Product
            </Button>
          </Space>
        </Row>

        <Spin spinning={state.loading}>
          <Table
            fixedHeader
            className="custom-table"
            size="small"
            bordered
            columns={columns}
            dataSource={filteredData}
            rowKey="product_id"
            scroll={{ x: 1500 }}
            pagination={{
              total: state.total,
              pageSizeOptions: ["5", "8", "10", "20", "50", "100"],
              showSizeChanger: true,
              showQuickJumper: true,

              showTotal: (total) => `Total ${total} products`,
            }}
          />
        </Spin>
      </Card>
    </>
  );
};

export default ProductPage;
