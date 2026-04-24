import {
  CaretRightOutlined,
  DownOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  SettingOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  GiftOutlined,
  FileTextOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  MessageOutlined,
  SearchOutlined,
  PrinterOutlined,
  FullscreenOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

import {
  Avatar,
  Button,
  Dropdown,
  Layout,
  Breadcrumb,
  Badge,
  Menu,
  Input,
  Space,
  theme,
  Typography,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/images/Nffs.png";
import {
  clearProfile,
  getProfile,
  setAccessToken,
  setProfile,
} from "../Stores/profile.store";
import { useProfileStore } from "../Stores/profileStore";
import { configStore } from "../Stores/config.store";
import { request } from "../utils/request";

const { Header, Content, Footer, Sider } = Layout;
const { Text } = Typography;

function getItem(label, key, icon, children) {
  return { key, icon, children, label };
}
/* ================= MENU ITEMS FOR POS ================= */
const MenuItems = [
  // ================= Dashboard =================
  getItem("Dashboard", "dashboard", <PieChartOutlined />),
  getItem("POS", "pos", <ShoppingCartOutlined />),

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
  const [selectedKey, setSelectedKey] = useState("");
  const profile = useProfileStore((state) => state.profile);
  const logout = useProfileStore((state) => state.logout);
  const count = configStore((state) => state.count);
  const { config, setConfig } = configStore();

  // profile

  /* ===== Auto Dark / Light ===== */
  useEffect(() => {
    if (!profile) {
      navigate("auth/login");
    }
    getConfig();

    const path = location.pathname.replace("/", "");
    // exact match
    if (MENU_KEYS.includes(path)) {
      setSelectedKey(path);
      return;
    }
      
  }, [location.pathname]);

  const getConfig = async () => {
    try {
      const res = await request("config", "get");
      setConfig(res);
      // alert(JSON.stringify(res));
      console.log(config);
    } catch (error) {
      message.error("Config Errors");
    }
  };

  const getAllMenuKeys = (items) => {
    let keys = [];

    items.forEach((item) => {
      keys.push(item.key);

      if (item.children) {
        item.children.forEach((child) => {
          keys.push(child.key);
        });
      }
    });
    console.log(keys);

    return keys;
  };
  const MENU_KEYS = getAllMenuKeys(MenuItems);

  const handleLogout = () => {
    logout();
    navigate("auth/login");
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // const profile = getProfile();
  if (!profile) {
    return null;
  }

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
          selectedKeys={[selectedKey]} // dynamic selection
          defaultOpenKeys={[selectedKey.split("/")[0]]} // auto-open parent menu
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
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            backdropFilter: "blur(8px)",
            transition: "all 0.3s ease",
          }}
        >
          <div className="flex justify-between items-center h-full px-4 md:px-6">
            {/* Left section with logo and collapse button */}
            <div className="flex items-center gap-4">
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                className="hover:bg-opacity-10"
                style={{
                  color: menuTheme === "dark" ? colorBgContainer : "black",
                  fontSize: "20px",
                  width: 48,
                  height: 48,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
              />

              {/* Optional: Add logo/brand name */}
              <div className="hidden sm:block">
                <span className="font-semibold text-lg bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Dashboard
                </span>
              </div>
            </div>

            <div className="flex-1 max-w-xl mx-4 hidden md:flex items-center gap-4">
              {/* Search */}
              <Input
                size="large"
                placeholder="Search..."
                prefix={<SearchOutlined />}
                className="max-w-xs"
              />
            </div>

            <div className="flex items-center gap-4">
              {/* Right section with user menu */}
              <div className="flex items-center gap-4">
                <Button className="p-1!" size="large" shape="circle">
                  <strong className="font-semibold text-[15px] bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                    POS
                  </strong>
                </Button>
                {/* Printer */}
                {/* <PrinterOutlined className="text-2xl cursor-pointer text-blue-500" /> */}

                {/* Fullscreen */}
                {/* <FullscreenOutlined className="text-2xl cursor-pointer text-blue-500" /> */}

                {/* Help */}
                {/* <QuestionCircleOutlined className="text-2xl cursor-pointer text-blue-500" /> */}
                {/* Orders / Cart */}
                <Badge count={count}>
                  <ShoppingCartOutlined className="text-2xl cursor-pointer text-blue-500!" />
                </Badge>
                {/* Notification */}
                <Badge count={5}>
                  <BellOutlined className="text-2xl cursor-pointer text-blue-500!" />
                </Badge>

                {/* Chat Message */}
                <Badge count={2}>
                  <MessageOutlined className="text-2xl cursor-pointer text-blue-500!" />
                </Badge>
              </div>
              <Dropdown
                trigger={["click"]}
                placement="bottomRight"
                arrow={{ pointAtCenter: true }}
                menu={{
                  items: [
                    {
                      key: "1",
                      label: (
                        <div className="px-2 py-1">
                          <p className="font-medium">
                            Role: {profile?.role_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {profile?.email}
                          </p>
                        </div>
                      ),
                      style: { cursor: "default" },
                    },
                    { type: "divider" },
                    {
                      key: "2",
                      icon: <UserOutlined />,
                      label: <Link to="/profile">Profile</Link>,
                    },
                    {
                      key: "3",
                      icon: <SettingOutlined />,
                      label: <Link to="/settings">Settings</Link>,
                    },
                    { type: "divider" },
                    profile && {
                      key: "4",
                      icon: <LogoutOutlined />,
                      label: "Logout",
                      danger: true,
                      onClick: () => handleLogout(), // Add your logout handler
                    },
                  ],
                }}
              >
                <div className="flex items-center gap-3 cursor-pointer ">
                  <Badge dot status="success" offset={[-2, 22]}>
                    <Avatar
                      size={48} // Large but can adjust
                      icon={<UserOutlined style={{ color: "#1890ff" }} />} // icon color
                      src={logo} // Avatar URL
                      alt="User Avatar"
                      style={{
                        backgroundColor: "#f0f2f5", // subtle background if src fails
                        border: "1px solid #1890ff", // optional border for style
                        boxShadow: "0 2px 6px rgba(0,0,0,0.15)", // subtle shadow
                      }}
                    />
                  </Badge>

                  <div className="hidden lg:block">
                    <Text
                      strong
                      className="block font-semibold text-[16px]! text-blue-700!"
                    >
                      {profile?.name || "User"}
                    </Text>
                  </div>

                  <DownOutlined style={{ fontSize: 10, color: "#999" }} />
                </div>
              </Dropdown>
            </div>
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
          E - POS ©{new Date().getFullYear()} Created by Heng OuSa
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
