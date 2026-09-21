import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  PackagePlus,
  ShoppingCart,
} from "lucide-react";

import ThemeToggle from "../components/ThemeToggle";
import { useInventory } from "../context/InventoryContext";

export default function Purchases() {
  const { products, increaseStock } = useInventory();

  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [supplier, setSupplier] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (
      !productId ||
      !quantity ||
      Number(quantity) <= 0 ||
      !Number.isInteger(Number(quantity))
    ) {
      setError("Enter a valid whole-number quantity.");
      return;
    }

    try {
      setIsSubmitting(true);

      await increaseStock(
        Number(productId),
        Number(quantity),
        supplier
      );

      setMessage("Purchase recorded and stock updated successfully.");

      setProductId("");
      setQuantity("");
      setSupplier("");
    } catch (error) {
      console.error(error);
      setError(error.message || "Unable to record purchase.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-6 text-foreground transition-colors duration-300 sm:px-8">
      <div className="mx-auto max-w-3xl">
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

        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-500">
              <ShoppingCart size={25} />
            </div>

            <h1 className="text-3xl font-bold">Purchases</h1>
          </div>

          <p className="text-sm text-muted-foreground">
            Record purchases and increase product stock.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="mb-6 flex items-center gap-2 text-xl font-semibold">
            <PackagePlus size={22} />
            Record Purchase
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Select Product *
              </label>

              <select
                value={productId}
                onChange={(event) => setProductId(event.target.value)}
                required
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground outline-none focus:border-emerald-500"
              >
                <option value="">Choose product</option>

                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} — Current stock: {product.quantity}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Purchase Quantity *
              </label>

              <input
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                placeholder="Enter quantity"
                required
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Supplier
              </label>

              <input
                type="text"
                value={supplier}
                onChange={(event) => setSupplier(event.target.value)}
                placeholder="Supplier name"
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground outline-none focus:border-emerald-500"
              />
            </div>

            {error && (
              <p className="rounded-xl bg-red-500/10 p-3 text-sm text-red-500">
                {error}
              </p>
            )}

            {message && (
              <p className="rounded-xl bg-emerald-500/10 p-3 text-sm text-emerald-500">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
            >
              {isSubmitting ? "Recording..." : "Record Purchase"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
