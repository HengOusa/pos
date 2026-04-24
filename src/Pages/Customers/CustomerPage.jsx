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
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const CustomerPage = () => {
  const [state, setState] = useState({
    total: 0,
    customers: [],
    loading: false,
    search: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    getList();
  }, []);

  // ================================
  // Fetch Customers
  // ================================
  const getList = async () => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const res = await request("customers", "get");

      if (res?.status === "success") {
        setState((prev) => ({
          ...prev,
          total: res.total,
          customers: res.customers,
        }));
      } else {
        message.error("Failed to load customers");
      }
    } catch (error) {
      message.error("Failed to load customers");
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  // ================================
  // Export Excel
  // ================================
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(state.customers);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Customers");

    const buffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    saveAs(new Blob([buffer]), "customers.xlsx");
  };

  // ================================
  // Export PDF
  // ================================
  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Customer List", 14, 22);

    const columns = [
      "ID",
      "Name",
      "Email",
      "Phone",
      "Gender",
      "Address",
      "Points",
      "Created",
    ];

    const rows = state.customers.map((c) => [
      c.customer_id,
      c.name,
      c.email,
      c.phone,
      c.gender,
      c.address,
      c.loyalty_points,
      new Date(c.created_at).toLocaleDateString(),
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 30,
      theme: "grid",
    });

    doc.save("customers.pdf");
  };

  // ================================
  // Delete Customer
  // ================================
  const handleDelete = async (id) => {
    try {
      const res = await request(`customers/${id}`, "delete");

      if (res?.status !== "success") {
        message.error("Delete failed");
        return;
      }

      message.success("Customer deleted successfully");
      getList();
    } catch (error) {
      message.error("Delete failed");
    }
  };

  // ================================
  // Search Filter
  // ================================
  const filteredData = state.customers.filter(
    (item) =>
      item.name.toLowerCase().includes(state.search.toLowerCase()) ||
      item.email.toLowerCase().includes(state.search.toLowerCase()) ||
      item.phone.toLowerCase().includes(state.search.toLowerCase()),
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
      title: "Gender",
      dataIndex: "gender",
      align: "center",
      render: (gender) => {
        let color = "blue";
        if (gender === "Female") color = "pink";
        if (gender === "Other") color = "purple";

        return <Tag color={color}>{gender}</Tag>;
      },
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Loyalty Points",
      dataIndex: "loyalty_points",
      align: "center",
      sorter: (a, b) => a.loyalty_points - b.loyalty_points,
      render: (points) => <Tag color="gold">{points}</Tag>,
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Action",
      align: "center",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Customer">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => navigate(`/customers/edit/${record.customer_id}`)}
            />
          </Tooltip>

          <Popconfirm
            title="Delete this customer?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record.customer_id)}
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
          POS / Customers
        </h2>
      </div>

      <Card>
        <Row style={{ marginBottom: 10 }} gutter={[16, 16]}>
          <Space>
            <Col flex="auto" style={{ minWidth: 200 }}>
              <Input
                placeholder="Search customer..."
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
              onClick={() => navigate("/customers/create")}
            >
              Add Customer
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
            rowKey="customer_id"
            scroll={{ x: 1000 }}
            pagination={{
              total: state.total,
              pageSize: 8,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `Total ${total} customers`,
            }}
          />
        </Spin>
      </Card>
    </>
  );
};

export default CustomerPage;
