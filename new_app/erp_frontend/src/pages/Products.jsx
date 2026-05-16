import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";

export default function Products() {
  const [variants, setVariants] = useState([]);

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    brand: "",
    size: "",
    color: "",
    product_code: "",
  });

  useEffect(() => {
    loadVariants();
    loadPresetValues();
  }, []);

  // ==============================
  // LOAD DATA
  // ==============================

  const loadVariants = async () => {
    try {
      const res = await api.get("products/variants/");
      setVariants(res.data.results || res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadPresetValues = async () => {
    try {
      const [catRes, brandRes, sizeRes, colorRes] = await Promise.all([
        api.get("products/categories/"),
        api.get("products/brands/"),
        api.get("products/sizes/"),
        api.get("products/colors/"),
      ]);

      setCategories(catRes.data.results || catRes.data);
      setBrands(brandRes.data.results || brandRes.data);
      setSizes(sizeRes.data.results || sizeRes.data);
      setColors(colorRes.data.results || colorRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ==============================
  // FORM HANDLING
  // ==============================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      // Create Product
      const productRes = await api.post("products/products/", {
        name: formData.name,
        category: formData.category,
        brand: formData.brand,
      });

      const productId = productRes.data.id;

      // Create Variant
      await api.post("products/variants/", {
        product: productId,
        size: formData.size,
        color: formData.color,
        product_code: formData.product_code,
      });

      alert("Product Added Successfully");

      setFormData({
        name: "",
        category: "",
        brand: "",
        size: "",
        color: "",
        product_code: "",
      });

      loadVariants();
    } catch (error) {
      console.log(error.response?.data);
      alert("Failed to add product");
    }
  };

  // ==============================
  // GROUP BY PRODUCT NAME
  // ==============================

  const groupedProducts = variants.reduce((acc, v) => {
    const productName =
      v.product_name || v.product?.name || `Product-${v.product}`;

    if (!acc[productName]) {
      acc[productName] = [];
    }

    acc[productName].push(v);
    return acc;
  }, {});

  // ==============================
  // UI
  // ==============================

  return (
    <Layout>
     <h2></h2>
      {/* ================= FORM ================= */}
      <h2>Add New Product</h2>

      <div className="form">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
        />

        <select name="category" value={formData.category} onChange={handleChange}>
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select name="brand" value={formData.brand} onChange={handleChange}>
          <option value="">Select Brand</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        <select name="size" value={formData.size} onChange={handleChange}>
          <option value="">Select Size</option>
          {sizes.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <select name="color" value={formData.color} onChange={handleChange}>
          <option value="">Select Color</option>
          {colors.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="product_code"
          placeholder="Product Code"
          value={formData.product_code}
          onChange={handleChange}
        />
        
      </div>
       <div>
                <button onClick={handleSubmit}>Add Product</button>
      </div>

      <hr />

      {/* ================= LIST ================= */}
      <h2>Product List</h2>

      <div className="cards">
        {Object.keys(groupedProducts).length > 0 ? (
          Object.entries(groupedProducts).map(([productName, productVariants]) => (
            <div className="card" key={productName}>
              <h3>{productName}</h3>

              {productVariants.map((v) => (
                <div className="variant" key={v.id}>
                  <p><strong>Code:</strong> {v.product_code}</p>
                  <p><strong>Size:</strong> {v.size}</p>
                  <p><strong>Color:</strong> {v.color}</p>
                  <hr />
                </div>
              ))}
            </div>
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>
    </Layout>
  );
}