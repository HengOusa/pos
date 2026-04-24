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

const RolePermission = () => {
  const [state, setState] = useState({
    total: 0,
    roles: [],
    loading: false,
    search: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    getList();
  }, []);

  // Fetch Roles
  const getList = async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const res = await request("roles", "get"); // ← changed endpoint

      if (res?.status === "success") {
        setState((prev) => ({
          ...prev,
          total: res.total,
          roles: res.roles || [],
        }));
      } else {
        message.error("Failed to load roles");
      }
    } catch (err) {
      message.error("Failed to load roles");
      console.error(err);
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(state.roles);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Roles");
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buffer]), "roles.xlsx");
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Role List", 14, 22);

    const columns = ["ID", "Role Name", "Description", "Created At"];

    const rows = state.roles.map((role) => [
      role.role_id,
      role.name,
      role.description || "-",
      new Date(role.created_at).toLocaleDateString(),
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 30,
      theme: "grid",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [22, 119, 255] },
    });

    doc.save("roles.pdf");
  };

  // Delete Role
  const handleDelete = async (id) => {
    try {
      const res = await request(`roles/${id}`, "delete");

      if (res?.status === "success") {
        message.success("Role deleted successfully");
        getList();
      } else {
        message.error(res?.message || "Delete failed");
      }
    } catch (error) {
      message.error("Delete failed");
      console.error(error);
    }
  };

  // Search filter
  const filteredData = state.roles.filter(
    (item) =>
      item.name.toLowerCase().includes(state.search.toLowerCase()) ||
      (item.description || "")
        .toLowerCase()
        .includes(state.search.toLowerCase()),
  );

  // ────────────────────────────────────────────────
  //          Table Columns  ←  this is the main change
  // ────────────────────────────────────────────────
  const columns = [
    {
      title: "No.",
      width: 80,
      align: "center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Role Name",
      dataIndex: "name",
      width: 180,
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Description",
      dataIndex: "description",
      ellipsis: true,
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      width: 140,
      align: "center",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    },
    {
      title: "Action",
      width: 120,
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Role">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => navigate(`/roles/edit/${record.role_id}`)}
            />
          </Tooltip>

          <Popconfirm
            title="Delete this role?"
            description="Are you sure? This action cannot be undone."
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record.role_id)}
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
          Roles & Permissions
        </h2>
      </div>

      <Card>
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col>
            <Input
              placeholder="Search role name or description..."
              prefix={<SearchOutlined />}
              allowClear
              onChange={(e) =>
                setState((prev) => ({ ...prev, search: e.target.value }))
              }
            />
          </Col>

          <Space wrap>
            <Tooltip title="Export to Excel">
              <Button icon={<FileExcelOutlined />} onClick={exportToExcel}>
                Excel
              </Button>
            </Tooltip>

            <Tooltip title="Export to PDF">
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
              onClick={() => navigate("/roles/create")}
            >
              Add New Role
            </Button>
          </Space>
        </Row>

        <Spin spinning={state.loading}>
          <Table
            bordered
            className="custom-table"
            size="small"
            columns={columns}
            dataSource={filteredData}
            rowKey="role_id"
            scroll={{ x: 900 }}
            pagination={{
              total: state.total,
              // pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} roles`,
            }}
          />
        </Spin>
      </Card>
    </>
  );
};

export default RolePermission;
