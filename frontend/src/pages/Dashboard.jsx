import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  ArrowUpRight,
  BarChart3,
  Bell,
  Boxes,
  LayoutDashboard,
  LogOut,
  Package,
  Plus,
  Search,
  Settings,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import BrandLogo from "../components/BrandLogo";
import ThemeToggle from "../components/ThemeToggle";
import { useInventory } from "../context/InventoryContext";

function Dashboard() {
  const [search, setSearch] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const { products = [] } = useInventory();

  // Get current user's sales
  const salesCount = useMemo(() => {
    const userEmail = localStorage.getItem("stockmate-email");

    if (!userEmail) return 0;

    const storageKey = `stockmate-sales-${userEmail
      .toLowerCase()
      .trim()}`;

    let savedSales = [];

    try {
      savedSales = JSON.parse(
        localStorage.getItem(storageKey) || "[]"
      );
    } catch {
      savedSales = [];
    }

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    return savedSales.filter((sale) => {
      const saleDate = new Date(sale.date);

      return (
        saleDate.getMonth() === currentMonth &&
        saleDate.getFullYear() === currentYear
      );
    }).length;
  }, [location.pathname]);

  const navigationItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      label: "Products",
      icon: Package,
      path: "/products",
    },
    {
      label: "Purchases",
      icon: ShoppingCart,
      path: "/purchases",
    },
    {
      label: "Sales",
      icon: TrendingUp,
      path: "/sales",
    },
    {
      label: "Alerts",
      icon: Bell,
      path: "/alerts",
    },
    {
      label: "Reports",
      icon: BarChart3,
      path: "/reports",
    },
    {
      label: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  const lowStockCount = products.filter(
    (product) => Number(product.quantity) <= 10
  ).length;

  const expiringSoonCount = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const limit = new Date(today);
    limit.setDate(limit.getDate() + 30);
    limit.setHours(23, 59, 59, 999);

    return products.filter((product) => {
      if (!product.expiryDate) return false;

      const [year, month, day] = String(product.expiryDate)
        .slice(0, 10)
        .split("-")
        .map(Number);

      const expiryDate = new Date(year, month - 1, day);
      expiryDate.setHours(0, 0, 0, 0);

      return expiryDate >= today && expiryDate <= limit;
    }).length;
  }, [products]);

  const stats = [
    {
      title: "Total Products",
      value: products.length,
      description: "Your inventory items",
      icon: Package,
    },
    {
      title: "Low Stock",
      value: lowStockCount,
      description: "Items needing attention",
      icon: Bell,
    },
    {
      title: "Total Sales",
      value: salesCount,
      description: "Sales this month",
      icon: TrendingUp,
    },
    {
      title: "Expiring Soon",
      value: expiringSoonCount,
      description: "Products near expiry",
      icon: ShoppingCart,
    },
  ];

  const filteredProducts = products.filter((product) =>
    String(product.name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem("stockmate-user");
    localStorage.removeItem("stockmate-name");
    localStorage.removeItem("stockmate-email");

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
                <Icon size={18} strokeWidth={isActive ? 2.3 : 2} />
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

            <p className="text-sm font-semibold">
              Your inventory hub
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              Add products to start managing your inventory.
            </p>

            <Link
              to="/products"
              className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 transition hover:text-emerald-300"
            >
              Manage products
              <ArrowUpRight size={14} />
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
        {/* Header */}
        <header className="border-b border-border bg-card px-5 py-5 sm:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400">
                Inventory management
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />

              <Link to="/products">
                <Button className="bg-primary text-primary-foreground transition hover:bg-emerald-600 hover:text-white">
                  <Plus size={17} />
                  <span className="hidden sm:inline">
                    Add Product
                  </span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Mobile Navigation */}
        <div className="overflow-x-auto border-b border-border bg-card px-4 py-3 md:hidden">
          <nav className="flex min-w-max gap-2">
            {navigationItems.slice(0, 4).map((item) => {
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

        {/* Dashboard Body */}
        <div className="space-y-7 p-5 sm:p-8">
          {/* Welcome */}
          <section>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Welcome to StockMate
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Keep track of your inventory and manage your business
              efficiently.
            </p>
          </section>

          {/* Statistics */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <Card
                  key={stat.title}
                  className="border-border bg-card shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>

                    <div className="rounded-lg bg-accent p-2 text-muted-foreground">
                      <Icon size={18} />
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-3xl font-bold tracking-tight text-foreground">
                      {stat.value}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </section>

          {/* Inventory Overview */}
          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <CardTitle className="text-lg text-foreground">
                    Inventory overview
                  </CardTitle>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Your recently added products will appear here.
                  </p>
                </div>

                <Link to="/products">
                  <Button
                    variant="outline"
                    className="border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    View Products
                    <ArrowUpRight size={16} />
                  </Button>
                </Link>
              </div>
            </CardHeader>

            <CardContent>
              {/* Search */}
              <div className="mb-5 flex h-11 items-center gap-3 rounded-xl border border-border bg-muted/50 px-3">
                <Search
                  size={17}
                  className="text-muted-foreground"
                />

                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>

              {/* Empty State */}
              {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 py-14 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Package size={26} strokeWidth={1.8} />
                  </div>

                  <h3 className="text-base font-semibold text-foreground">
                    {products.length === 0
                      ? "No products added yet"
                      : "No matching products"}
                  </h3>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                    {products.length === 0
                      ? "Your inventory is currently empty. Add your first product to start tracking stock."
                      : "Try searching with a different product name."}
                  </p>

                  {products.length === 0 && (
                    <Link to="/products">
                      <Button className="mt-5 bg-primary text-primary-foreground transition hover:bg-emerald-600 hover:text-white">
                        <Plus size={17} />
                        Add your first product
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                /* Product Table */
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground">
                        <th className="p-3 font-medium">Product</th>
                        <th className="p-3 font-medium">Category</th>
                        <th className="p-3 font-medium">Price</th>
                        <th className="p-3 font-medium">Quantity</th>
                        <th className="p-3 font-medium">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredProducts.map((product) => (
                        <tr
                          key={product.id}
                          className="border-b border-border last:border-0"
                        >
                          <td className="p-3 font-medium text-foreground">
                            {product.name}
                          </td>

                          <td className="p-3 text-muted-foreground">
                            {product.category || "—"}
                          </td>

                          <td className="p-3 text-foreground">
                            ₹{product.price}
                          </td>

                          <td className="p-3 text-foreground">
                            {product.quantity}
                          </td>

                          <td className="p-3">
                            <Badge
                              variant={
                                Number(product.quantity) <= 10
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {Number(product.quantity) <= 10
                                ? "Low Stock"
                                : "In Stock"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
