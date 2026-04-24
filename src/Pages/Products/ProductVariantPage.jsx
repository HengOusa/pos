import React, { useEffect, useState } from "react";
import {
  Table,
  message,
  Spin,
  Card,
  Button,
  Popconfirm,
  Space,
  Input,
  Tooltip,
  Row,
  Col,
  Tag,
} from "antd";

import {
  EditOutlined,
  DeleteOutlined,
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

const ProductVariantPage = () => {
  const [state, setState] = useState({
    total: 0,
    variants: [],
    loading: false,
    search: "",
  });
  const { config } = configStore();
  useEffect(() => {
    getList();
  }, []);

  // ================================
  // Fetch Variants
  // ================================
  const getList = async () => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const res = await request("product-variants", "get");

      if (res.status === "success") {
        setState((prev) => ({
          ...prev,
          total: res.total,
          variants: res.variants,
        }));
      }
    } catch (error) {
      message.error("Failed to load variants");
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  // ================================
  // Excel Export
  // ================================
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(state.variants);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Variants");

    const buffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    saveAs(new Blob([buffer]), "variants.xlsx");
  };

  // ================================
  // PDF Export
  // ================================
  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Product Variants", 14, 22);

    const columns = [
      "ID",
      "Product ID",
      "Variant Name",
      "Additional Price",
      "Stock",
      "Created At",
    ];

    const rows = state.variants.map((v) => [
      v.variant_id,
      v.product_id,
      v.name,
      `$${v.additional_price}`,
      v.stock,
      new Date(v.created_at).toLocaleString(),
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 30,
      theme: "grid",
    });

    doc.save("variants.pdf");
  };

  // ================================
  // Edit
  // ================================
  const handleEdit = (record) => {
    console.log("Edit:", record);
  };

  // ================================
  // Delete
  // ================================
  const handleDelete = (id) => {
    console.log("Delete:", id);
  };

  // ================================
  // Search Filter
  // ================================
  const filteredData = state.variants.filter((item) =>
    item.name.toLowerCase().includes(state.search.toLowerCase()),
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
      title: "Product",
      dataIndex: "product_id",
      render: (value) => {
        const product = config?.products.find(
          (item) => item.product_id === value,
        );
        return product ? product.name : "-";
      },
    },
    {
      title: "Variant Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (value) => <strong className="font-semibold">{value}</strong>,
    },
    {
      title: "Additional Price",
      dataIndex: "additional_price",
      align: "center",
      render: (value) => `$${value}`,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      align: "center",
      sorter: (a, b) => a.stock - b.stock,
      render: (stock) =>
        stock < 10 ? (
          <Tag color="red">{stock}</Tag>
        ) : (
          <Tag color="green">{stock}</Tag>
        ),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Action",
      align: "center",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Variant">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>

          <Popconfirm
            title="Delete Variant"
            description="Are you sure you want to delete this variant?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record.variant_id)}
          >
            <Tooltip title="Delete Variant">
              <Button danger shape="circle" icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="mb-3 flex justify-between items-center">
        <h2 className="font-semibold text-lg bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent underline">
          Product Variants
        </h2>
      </div>

      <Card>
        <Row style={{ marginBottom: 10, flexWrap: "wrap" }} gutter={[16, 16]}>
          <Space>
            <Col flex="auto" style={{ minWidth: 200 }}>
              <Input
                placeholder="Search variant..."
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

            <Button type="primary" icon={<PlusOutlined />}>
              Add Variant
            </Button>
          </Space>
        </Row>

        <Spin spinning={state.loading}>
          <Table
            className="custom-table"
            size="small"
            bordered
            columns={columns}
            dataSource={filteredData}
            rowKey="variant_id"
            scroll={{ x: 1000 }}
            pagination={{
              total: state.total,
              pageSizeOptions: ["5", "8", "10", "20", "50", "100"],
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `Total ${total} variants`,
            }}
          />
        </Spin>
      </Card>
    </>
  );
};

export default ProductVariantPage;
