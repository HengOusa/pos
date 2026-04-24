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
import { configStore } from "../../Stores/config.store";

const { Title } = Typography;

const EmployeePage = () => {
  const [state, setState] = useState({
    total: 0,
    employees: [],
    loading: false,
    search: "",
  });

  const { config } = configStore();
  const navigate = useNavigate();

  useEffect(() => {
    getList();
  }, []);

  // ================================
  // Fetch Employees
  // ================================
  const getList = async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const res = await request("employees", "get"); // adjust endpoint if needed

      if (res?.status === "success") {
        setState((prev) => ({
          ...prev,
          total: res.total,
          employees: res.employees,
        }));
      } else {
        message.error("Failed to load employees");
      }
    } catch (error) {
      message.error("Failed to load employees");
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  // ================================
  // Export to Excel
  // ================================
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(state.employees);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Employees");
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buffer]), "employees.xlsx");
  };

  // ================================
  // Export to PDF
  // ================================
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Employee List", 14, 22);

    const columns = [
      "ID",
      "Name",
      "Email",
      "Phone",
      "Hire Date",
      "Role",
      "Salary",
      "Status",
      "Created By",
    ];

    const rows = state.employees.map((emp) => [
      emp.employee_id,
      emp.name,
      emp.email,
      emp.phone,
      new Date(emp.hire_date).toLocaleDateString(),
      emp.role_id,
      `$${parseFloat(emp.salary).toFixed(2)}`,
      emp.status === "active" ? "Active" : "Inactive",
      emp.created_by,
    ]);

    autoTable(doc, { head: [columns], body: rows, startY: 30, theme: "grid" });
    doc.save("employees.pdf");
  };

  // ================================
  // Delete Employee
  // ================================
  const handleDelete = async (id) => {
    try {
      const res = await request(`employees/${id}`, "delete");

      if (res?.status !== "success") {
        message.error(res.errors?.message || "Delete failed");
        return;
      }

      message.success("Employee deleted successfully");
      getList();
    } catch (error) {
      message.error("Delete failed");
    }
  };

  // ================================
  // Toggle Status
  // ================================
  const handleToggleStatus = async (id, status) => {
    const numericStatus = status ? 1 : 0;
    var changeStatus = {
      is_active: numericStatus,
    };
    try {
      // Send PATCH request to toggle status
      const res = await request(
        `employees/${id}/status`,
        "patch",
        changeStatus,
      );

      // Check response
      if (res.status === "success") {
        message.success("Employee status updated!");
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
  const filteredData = state.employees.filter(
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
    { title: "Email", dataIndex: "email" },
    { title: "Phone", dataIndex: "phone" },
    {
      title: "Hire Date",
      dataIndex: "hire_date",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Role",
      dataIndex: "role_id",
      render: (value) => {
        const role = config?.roles.find((item) => item.role_id === value);
        return role ? role.name : "-";
      },
    },
    {
      title: "Salary",
      dataIndex: "salary",
      render: (value) => `$${parseFloat(value).toFixed(2)}`,
    },
    {
      title: "Created By",
      dataIndex: "created_by",
      render: (value) => {
        const user = config?.users.find((item) => item.user_id === value);
        return user ? user.name : "-";
      },
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
          <Switch
            checked={record.is_active === 1}
            onChange={(checked) =>
              handleToggleStatus(record.employee_id, checked)
            }
          />

          <Tooltip title="Edit Employee">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => navigate(`/employees/edit/${record.employee_id}`)}
            />
          </Tooltip>

          <Popconfirm
            title="Are you sure to Delete this Employee?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record.employee_id)}
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
          Settings / Employees
        </h2>
      </div>

      <Card>
        <Row style={{ marginBottom: 10 }} gutter={[16, 16]}>
          <Space>
            <Col flex="auto" style={{ minWidth: 200 }}>
              <Input
                placeholder="Search employee..."
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
              onClick={() => navigate("/employees/create")}
            >
              Add Employee
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
            rowKey="employee_id"
            scroll={{ x: 1200 }}
            pagination={{
              total: state.total,
              pageSize: 8,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `Total ${total} employees`,
            }}
          />
        </Spin>
      </Card>
    </>
  );
};

export default EmployeePage;
