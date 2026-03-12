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
function App() {
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
            <Route path="products/brands" element={<BrandPage />} />
            {/* Settings */}
            <Route path="settings/users" element={<UserPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
