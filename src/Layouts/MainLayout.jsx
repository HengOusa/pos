import {
  CaretRightOutlined,
  DownOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  SettingOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  StockOutlined,
  UserOutlined,
  TeamOutlined,
  GiftOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

import {
  Avatar,
  Breadcrumb,
  Button,
  Dropdown,
  Layout,
  Menu,
  Space,
  theme,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/images/pos.png";

const { Header, Content, Footer, Sider } = Layout;
const { Text } = Typography;

function getItem(label, key, icon, children) {
  return { key, icon, children, label };
}
/* ================= MENU ITEMS FOR POS ================= */
const MenuItems = [
  // ================= Dashboard =================
  getItem("Dashboard", "dashboard", <PieChartOutlined />),

  // ================= Products =================
  getItem("Products", "products", <ShopOutlined />, [
    getItem("Product List", "products/list", <CaretRightOutlined />),
    getItem("Categories", "products/categories", <CaretRightOutlined />),
    getItem("Brands", "products/brands", <CaretRightOutlined />),
    getItem("Variants", "products/variants", <CaretRightOutlined />),
    getItem(
      "Stock Adjustment",
      "products/stock-adjustments",
      <CaretRightOutlined />,
    ),
    getItem(
      "Inventory Transactions",
      "products/inventory",
      <CaretRightOutlined />,
    ),
  ]),

  // ================= Sales =================
  getItem("Sales", "sales", <ShoppingCartOutlined />, [
    getItem("Sale List", "sales/list", <CaretRightOutlined />),
    getItem("Payments", "sales/payments", <CaretRightOutlined />),
    getItem("Returns", "sales/returns", <CaretRightOutlined />),
    getItem("Invoices", "sales/invoices", <CaretRightOutlined />),
  ]),

  // ================= Purchases =================
  getItem("Purchases", "purchases", <ShoppingCartOutlined />, [
    getItem("Purchase Orders", "purchases/list", <CaretRightOutlined />),
    getItem("Purchase Items", "purchases/items", <CaretRightOutlined />),
    getItem("Suppliers", "purchases/suppliers", <CaretRightOutlined />),
  ]),

  // ================= Customers =================
  getItem("Customers", "customers", <UserOutlined />, [
    getItem("Customer List", "customers/list", <CaretRightOutlined />),
    getItem("Loyalty Points", "customers/loyalty", <CaretRightOutlined />),
  ]),

  // ================= Employees =================
  getItem("Employees", "employees", <TeamOutlined />, [
    getItem("Employee List", "employees/list", <CaretRightOutlined />),
    getItem("Payroll", "employees/payroll", <CaretRightOutlined />),
    getItem("Shifts", "employees/shifts", <CaretRightOutlined />),
  ]),

  // ================= Promotions =================
  getItem("Promotions", "promotions", <GiftOutlined />, [
    getItem("Promotion List", "promotions/list", <CaretRightOutlined />),
    getItem(
      "Promotion Products",
      "promotions/products",
      <CaretRightOutlined />,
    ),
  ]),

  // ================= Reports =================
  getItem("Reports", "reports", <FileTextOutlined />, [
    getItem("Sales Reports", "reports/sales", <CaretRightOutlined />),
    getItem("Purchase Reports", "reports/purchases", <CaretRightOutlined />),
    getItem("Inventory Reports", "reports/inventory", <CaretRightOutlined />),
    getItem("Customer Reports", "reports/customers", <CaretRightOutlined />),
  ]),

  // ================= Settings =================
  getItem("Settings", "settings", <SettingOutlined />, [
    getItem("Users", "settings/users", <CaretRightOutlined />),
    getItem("Roles & Permissions", "settings/roles", <CaretRightOutlined />),
    getItem("Stores / Branches", "settings/stores", <CaretRightOutlined />),
    getItem("Taxes", "settings/taxes", <CaretRightOutlined />),
    getItem(
      "Expense Categories",
      "settings/expense-categories",
      <CaretRightOutlined />,
    ),
    getItem("System Info", "settings/system-info", <CaretRightOutlined />),
  ]),
];

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [menuTheme, setMenuTheme] = useState("light");
  const navigate = useNavigate();
  const location = useLocation();

  /* ===== Static Profile ===== */
  const profile = {
    name: "Admin User",
    type: "Administrator",
    avatar: null,
  };

  /* ===== Auto Dark / Light ===== */
  useEffect(() => {
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateTheme = (e) => setMenuTheme(e.matches ? "dark" : "light");
    setMenuTheme(darkModeQuery.matches ? "dark" : "light");
    darkModeQuery.addEventListener("change", updateTheme);
    return () => darkModeQuery.removeEventListener("change", updateTheme);
  }, []);

  /* ===== Breadcrumb ===== */
  const pathSnippets = location.pathname.split("/").filter(Boolean);
  const currentKey =
    pathSnippets.length >= 2
      ? `${pathSnippets[pathSnippets.length - 2]}/${
          pathSnippets[pathSnippets.length - 1]
        }`
      : pathSnippets[0] || "dashboard";

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      {/* ================= SIDEBAR ================= */}
      <Sider
        trigger={null}
        theme={menuTheme}
        collapsible
        collapsed={collapsed}
        width={250}
        className="custom-sider"
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <div
          className="logo-vertical"
          style={{
            position: "sticky",
            top: "0",
            alignItems: "center",
            justifyContent: "center",
            color: menuTheme === "dark" ? "white" : "black",
          }}
        >
          <img src={logo} alt="Logo" style={{ width: "60%" }} />
          {!collapsed && <h3 className="mt-2">E-POS System</h3>}
        </div>

        <Menu
          onClick={(item) => navigate("/" + item.key)}
          style={{ maxHeight: "calc(100vh - 240px)", overflowY: "auto" }}
          theme={menuTheme}
          mode="inline"
          selectedKeys={[currentKey]} // dynamic selection
          defaultOpenKeys={[pathSnippets[0]]} // auto-open parent menu
          items={MenuItems}
        />

        <div className="text-center p-4">
          <Link to="/about">About Us</Link>
        </div>
      </Sider>

      {/* ================= MAIN ================= */}
      <Layout>
        {/* HEADER */}
        <Header
          style={{
            padding: 0,
            position: "sticky",
            top: 0,
            zIndex: 90,
            width: "100%",
            color: menuTheme === "dark" ? "white" : "black",
            background: menuTheme === "dark" ? "#001529" : colorBgContainer,
          }}
        >
          <div className="flex justify-between  items-center px-4">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                color: menuTheme === "dark" ? colorBgContainer : "black",
                fontSize: "20px",
                width: 64,
                height: 64,
              }}
            />

            <Dropdown
              trigger={["click"]}
              menu={{
                items: [
                  {
                    key: "1",
                    label: <span>User: {profile.type}</span>,
                    disabled: true,
                  },
                  { type: "divider" },
                  {
                    key: "2",
                    label: <Link to="/profile">Profile</Link>,
                  },
                  {
                    key: "3",
                    label: "Logout",
                    danger: true,
                  },
                ],
              }}
            >
              <Space
                className="cursor-pointer px-3 py-1 rounded-lg hover:bg-gray-100 transition"
                align="center"
              >
                <Avatar
                  size="small"
                  icon={<UserOutlined />}
                  style={{ backgroundColor: "#1677ff" }}
                />
                <Text strong>{profile.name}</Text>
                <DownOutlined style={{ fontSize: 12, color: "#666" }} />
              </Space>
            </Dropdown>
          </div>
        </Header>

        {/* CONTENT */}
        <Content
          style={{
            margin: "5px 12px",
            background: menuTheme === "dark" ? "#141d26" : "#f5f7fa",
          }}
        >
          <div
            style={{
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>

        {/* FOOTER */}
        <Footer
          className="bg-white p-4 border-t border-gray-300  dark:bg-sky-200 z-50"
          style={{
            position: "sticky",
            bottom: 0,
            width: "100%",
            textAlign: "center",
            color: menuTheme === "dark" ? "white" : "black",
            backgroundColor: menuTheme === "dark" ? "#141d26" : "white",
          }}
        >
          Hospital Management System ©{new Date().getFullYear()} Created by Heng
          OuSa
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
