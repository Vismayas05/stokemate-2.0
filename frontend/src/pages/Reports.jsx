
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BarChart3,
  Package,
  Boxes,
  AlertTriangle,
  IndianRupee,
} from "lucide-react";

import ThemeToggle from "../components/ThemeToggle";
import { useInventory } from "../context/InventoryContext";

export default function Reports() {
  const { products } = useInventory();

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (total, product) => total + Number(product.quantity || 0),
    0
  );

  const totalValue = products.reduce(
    (total, product) =>
      total +
      Number(product.price || 0) * Number(product.quantity || 0),
    0
  );

  const lowStockProducts = products.filter(
    (product) => Number(product.quantity || 0) <= 5
  );

  const maxStock = Math.max(
    ...products.map((product) => Number(product.quantity || 0)),
    1
  );

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const summaryCards = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: Package,
      color: "emerald",
    },
    {
      title: "Total Stock",
      value: totalStock,
      icon: Boxes,
      color: "blue",
    },
    {
      title: "Inventory Value",
      value: formatCurrency(totalValue),
      icon: IndianRupee,
      color: "purple",
    },
    {
      title: "Low Stock Items",
      value: lowStockProducts.length,
      icon: AlertTriangle,
      color: "orange",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <Link
              to="/dashboard"
              className="mb-3 flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Reports
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Analyze your inventory with simple visual insights.
            </p>
          </div>

          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 p-5 sm:p-8">
        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ y: -5 }}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-500">
                    <Icon size={21} />
                  </div>

                  <BarChart3
                    size={18}
                    className="text-muted-foreground"
                  />
                </div>

                <p className="text-sm text-muted-foreground">
                  {card.title}
                </p>

                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="mt-2 text-2xl font-bold"
                >
                  {card.value}
                </motion.h2>
              </motion.div>
            );
          })}
        </div>

        {/* Stock Overview Graph */}
        <motion.section
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold">
              Stock Overview
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Current quantity of each product.
            </p>
          </div>

          {products.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              Add products to view the stock graph.
            </p>
          ) : (
            <div className="space-y-5">
              {products.map((product, index) => {
                const quantity = Number(product.quantity || 0);
                const percentage = (quantity / maxStock) * 100;

                return (
                  <div key={product.id}>
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <span className="truncate text-sm font-medium">
                        {product.name}
                      </span>

                      <span className="text-sm font-semibold text-emerald-500">
                        {quantity}
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{
                          delay: 0.5 + index * 0.1,
                          duration: 0.8,
                          ease: "easeOut",
                        }}
                        className={`h-full rounded-full ${
                          quantity <= 5
                            ? "bg-orange-500"
                            : "bg-emerald-500"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.section>

        {/* Low Stock Products */}
        <motion.section
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-orange-500/10 p-3 text-orange-500">
              <AlertTriangle size={21} />
            </div>

            <div>
              <h2 className="text-lg font-semibold">
                Low Stock Products
              </h2>

              <p className="text-sm text-muted-foreground">
                Products with 5 or fewer items.
              </p>
            </div>
          </div>

          {lowStockProducts.length === 0 ? (
            <p className="rounded-xl bg-emerald-500/10 p-4 text-sm text-emerald-600 dark:text-emerald-400">
              No low-stock products currently.
            </p>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-xl bg-muted px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {product.name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {product.category || "Uncategorized"}
                    </p>
                  </div>

                  <span className="font-semibold text-orange-500">
                    {product.quantity} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.section>

        {/* Product Summary Table */}
        <motion.section
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
        >
          <div className="mb-5">
            <h2 className="text-lg font-semibold">
              Product Summary
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Detailed inventory information.
            </p>
          </div>

          {products.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              No products available.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Product</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Stock</th>
                    <th className="px-4 py-3 font-medium">Price</th>
                    <th className="px-4 py-3 font-medium">Value</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => {
                    const quantity = Number(product.quantity || 0);
                    const price = Number(product.price || 0);

                    return (
                      <tr
                        key={product.id}
                        className="border-b border-border last:border-0"
                      >
                        <td className="px-4 py-4 font-medium">
                          {product.name}
                        </td>

                        <td className="px-4 py-4 text-muted-foreground">
                          {product.category || "—"}
                        </td>

                        <td
                          className={`px-4 py-4 font-semibold ${
                            quantity <= 5
                              ? "text-orange-500"
                              : "text-emerald-500"
                          }`}
                        >
                          {quantity}
                        </td>

                        <td className="px-4 py-4">
                          {formatCurrency(price)}
                        </td>

                        <td className="px-4 py-4 font-medium">
                          {formatCurrency(quantity * price)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.section>
      </main>
    </div>
  );
}