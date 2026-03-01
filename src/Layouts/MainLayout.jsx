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
import logo from "../assets/images/EmartCambodia.png";

const { Header, Content, Footer, Sider } = Layout;
const { Text } = Typography;

function getItem(label, key, icon, children) {
  return { key, icon, children, label };
}

/* ================= STATIC MENU ================= */
const MenuItems = [
  getItem("Dashboard", "dashboard", <PieChartOutlined />),
  getItem("POS", "pos", <ShoppingCartOutlined />),

  getItem("Stocks Management", "stock_mng", <StockOutlined />, [
    getItem("Orders & Invoice", "stock_mng/orders", <CaretRightOutlined />),
    getItem("Stocks", "stock_mng/stocks", <CaretRightOutlined />),
  ]),

  getItem("Inventory", "inventory", <ShopOutlined />, [
    getItem("Product", "inventory/products", <CaretRightOutlined />),
    getItem("Brand", "inventory/brands", <CaretRightOutlined />),
    getItem("Category", "inventory/categories", <CaretRightOutlined />),
    getItem("Discount", "inventory/discounts", <CaretRightOutlined />),
  ]),

  getItem("Setting", "setting", <SettingOutlined />, [
    getItem("Users", "setting/users", <CaretRightOutlined />),
    getItem("Suppliers", "setting/suppliers", <CaretRightOutlined />),
    getItem(
      "Roles & Permissions",
      "setting/rl_permissions",
      <CaretRightOutlined />,
    ),
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

  const breadcrumbItems = [
    { title: <Link to="/">Dashboard</Link> },
    ...(currentKey !== "dashboard"
      ? [{ title: currentKey.replace("/", " / ") }]
      : []),
  ];

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
        className="overflow-scroll sticky top-0 h-screen"
      >
        <div className="flex flex-col items-center p-4">
          <img src={logo} alt="Logo" style={{ width: "60%" }} />
          {!collapsed && <h3 className="mt-2">E Mart System</h3>}
        </div>

        <Menu
          theme={menuTheme}
          mode="inline"
          selectedKeys={[currentKey]}
          items={MenuItems}
          onClick={(item) => navigate("/" + item.key)}
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
            position: "sticky",
            top: "0",
            padding: 0,
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
            margin: "16px",
            background: menuTheme === "dark" ? "#141d26" : "#f5f7fa",
          }}
        >
          <Breadcrumb items={breadcrumbItems} />

          <div
            style={{
              padding: 16,
              minHeight: 360,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>

        {/* FOOTER */}
        <Footer style={{ textAlign: "center" }}>
          E Mart ©{new Date().getFullYear()} Created by Heng OuSa
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
