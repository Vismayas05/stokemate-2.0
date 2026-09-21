import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Purchases from "./pages/Purchases";
import Sales from "./pages/Sales";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

import { InventoryProvider } from "./context/InventoryContext";
import { ThemeProvider } from "./context/ThemeContext";

function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {children}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <InventoryProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <AppLayout>
                  <Login />
                </AppLayout>
              }
            />

            <Route
              path="/signup"
              element={
                <AppLayout>
                  <Signup />
                </AppLayout>
              }
            />

            <Route
              path="/dashboard"
              element={
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              }
            />

            <Route
              path="/products"
              element={
                <AppLayout>
                  <Products />
                </AppLayout>
              }
            />

            <Route
              path="/purchases"
              element={
                <AppLayout>
                  <Purchases />
                </AppLayout>
              }
            />

            <Route
              path="/sales"
              element={
                <AppLayout>
                  <Sales />
                </AppLayout>
              }
            />

            <Route
              path="/alerts"
              element={
                <AppLayout>
                  <Alerts />
                </AppLayout>
              }
            />

            <Route
              path="/reports"
              element={
                <AppLayout>
                  <Reports />
                </AppLayout>
              }
            />

            <Route
              path="/settings"
              element={
                <AppLayout>
                  <Settings />
                </AppLayout>
              }
            />

            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Routes>
        </BrowserRouter>
      </InventoryProvider>
    </ThemeProvider>
  );
}