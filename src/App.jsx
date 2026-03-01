import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import MainLayout from "./Layouts/MainLayout";
import DashboardPage from "./Pages/DashboardPage";
import { PosPage } from "./Pages/PosPage";
import DepartmentPage from "./Pages/DepartmentPage";
import WelcomPage from "./Auth/WelcomPage";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomPage />} />
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/pos" element={<PosPage />} />
            <Route path="/department" element={<DepartmentPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
