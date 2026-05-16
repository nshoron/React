import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";

export default function Expenses() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await api.get("/expenses/");
      setItems(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Layout>
      <h1>Expenses</h1>
      {items.map((e) => (
        <div className="card" key={e.id}>
          {e.title} - {e.amount}
        </div>
      ))}
    </Layout>
  );
}