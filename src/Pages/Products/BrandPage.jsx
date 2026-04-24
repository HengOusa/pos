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

const BrandPage = () => {
  const [state, setState] = useState({
    total: 0,
    brands: [],
    loading: false,
    search: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    getList();
  }, []);

  // ================================
  // Fetch Brands
  // ================================
  const getList = async () => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const res = await request("brands", "get");

      if (res?.status === "success") {
        setState((prev) => ({
          ...prev,
          total: res.total,
          brands: res.brands,
        }));
      } else {
        message.error("Failed to load brands");
      }
    } catch (error) {
      message.error("Failed to load brands");
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  // ================================
  // Excel Export
  // ================================
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(state.brands);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Brands");

    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buffer]), "brands.xlsx");
  };

  // ================================
  // PDF Export
  // ================================
  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Brand List", 14, 22);

    const columns = ["ID", "Name", "Logo", "Status"];
    const rows = state.brands.map((b) => [
      b.brand_id,
      b.name,
      b.brand_logo,
      b.is_active === 1 ? "Active" : "Inactive",
    ]);

    autoTable(doc, { head: [columns], body: rows, startY: 30, theme: "grid" });
    doc.save("brands.pdf");
  };

  // ================================
  // Edit Brand
  // ================================
  const handleEdit = (record) => {
    navigate(`/brands/edit/${record.brand_id}`);
  };

  // ================================
  // Delete Brand
  // ================================
  const handleDelete = async (id) => {
    try {
      const res = await request(`brands/${id}`, "delete");
      if (res?.status !== "success") {
        message.error(res.errors?.message || "Failed to delete brand.");
        return;
      }
      getList();
      message.success("Brand deleted successfully!");
    } catch (error) {
      console.error("Delete Error:", error);
      message.error("Failed to delete brand. Please try again.");
    }
  };

  const handleToggleStatus = async (id, status) => {
    const numericStatus = status ? 1 : 0;
    try {
      const res = await request(`brands/${id}/status`, "patch", {
        is_active: numericStatus,
      });
      if (res.status === "success") {
        message.success("Brand status updated!");
        getList();
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
  const filteredData = state.brands.filter((item) =>
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
      title: "Brand Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Logo",
      dataIndex: "brand_logo",
      align: "center",
      render: (logo) => (
        <img src={logo} alt="Logo" style={{ width: 30, height: 30 }} />
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
            checked={record.is_active}
            onChange={(checked) => handleToggleStatus(record.brand_id, checked)}
          />
          <Tooltip title="Edit Brand">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete Brand"
            description="Are you sure you want to delete this brand?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record.brand_id)}
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
        <h2 className="text-[20px]">Brands</h2>
      </div>

      <Card>
        <Row style={{ marginBottom: 10, flexWrap: "wrap" }} gutter={[16, 16]}>
          <Space>
            <Col flex="auto" style={{ minWidth: 200 }}>
              <Input
                placeholder="Search brand..."
                prefix={<SearchOutlined />}
                allowClear
                onChange={(e) =>
                  setState((prev) => ({ ...prev, search: e.target.value }))
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
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/brands/create")}
            >
              Add Brand
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
            rowKey="brand_id"
            scroll={{ x: 1000 }}
            pagination={{
              total: state.total,
              pageSizeOptions: ["5", "8", "10", "20", "50", "100"],
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `Total ${total} brands`,
            }}
          />
        </Spin>
      </Card>
    </>
  );
};

export default BrandPage;
