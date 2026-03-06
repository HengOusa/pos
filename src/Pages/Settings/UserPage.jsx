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
  Switch,
  Avatar,
} from "antd";

import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { request } from "../../utils/request";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const UserPage = () => {
  const [state, setState] = useState({
    total: 0,
    users: [],
    loading: false,
    search: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    getList();
  }, []);

  // ================================
  // Fetch Users
  // ================================
  const getList = async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const res = await request("auth/users", "get");

      if (res?.status == "success") {
        setState((prev) => ({
          ...prev,
          total: res.total,
          users: res.users,
        }));
      } else {
        message.error("Failed to load users");
      }
    } catch (error) {
      message.error("Failed to load users");
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  // ================================
  // Export Excel
  // ================================
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(state.users);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Users");

    const buffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    saveAs(new Blob([buffer]), "users.xlsx");
  };

  // ================================
  // Export PDF
  // ================================
  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("User List", 14, 22);

    const columns = [
      "ID",
      "Name",
      "Email",
      "Phone",
      "Date of Birth",
      "Role",
      "Status",
    ];

    const rows = state.users.map((user) => [
      user.user_id,
      user.name,
      user.email,
      user.phone_number,
      user.date_of_birth,
      user.role_id,
      user.is_active === 1 ? "Active" : "Inactive",
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 30,
      theme: "grid",
    });

    doc.save("users.pdf");
  };

  // ================================
  // Delete User
  // ================================
  const handleDelete = async (id) => {
    try {
      const res = await request(`users/${id}`, "delete");

      if (res?.status !== "success") {
        message.error(res.errors?.message || "Delete failed");
        return;
      }

      message.success("User deleted successfully");
      getList();
    } catch (error) {
      message.error("Delete failed");
    }
  };

  // ================================
  // Toggle Status
  // ================================
  const handleToggleStatus = async (id, status) => {
    const data = {
      is_active: status ? 1 : 0,
    };

    try {
      const res = await request(`users/${id}/status`, "patch", data);

      if (res?.status === "success") {
        message.success("User status updated");
        getList();
      } else {
        message.error("Failed to update status");
      }
    } catch (error) {
      message.error("Failed to update status");
    }
  };

  // ================================
  // Search Filter
  // ================================
  const filteredData = state.users.filter(
    (item) =>
      item.name.toLowerCase().includes(state.search.toLowerCase()) ||
      item.email.toLowerCase().includes(state.search.toLowerCase()),
  );

  // ================================
  // Table Columns
  // ================================
  const columns = [
    {
      title: "ID",
      dataIndex: "user_id",
      align: "center",
      sorter: (a, b) => a.user_id - b.user_id,
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
      dataIndex: "phone_number",
    },
    {
      title: "Date of Birth",
      dataIndex: "date_of_birth",
    },
    {
      title: "Role ID",
      dataIndex: "role_id",
      align: "center",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Created By",
      dataIndex: "created_by",
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
      title: "Profile",
      dataIndex: "image",
      align: "center",
      render: (image, record) => (
        <Avatar
          size={33}
          src={image ? `http://localhost:3000/uploads/${image}` : null}
          icon={!image && <UserOutlined />}
          style={{ backgroundColor: "#87d068" }}
        >
          {!image && record.name?.charAt(0).toUpperCase()}
        </Avatar>
      ),
    },
    {
      title: "Action",
      align: "center",
      render: (_, record) => (
        <Space>
          <Switch
            checked={record.is_active === 1}
            onChange={(checked) => handleToggleStatus(record.user_id, checked)}
          />

          <Tooltip title="Edit User">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => navigate(`/users/edit/${record.user_id}`)}
            />
          </Tooltip>

          <Popconfirm
            title="Are you sure to Delete this User ?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record.user_id)}
          >
            <Button danger shape="circle" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="mb-2 flex justify-between rounded-2xl">
        <h2 className="text-[20px]">Users</h2>
      </div>

      <Card>
        <Row style={{ marginBottom: 10 }} gutter={[16, 16]}>
          <Space>
            <Col flex="auto" style={{ minWidth: 200 }}>
              <Input
                placeholder="Search user..."
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
              onClick={() => navigate("/users/create")}
            >
              Add User
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
            rowKey="user_id"
            scroll={{ x: 1000 }}
            pagination={{
              total: state.total,
              pageSize: 8,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `Total ${total} users`,
            }}
          />
        </Spin>
      </Card>
    </>
  );
};

export default UserPage;
