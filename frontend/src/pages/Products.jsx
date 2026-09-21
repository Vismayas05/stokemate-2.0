import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Package,
} from "lucide-react";

import ThemeToggle from "../components/ThemeToggle";
import { useInventory } from "../context/InventoryContext";

const categories = [
  "Groceries",
  "Electronics",
  "Clothing",
  "Stationery",
  "Cosmetics",
  "Household",
  "Food & Beverages",
  "Other",
];

const initialForm = {
  name: "",
  category: "",
  supplier: "",
  price: "",
  quantity: "",
  expiryDate: "",
};

export default function Products() {
  const {
    products = [],
    addProduct,
    updateProduct,
    deleteProduct,
  } = useInventory();

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredProducts = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) {
      return products;
    }

    return products.filter((product) => {
      const text = [
        product.name,
        product.category,
        product.supplier,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(searchText);
    });
  }, [products, search]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(false);
  };

  const openAddForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = form.name.trim();
    const category = form.category;
    const supplier = form.supplier.trim();
    const price = Number(form.price);
    const quantity = Number(form.quantity);

    if (
      !name ||
      !category ||
      form.price === "" ||
      form.quantity === ""
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    if (
      !Number.isFinite(price) ||
      !Number.isFinite(quantity) ||
      price < 0 ||
      quantity < 0
    ) {
      alert("Please enter valid price and quantity values.");
      return;
    }

    if (!Number.isInteger(quantity)) {
      alert("Quantity must be a whole number.");
      return;
    }

    const productData = {
      name,
      category,
      supplier,
      price,
      quantity,
      expiryDate: form.expiryDate || null,
    };

    try {
      setIsSubmitting(true);

      if (editingId !== null) {
        await updateProduct(editingId, productData);
      } else {
        await addProduct(productData);
      }

      resetForm();
    } catch (error) {
      console.error("Product save error:", error);
      alert("Unable to save product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name || "",
      category: product.category || "",
      supplier: product.supplier || "",
      price: product.price ?? "",
      quantity: product.quantity ?? "",
      expiryDate: product.expiryDate || "",
    });

    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProduct(id);
    } catch (error) {
      console.error("Product delete error:", error);
      alert("Unable to delete product. Please try again.");
    }
  };

  const formatExpiryDate = (expiryDate) => {
    if (!expiryDate) {
      return "—";
    }

    const date = new Date(`${expiryDate}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString("en-IN");
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-border bg-card px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-start justify-between gap-4">
          <div>
            <Link
              to="/dashboard"
              className="mb-3 flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Products
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage your shop inventory in one place.
            </p>
          </div>

          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl space-y-6 p-5 sm:p-8">
        {/* Add Product Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={openAddForm}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>

        {/* Search */}
        <div className="flex h-12 items-center gap-3 rounded-xl border border-border bg-muted px-4">
          <Search
            size={18}
            className="text-muted-foreground"
          />

          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>

        {/* Product Form */}
        {showForm && (
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {editingId !== null
                  ? "Edit Product"
                  : "Add New Product"}
              </h2>

              <button
                type="button"
                onClick={resetForm}
                disabled={isSubmitting}
                aria-label="Close product form"
                className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid gap-4 md:grid-cols-2"
            >
              {/* Product Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-muted-foreground"
                >
                  Product Name *
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  placeholder="Enter product name"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium text-muted-foreground"
                >
                  Category *
                </label>

                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="">Select category</option>

                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Supplier */}
              <div>
                <label
                  htmlFor="supplier"
                  className="mb-2 block text-sm font-medium text-muted-foreground"
                >
                  Supplier
                </label>

                <input
                  id="supplier"
                  name="supplier"
                  type="text"
                  value={form.supplier}
                  onChange={handleChange}
                  maxLength={100}
                  placeholder="Enter supplier name"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Price */}
              <div>
                <label
                  htmlFor="price"
                  className="mb-2 block text-sm font-medium text-muted-foreground"
                >
                  Price *
                </label>

                <input
                  id="price"
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Quantity */}
              <div>
                <label
                  htmlFor="quantity"
                  className="mb-2 block text-sm font-medium text-muted-foreground"
                >
                  Quantity *
                </label>

                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={form.quantity}
                  onChange={handleChange}
                  required
                  min="0"
                  step="1"
                  placeholder="0"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Expiry Date */}
              <div>
                <label
                  htmlFor="expiryDate"
                  className="mb-2 block text-sm font-medium text-muted-foreground"
                >
                  Expiry Date
                </label>

                <input
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  value={form.expiryDate}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex gap-3 md:col-span-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting
                    ? "Saving..."
                    : editingId !== null
                      ? "Update Product"
                      : "Save Product"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isSubmitting}
                  className="rounded-xl border border-border px-5 py-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Products Table */}
        <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                <Package size={30} />
              </div>

              <h3 className="text-lg font-semibold">
                {products.length === 0
                  ? "No products added yet"
                  : "No products found"}
              </h3>

              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                {products.length === 0
                  ? "Add your first product to start managing your inventory."
                  : "Try searching with a different product name or category."}
              </p>

              {products.length === 0 && (
                <button
                  type="button"
                  onClick={openAddForm}
                  className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                >
                  <Plus size={17} />
                  Add Product
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="border-b border-border bg-muted text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4 font-semibold">
                      Product
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Category
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Supplier
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Price
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Quantity
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Expiry Date
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((product) => {
                    const quantity = Number(product.quantity);
                    const isLowStock = quantity <= 5;

                    return (
                      <tr
                        key={product.id}
                        className="border-b border-border transition last:border-0 hover:bg-muted/50"
                      >
                        <td className="px-6 py-4 font-medium">
                          {product.name}
                        </td>

                        <td className="px-6 py-4 text-muted-foreground">
                          {product.category || "—"}
                        </td>

                        <td className="px-6 py-4 text-muted-foreground">
                          {product.supplier || "—"}
                        </td>

                        <td className="px-6 py-4">
                          ₹{Number(product.price || 0).toFixed(2)}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={
                              isLowStock
                                ? "font-semibold text-amber-500"
                                : "font-semibold text-emerald-500"
                            }
                          >
                            {product.quantity}
                          </span>
                        </td>

                        {/* Expiry Date Display */}
                        <td className="px-6 py-4 text-muted-foreground">
                          {formatExpiryDate(product.expiryDate)}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleEdit(product)}
                              title="Edit product"
                              aria-label={`Edit ${product.name}`}
                              className="rounded-lg p-2 text-muted-foreground transition hover:bg-emerald-500/10 hover:text-emerald-500"
                            >
                              <Pencil size={17} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(product.id)}
                              title="Delete product"
                              aria-label={`Delete ${product.name}`}
                              className="rounded-lg p-2 text-muted-foreground transition hover:bg-red-500/10 hover:text-red-500"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}