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
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const SupplierPage = () => {
  const [state, setState] = useState({
    total: 0,
    suppliers: [],
    loading: false,
    search: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    getList();
  }, []);

  // ================================
  // Fetch Suppliers
  // ================================
  const getList = async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const res = await request("suppliers", "get"); // <-- your API endpoint

      if (res?.status === "success") {
        setState((prev) => ({
          ...prev,
          total: res.total,
          suppliers: res.suppliers,
        }));
      } else {
        message.error("Failed to load suppliers");
      }
    } catch (error) {
      message.error("Failed to load suppliers");
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  // ================================
  // Export Excel
  // ================================
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(state.suppliers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Suppliers");

    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buffer]), "suppliers.xlsx");
  };

  // ================================
  // Export PDF
  // ================================
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Supplier List", 14, 22);

    const columns = ["ID", "Name", "Email", "Phone", "Address", "Created At"];

    const rows = state.suppliers.map((s) => [
      s.supplier_id,
      s.name,
      s.email,
      s.phone,
      s.address,
      new Date(s.created_at).toLocaleDateString(),
    ]);

    autoTable(doc, { head: [columns], body: rows, startY: 30, theme: "grid" });

    doc.save("suppliers.pdf");
  };

  // ================================
  // Delete Supplier
  // ================================
  const handleDelete = async (id) => {
    try {
      const res = await request(`suppliers/${id}`, "delete");
      if (res?.status !== "success") {
        message.error(res.errors?.message || "Delete failed");
        return;
      }
      message.success("Supplier deleted successfully");
      getList();
    } catch (error) {
      message.error("Delete failed");
    }
  };

  // ================================
  // Search Filter
  // ================================
  const filteredData = state.suppliers.filter(
    (item) =>
      item.name.toLowerCase().includes(state.search.toLowerCase()) ||
      item.email.toLowerCase().includes(state.search.toLowerCase()),
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
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      align: "center",
      render: (date) => new Date(date).toLocaleDateString(),
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
      align: "center",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Supplier">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => navigate(`/suppliers/edit/${record.supplier_id}`)}
            />
          </Tooltip>

          <Popconfirm
            title="Are you sure to delete this supplier?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record.supplier_id)}
          >
            <Button danger shape="circle" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="mb-3 flex justify-between items-center">
        <h2 className="font-semibold text-lg bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent underline">
          Suppliers
        </h2>
      </div>

      <Card>
        <Row style={{ marginBottom: 10 }} gutter={[16, 16]}>
          <Space>
            <Col flex="auto" style={{ minWidth: 200 }}>
              <Input
                placeholder="Search supplier..."
                prefix={<SearchOutlined />}
                allowClear
                onChange={(e) =>
                  setState((prev) => ({ ...prev, search: e.target.value }))
                }
              />
            </Col>

            <Tooltip title="Export Excel">
              <Button icon={<FileExcelOutlined />} onClick={exportToExcel}>
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
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/suppliers/create")}
            >
              Add Supplier
            </Button>
          </Space>
        </Row>

        <Spin spinning={state.loading}>
          <Table
            className="custom-table"
            bordered
            size="small"
            columns={columns}
            dataSource={filteredData}
            rowKey="supplier_id"
            scroll={{ x: 1000 }}
            pagination={{
              total: state.total,
              pageSizeOptions: ["5", "8", "10", "20", "50", "100"],
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `Total ${total} suppliers`,
            }}
          />
        </Spin>
      </Card>
    </>
  );
};

export default SupplierPage;
