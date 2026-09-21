import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const InventoryContext = createContext(null);

const API_URL = "http://localhost:8080/api/products";

export function InventoryProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeEmail, setActiveEmail] = useState(
    () => localStorage.getItem("stockmate-email") || ""
  );

  const getUserEmail = () => {
    const savedEmail = localStorage.getItem("stockmate-email");

    if (!savedEmail) {
      throw new Error("Please login again");
    }

    return savedEmail.trim().toLowerCase();
  };

  const getHeaders = () => ({
    "Content-Type": "application/json",
    "X-User-Email": getUserEmail(),
  });

  const loadProducts = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL, {
        method: "GET",
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to load products");
      }

      const data = await response.json();

      setProducts(data);
    } catch (error) {
      console.error("Loading products failed:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeEmail) {
      loadProducts();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [activeEmail]);

  const switchUser = (email) => {
    const normalizedEmail = email.trim().toLowerCase();

    setProducts([]);
    setActiveEmail(normalizedEmail);
  };

  const clearInventory = () => {
    setProducts([]);
    setActiveEmail("");
    setLoading(false);
  };

  const addProduct = async (product) => {
    const newProduct = {
      name: product.name.trim(),
      category: product.category,
      supplier: product.supplier?.trim() || "",
      price: Number(product.price),
      quantity: Number(product.quantity),
      expiryDate: product.expiryDate || null,
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend error:", errorText);
        throw new Error("Failed to add product");
      }

      const savedProduct = await response.json();

      setProducts((previousProducts) => [
        ...previousProducts,
        savedProduct,
      ]);

      return true;
    } catch (error) {
      console.error("Add product error:", error);
      throw error;
    }
  };

  const updateProduct = async (id, updatedProduct) => {
    const productData = {
      name: updatedProduct.name.trim(),
      category: updatedProduct.category,
      supplier: updatedProduct.supplier?.trim() || "",
      price: Number(updatedProduct.price),
      quantity: Number(updatedProduct.quantity),
      expiryDate: updatedProduct.expiryDate || null,
    };

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      const savedProduct = await response.json();

      setProducts((previousProducts) =>
        previousProducts.map((product) =>
          Number(product.id) === Number(id)
            ? savedProduct
            : product
        )
      );

      return true;
    } catch (error) {
      console.error("Update product error:", error);
      throw error;
    }
  };

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      setProducts((previousProducts) =>
        previousProducts.filter(
          (product) => Number(product.id) !== Number(id)
        )
      );

      return true;
    } catch (error) {
      console.error("Delete product error:", error);
      throw error;
    }
  };

  const increaseStock = async (id, quantity, supplier = "") => {
    const product = products.find(
      (item) => Number(item.id) === Number(id)
    );

    if (!product) {
      throw new Error("Product not found");
    }

    const updatedProduct = {
      ...product,
      supplier:
        supplier.trim() || product.supplier || "",
      quantity:
        Number(product.quantity) + Number(quantity),
    };

    return await updateProduct(id, updatedProduct);
  };

  const decreaseStock = async (id, quantity) => {
    const product = products.find(
      (item) => Number(item.id) === Number(id)
    );

    if (!product) {
      throw new Error("Product not found");
    }

    const newQuantity =
      Number(product.quantity) - Number(quantity);

    if (newQuantity < 0) {
      throw new Error("Insufficient stock");
    }

    const updatedProduct = {
      ...product,
      quantity: newQuantity,
    };

    return await updateProduct(id, updatedProduct);
  };

  return (
    <InventoryContext.Provider
      value={{
        products,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        increaseStock,
        decreaseStock,
        loadProducts,
        switchUser,
        clearInventory,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);

  if (!context) {
    throw new Error(
      "useInventory must be used inside InventoryProvider"
    );
  }

  return context;
}