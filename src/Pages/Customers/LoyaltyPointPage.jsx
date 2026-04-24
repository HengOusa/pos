import React, { useEffect, useState } from "react";
import {
  Table,
  message,
  Spin,
  Card,
  Button,
  Space,
  Input,
  Tooltip,
  Row,
  Col,
  Typography,
  Tag,
} from "antd";

import {
  SearchOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";

import { request } from "../../utils/request";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { configStore } from "../../Stores/config.store";

const { Title } = Typography;

const LoyaltyPointPage = () => {
  const [state, setState] = useState({
    total: 0,
    points: [],
    loading: false,
    search: "",
  });

  const { config } = configStore();

  useEffect(() => {
    getList();
  }, []);

  // ================================
  // Fetch Loyalty Points
  // ================================
  const getList = async () => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const res = await request("loyalty-points", "get");

      if (res?.status === "success") {
        setState((prev) => ({
          ...prev,
          total: res.total,
          points: res.points,
        }));
      } else {
        message.error("Failed to load loyalty points");
      }
    } catch (error) {
      message.error("Failed to load loyalty points");
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  // ================================
  // Export Excel
  // ================================
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(state.points);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "LoyaltyPoints");

    const buffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    saveAs(new Blob([buffer]), "loyalty_points.xlsx");
  };

  // ================================
  // Export PDF
  // ================================
  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Loyalty Points Transactions", 14, 22);

    const columns = [
      "Transaction ID",
      "Customer ID",
      "Points",
      "Type",
      "Reference",
      "Created",
    ];

    const rows = state.points.map((p) => [
      p.transaction_id,
      p.customer_id,
      p.points,
      p.type,
      p.reference,
      new Date(p.created_at).toLocaleDateString(),
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 30,
      theme: "grid",
    });

    doc.save("loyalty_points.pdf");
  };

  // ================================
  // Search Filter
  // ================================
  const filteredData = state.points.filter(
    (item) =>
      item.reference.toLowerCase().includes(state.search.toLowerCase()) ||
      item.type.toLowerCase().includes(state.search.toLowerCase()) ||
      item.customer_id.toString().includes(state.search),
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
      title: "Transaction ID",
      dataIndex: "transaction_id",
      align: "center",
      sorter: (a, b) => a.transaction_id - b.transaction_id,
    },
    {
      title: "Customer",
      dataIndex: "customer_id",
      render: (value) => {
        const customer = config?.customers.find(
          (item) => item.customer_id === value,
        );
        return customer ? <strong>{customer.name}</strong> : "-";
      },
    },
    {
      title: "Points",
      dataIndex: "points",
      sorter: (a, b) => a.points - b.points,
      render: (points) => <Tag color="gold">{points}</Tag>,
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (type) => {
        const color = type === "add" ? "green" : "red";
        return <Tag color={color}>{type.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Reference",
      dataIndex: "reference",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      render: (date) => new Date(date).toLocaleString(),
    },
  ];

  return (
    <>
      <div className="mb-3 flex justify-between items-center">
        <h2 className="font-semibold text-lg bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent underline">
          POS / Loyalty Points
        </h2>
      </div>

      <Card>
        <Row style={{ marginBottom: 10 }} gutter={[16, 16]}>
          <Space>
            <Col flex="auto" style={{ minWidth: 200 }}>
              <Input
                placeholder="Search transaction..."
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
          </Space>
        </Row>

        <Spin spinning={state.loading}>
          <Table
            className="custom-table"
            bordered
            size="small"
            columns={columns}
            dataSource={filteredData}
            rowKey="transaction_id"
            scroll={{ x: 900 }}
            pagination={{
              total: state.total,
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: ["5", "8", "10", "20", "50", "100"], // resize options
              showTotal: (total) => `Total ${total} transactions`,
            }}
          />
        </Spin>
      </Card>
    </>
  );
};

export default LoyaltyPointPage;
