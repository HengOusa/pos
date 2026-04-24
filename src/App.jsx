import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import MainLayout from "./Layouts/MainLayout";
import DashboardPage from "./Pages/DashboardPage";
import { PosPage } from "./Pages/PosPage";
import DepartmentPage from "./Pages/DepartmentPage";
import CategoryPage from "./Pages/Products/CategoryPage";
import ProductPage from "./Pages/Products/ProductPage";
import EditCategory from "./Pages/Products/CategoryAction/EditCategory";
import CreateCategory from "./Pages/Products/CategoryAction/CreateCategory";
import UserPage from "./Pages/Settings/UserPage";
import BrandPage from "./Pages/Products/BrandPage";
import MainAuth from "./Layouts/MainAuth";
import LoginPage from "./Auth/LoginPage";
import SignUpForm from "./Auth/SignUpForm";
import RolePermission from "./Pages/Settings/RolePermission";
import CustomerPage from "./Pages/Customers/CustomerPage";
import SupplierPage from "./Pages/Purchases/SupplierPage";
import ProductVariantPage from "./Pages/Products/ProductVariantPage";
import LoyaltyPointPage from "./Pages/Customers/LoyaltyPointPage";
import EmployeePage from "./Pages/Employees/EmployeePage";
import CreateProduct from "./Pages/Products/ProductAction/CreateProduct";
import { configStore } from "./Stores/config.store";
import EditProduct from "./Pages/Products/ProductAction/EditProduct";
function App() {
  const { config } = configStore();

  console.log(config)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<MainAuth />}>
            <Route index element={<Navigate to="/auth/login" />} />{" "}
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="auth/signup" element={<SignUpForm />} />
          </Route>
          <Route element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" />} />{" "}
            {/* default */}
            <Route index path="/dashboard" element={<DashboardPage />} />
            <Route path="/products/categories" element={<CategoryPage />} />
            <Route path="/categories/create" element={<CreateCategory />} />
            <Route path="/categories/edit/:id" element={<EditCategory />} />
            <Route path="/products/list" element={<ProductPage />} />
            <Route
              path="/products/create"
              element={
                <CreateProduct
                  categories={(config?.categories || []).filter(
                    (item) => item.is_active === 1,
                  )}
                  brands={(config?.brands || []).filter(
                    (item) => item.is_active === 1,
                  )}
                  suppliers={(config?.suppliers || []).filter(
                    (item) => item.is_active === 1,
                  )}
                />
              }
            />
            <Route
              path="/products/edit/:id"
              element={
                <EditProduct
                  categories={(config?.categories || []).filter(
                    (item) => item.is_active === 1,
                  )}
                  brands={(config?.brands || []).filter(
                    (item) => item.is_active === 1,
                  )}
                  suppliers={(config?.suppliers || []).filter(
                    (item) => item.is_active === 1,
                  )}
                />
              }
            />
            <Route path="products/brands" element={<BrandPage />} />
            <Route path="products/variants" element={<ProductVariantPage />} />
            {/* Employees */}
            <Route path="employees/list" element={<EmployeePage />} />
            {/* Purchase */}
            <Route path="purchases/suppliers" element={<SupplierPage />} />
            {/* Customers */}
            <Route path="customers/list" element={<CustomerPage />} />
            <Route path="customers/loyalty" element={<LoyaltyPointPage />} />
            {/* Settings */}
            <Route path="settings/users" element={<UserPage />} />
            <Route path="settings/roles" element={<RolePermission />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
