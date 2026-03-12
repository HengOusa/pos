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
  Typography,
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

const ProductPage = () => {
  const [state, setState] = useState({
    total: 0,
    categories: [],
    loading: false,
    search: "",
  });

  useEffect(() => {
    getList();
  }, []);

  // ================================
  // Fetch Categories
  // ================================
  const getList = async () => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const res = await request("products", "get");

      if (res.status == "success") {
        setState((prev) => ({
          ...prev,
          total: res.total,
          categories: res.categories,
        }));
      }
    } catch (error) {
      message.error("Failed to load categories");
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  // ================================
  // Excel Export
  // ================================
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(state.categories);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Categories");

    const buffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    saveAs(new Blob([buffer]), "categories.xlsx");
  };

  // ================================
  // PDF Export
  // ================================
  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Category List", 14, 22);

    const columns = ["ID", "Name", "Description", "Status"];

    const rows = state.categories.map((cat) => [
      cat.category_id,
      cat.name,
      cat.description,
      cat.is_active === 1 ? "Active" : "Inactive",
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 30,
      theme: "grid",
    });

    doc.save("categories.pdf");
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
  const filteredData = state.categories.filter(
    (item) =>
      item.name.toLowerCase().includes(state.search.toLowerCase()) ||
      item.description.toLowerCase().includes(state.search.toLowerCase()),
  );

  // ================================
  // Table Columns
  // ================================
  const columns = [
    {
      title: "ID",
      dataIndex: "category_id",
      align: "center",
      sorter: (a, b) => a.category_id - b.category_id,
    },
    {
      title: "Category Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Status",
      dataIndex: "is_active",
      align: "center",
      render: (value) =>
        value === 1 ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
    },
    {
      title: "Action",
      align: "center",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Category">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>

          <Popconfirm
            title="Delete Category"
            description="Are you sure you want to delete this category?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record.category_id)}
          >
            <Tooltip title="Delete Category">
              <Button danger shape="circle" icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="mb-2 flex justify-between  rounded-2xl">
        <h2 className="text-[20px]">Categories</h2>
      </div>

      <Card>
        <Row style={{ marginBottom: 10, flexWrap: "wrap" }} gutter={[16, 16]}>
          <Space>
            <Col flex="auto" style={{ minWidth: 200 }}>
              <Input
                placeholder="Search category..."
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
              Add Category
            </Button>
          </Space>
        </Row>

        {/* Table */}
        <Spin spinning={state.loading}>
          <Table
            className="custom-table"
            size="small"
            bordered
            columns={columns}
            dataSource={filteredData}
            rowKey="category_id"
            scroll={{ x: 1000 }}
            pagination={{
              total: state.total,
              pageSize: 6,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `Total ${total} categories`,
            }}
          />
        </Spin>
      </Card>
    </>
  );
};

export default ProductPage;
