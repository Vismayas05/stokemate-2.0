import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  TrendingDown,
} from "lucide-react";

import ThemeToggle from "../components/ThemeToggle";
import { useInventory } from "../context/InventoryContext";

export default function Sales() {
  const { products = [], decreaseStock } = useInventory();

  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    const saleQuantity = Number(quantity);
    const selectedProduct = products.find(
      (product) => Number(product.id) === Number(productId)
    );

    if (
      !productId ||
      !quantity ||
      saleQuantity <= 0 ||
      !Number.isInteger(saleQuantity)
    ) {
      setError("Enter a valid whole-number quantity.");
      return;
    }

    if (!selectedProduct) {
      setError("Please select a valid product.");
      return;
    }

    if (saleQuantity > Number(selectedProduct.quantity)) {
      setError("Sale quantity cannot exceed available stock.");
      return;
    }

    const userEmail = localStorage.getItem("stockmate-email");

    if (!userEmail) {
      setError("User session not found. Please login again.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Decrease stock in backend
      await decreaseStock(Number(productId), saleQuantity);

      // User-specific sales storage
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

      // Save sale record
      const newSale = {
        id: Date.now(),
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        quantity: saleQuantity,
        price: Number(selectedProduct.price) || 0,
        totalAmount:
          (Number(selectedProduct.price) || 0) * saleQuantity,
        date: new Date().toISOString(),
      };

      savedSales.push(newSale);

      localStorage.setItem(
        storageKey,
        JSON.stringify(savedSales)
      );

      setMessage("Sale recorded and stock updated successfully.");

      setProductId("");
      setQuantity("");
    } catch (error) {
      console.error(error);
      setError(
        error.message || "Unable to record sale."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-6 text-foreground transition-colors duration-300 sm:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Top Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-emerald-500"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <ThemeToggle />
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div className="rounded-xl bg-blue-500/10 p-3 text-blue-500">
              <ShoppingCart size={25} />
            </div>

            <h1 className="text-3xl font-bold">
              Sales
            </h1>
          </div>

          <p className="text-sm text-muted-foreground">
            Record sales and decrease product stock.
          </p>
        </div>

        {/* Sales Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="mb-6 flex items-center gap-2 text-xl font-semibold">
            <TrendingDown size={22} />
            Record Sale
          </div>

          <div className="space-y-5">
            {/* Product Selection */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Select Product *
              </label>

              <select
                value={productId}
                onChange={(event) =>
                  setProductId(event.target.value)
                }
                required
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground outline-none focus:border-emerald-500"
              >
                <option value="">
                  Choose product
                </option>

                {products.map((product) => (
                  <option
                    key={product.id}
                    value={product.id}
                  >
                    {product.name} — Current stock:{" "}
                    {product.quantity}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Sale Quantity *
              </label>

              <input
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(event) =>
                  setQuantity(event.target.value)
                }
                placeholder="Enter quantity"
                required
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground outline-none focus:border-emerald-500"
              />
            </div>

            {/* Error Message */}
            {error && (
              <p className="rounded-xl bg-red-500/10 p-3 text-sm text-red-500">
                {error}
              </p>
            )}

            {/* Success Message */}
            {message && (
              <p className="rounded-xl bg-emerald-500/10 p-3 text-sm text-emerald-500">
                {message}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
            >
              {isSubmitting
                ? "Recording..."
                : "Record Sale"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}