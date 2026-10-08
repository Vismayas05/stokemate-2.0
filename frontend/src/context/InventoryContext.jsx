import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const InventoryContext = createContext(null);

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8080";

const PRODUCTS_URL = `${API_URL}/api/products`;

export function InventoryProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeEmail, setActiveEmail] = useState(
    () =>
      localStorage.getItem("stockmate-email") || ""
  );

  // --------------------------------------------------
  // AUTHENTICATION
  // --------------------------------------------------

  const getToken = () => {
    const token =
      localStorage.getItem("stockmate-token");

    if (!token) {
      throw new Error(
        "Your session has expired. Please login again."
      );
    }

    return token;
  };

  const getHeaders = () => {
    const token = getToken();

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // --------------------------------------------------
  // LOAD PRODUCTS
  // --------------------------------------------------

  const loadProducts = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        PRODUCTS_URL,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem(
          "stockmate-token"
        );

        localStorage.removeItem(
          "stockmate-user"
        );

        localStorage.removeItem(
          "stockmate-name"
        );

        localStorage.removeItem(
          "stockmate-email"
        );

        setProducts([]);
        setActiveEmail("");

        window.location.href = "/";

        return;
      }

      if (!response.ok) {
        const errorText =
          await response.text();

        console.error(
          "Load products backend error:",
          errorText
        );

        throw new Error(
          "Failed to load products"
        );
      }

      const data = await response.json();

      setProducts(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Loading products failed:",
        error
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // LOAD PRODUCTS WHEN USER CHANGES
  // --------------------------------------------------

  useEffect(() => {
    if (activeEmail) {
      loadProducts();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [activeEmail]);

  // --------------------------------------------------
  // SWITCH USER
  // --------------------------------------------------

  const switchUser = (email) => {
    if (!email) {
      setProducts([]);
      setActiveEmail("");
      return;
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    setProducts([]);
    setActiveEmail(normalizedEmail);
  };

  // --------------------------------------------------
  // CLEAR INVENTORY / LOGOUT
  // --------------------------------------------------

  const clearInventory = () => {
    setProducts([]);
    setActiveEmail("");
    setLoading(false);
  };

  // --------------------------------------------------
  // ADD PRODUCT
  // --------------------------------------------------

  const addProduct = async (product) => {
    const newProduct = {
      name: product.name.trim(),
      category: product.category,
      supplier:
        product.supplier?.trim() || "",
      price: Number(product.price),
      quantity: Number(product.quantity),
      expiryDate:
        product.expiryDate || null,
    };

    try {
      const response = await fetch(
        PRODUCTS_URL,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(newProduct),
        }
      );

      if (response.status === 401) {
        localStorage.clear();
        window.location.href = "/";
        return false;
      }

      if (!response.ok) {
        const errorText =
          await response.text();

        console.error(
          "Add product backend error:",
          errorText
        );

        throw new Error(
          "Failed to add product"
        );
      }

      const savedProduct =
        await response.json();

      setProducts(
        (previousProducts) => [
          ...previousProducts,
          savedProduct,
        ]
      );

      return true;
    } catch (error) {
      console.error(
        "Add product error:",
        error
      );

      throw error;
    }
  };

  // --------------------------------------------------
  // UPDATE PRODUCT
  // --------------------------------------------------

  const updateProduct = async (
    id,
    updatedProduct
  ) => {
    const productData = {
      name: updatedProduct.name.trim(),
      category: updatedProduct.category,
      supplier:
        updatedProduct.supplier?.trim() || "",
      price: Number(updatedProduct.price),
      quantity: Number(updatedProduct.quantity),
      expiryDate:
        updatedProduct.expiryDate || null,
    };

    try {
      const response = await fetch(
        `${PRODUCTS_URL}/${id}`,
        {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify(productData),
        }
      );

      if (response.status === 401) {
        localStorage.clear();
        window.location.href = "/";
        return false;
      }

      if (!response.ok) {
        const errorText =
          await response.text();

        console.error(
          "Update product backend error:",
          errorText
        );

        throw new Error(
          "Failed to update product"
        );
      }

      const savedProduct =
        await response.json();

      setProducts(
        (previousProducts) =>
          previousProducts.map(
            (product) =>
              Number(product.id) ===
              Number(id)
                ? savedProduct
                : product
          )
      );

      return true;
    } catch (error) {
      console.error(
        "Update product error:",
        error
      );

      throw error;
    }
  };

  // --------------------------------------------------
  // DELETE PRODUCT
  // --------------------------------------------------

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(
        `${PRODUCTS_URL}/${id}`,
        {
          method: "DELETE",
          headers: getHeaders(),
        }
      );

      if (response.status === 401) {
        localStorage.clear();
        window.location.href = "/";
        return false;
      }

      if (!response.ok) {
        const errorText =
          await response.text();

        console.error(
          "Delete product backend error:",
          errorText
        );

        throw new Error(
          "Failed to delete product"
        );
      }

      setProducts(
        (previousProducts) =>
          previousProducts.filter(
            (product) =>
              Number(product.id) !==
              Number(id)
          )
      );

      return true;
    } catch (error) {
      console.error(
        "Delete product error:",
        error
      );

      throw error;
    }
  };

  // --------------------------------------------------
  // INCREASE STOCK
  // --------------------------------------------------

  const increaseStock = async (
    id,
    quantity,
    supplier = ""
  ) => {
    const product = products.find(
      (item) =>
        Number(item.id) === Number(id)
    );

    if (!product) {
      throw new Error(
        "Product not found"
      );
    }

    const updatedProduct = {
      ...product,

      supplier:
        supplier.trim() ||
        product.supplier ||
        "",

      quantity:
        Number(product.quantity) +
        Number(quantity),
    };

    return await updateProduct(
      id,
      updatedProduct
    );
  };

  // --------------------------------------------------
  // DECREASE STOCK
  // --------------------------------------------------

  const decreaseStock = async (
    id,
    quantity
  ) => {
    const product = products.find(
      (item) =>
        Number(item.id) === Number(id)
    );

    if (!product) {
      throw new Error(
        "Product not found"
      );
    }

    const newQuantity =
      Number(product.quantity) -
      Number(quantity);

    if (newQuantity < 0) {
      throw new Error(
        "Insufficient stock"
      );
    }

    const updatedProduct = {
      ...product,
      quantity: newQuantity,
    };

    return await updateProduct(
      id,
      updatedProduct
    );
  };

  // --------------------------------------------------
  // PROVIDER
  // --------------------------------------------------

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

// --------------------------------------------------
// HOOK
// --------------------------------------------------

export function useInventory() {
  const context =
    useContext(InventoryContext);

  if (!context) {
    throw new Error(
      "useInventory must be used inside InventoryProvider"
    );
  }

  return context;
}