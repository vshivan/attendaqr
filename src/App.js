import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ScanPage from "./pages/ScanPage";
import SmartAttendanceWithQR from "./components/SmartAttendanceWithQR";


export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/display" element={<SmartAttendanceWithQR />} />

        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
