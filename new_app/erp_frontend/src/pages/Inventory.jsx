import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";

export default function Inventory() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await api.get("inventory/stocks/");
      setItems(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const operate = async (id, type) => {
    await api.post(`inventory/stocks/${id}/operate/`, {
      type,
      quantity: 10,
    });
    load();
  };

  return (
    <Layout>
      <h1>Inventory</h1>

      {items.map((i) => (
        <div className="card" key={i.id}>
          <h3>{i.product_variant}</h3>
          <p>Stock: {i.stock_quantity}</p>
          <button onClick={() => operate(i.id, "purchase")}>Stock In</button>
          <button onClick={() => operate(i.id, "b2c_sale")}>Stock Out</button>
        </div>
        

    
      ))}
    </Layout>
  );
}