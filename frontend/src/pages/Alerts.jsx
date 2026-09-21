
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  Bell,
  Boxes,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";

import BrandLogo from "../components/BrandLogo";
import ThemeToggle from "../components/ThemeToggle";
import { useInventory } from "../context/InventoryContext";

function Alerts() {
  const { products = [] } = useInventory();
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Products", icon: Package, path: "/products" },
    { label: "Purchases", icon: ShoppingCart, path: "/purchases" },
    { label: "Sales", icon: TrendingUp, path: "/sales" },
    { label: "Alerts", icon: Bell, path: "/alerts" },
    { label: "Reports", icon: BarChart3, path: "/reports" },
    { label: "Settings", icon: Settings, path: "/settings" },
  ];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const thirtyDaysLater = new Date(today);
  thirtyDaysLater.setDate(today.getDate() + 30);

  const alerts = [];

  products.forEach((product) => {
    const quantity = Number(product.quantity);

    if (quantity <= 10) {
      alerts.push({
        id: `${product.id}-stock`,
        productName: product.name,
        message: `Only ${quantity} item${quantity === 1 ? "" : "s"} remaining`,
        type: "Low Stock",
        severity: quantity === 0 ? "critical" : "warning",
        icon: AlertTriangle,
      });
    }

    if (product.expiryDate) {
      const expiryDate = new Date(product.expiryDate);
      expiryDate.setHours(0, 0, 0, 0);

      if (expiryDate < today) {
        alerts.push({
          id: `${product.id}-expired`,
          productName: product.name,
          message: `Expired on ${expiryDate.toLocaleDateString()}`,
          type: "Expired",
          severity: "critical",
          icon: Clock,
        });
      } else if (expiryDate <= thirtyDaysLater) {
        alerts.push({
          id: `${product.id}-expiry`,
          productName: product.name,
          message: `Expires on ${expiryDate.toLocaleDateString()}`,
          type: "Expiring Soon",
          severity: "warning",
          icon: Clock,
        });
      }
    }
  });

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card px-4 py-6 md:flex">
        <div className="mb-9 px-2">
          <BrandLogo />
        </div>

        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          Workspace
        </p>

        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto">
          <div className="mb-4 rounded-2xl bg-slate-900 p-4 text-white dark:bg-slate-800">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500">
              <Boxes size={19} />
            </div>

            <p className="text-sm font-semibold">Your inventory hub</p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              Keep your stock updated and organized.
            </p>

            <Link
              to="/products"
              className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-emerald-400"
            >
              Manage products
              <ArrowLeft size={14} />
            </Link>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground transition hover:bg-red-500/10 hover:text-red-500"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1">
        <header className="border-b border-border bg-card px-5 py-5 sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400">
                Inventory management
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight">
                Alerts
              </h1>
            </div>

            <ThemeToggle />
          </div>
        </header>

        {/* Mobile Navigation */}
        <div className="overflow-x-auto border-b border-border bg-card px-4 py-3 md:hidden">
          <nav className="flex min-w-max gap-2">
            {navigationItems.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  <Icon size={15} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-7 p-5 sm:p-8">
          <section>
            <h2 className="text-xl font-semibold tracking-tight">
              Inventory alerts
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Monitor low-stock items and products approaching expiry.
            </p>
          </section>

          {/* Alert Summary */}
          <section className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm text-muted-foreground">Total Alerts</p>
              <p className="mt-2 text-3xl font-bold">{alerts.length}</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm text-muted-foreground">Low Stock</p>
              <p className="mt-2 text-3xl font-bold text-amber-500">
                {alerts.filter((alert) => alert.type === "Low Stock").length}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm text-muted-foreground">Expiry Alerts</p>
              <p className="mt-2 text-3xl font-bold text-red-500">
                {
                  alerts.filter(
                    (alert) =>
                      alert.type === "Expired" ||
                      alert.type === "Expiring Soon"
                  ).length
                }
              </p>
            </div>
          </section>

          {/* Alert List */}
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <h3 className="text-lg font-semibold">Active alerts</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Products that may need your attention.
              </p>
            </div>

            {alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                  <CheckCircle size={28} />
                </div>

                <h3 className="text-base font-semibold">
                  Everything looks good!
                </h3>

                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  There are no low-stock or expiry alerts at the moment.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => {
                  const Icon = alert.icon;
                  const isCritical = alert.severity === "critical";

                  return (
                    <div
                      key={alert.id}
                      className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                            isCritical
                              ? "bg-red-500/10 text-red-500"
                              : "bg-amber-500/10 text-amber-500"
                          }`}
                        >
                          <Icon size={19} />
                        </div>

                        <div>
                          <p className="font-semibold">{alert.productName}</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {alert.message}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                          isCritical
                            ? "bg-red-500/10 text-red-500"
                            : "bg-amber-500/10 text-amber-500"
                        }`}
                      >
                        {alert.type}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default Alerts;