import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import DashboardCard from "../components/DashboardCard";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    totalExpenses: 0,
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const inventory = await api.get("inventory/stocks/");
      const expenses = await api.get("expenses/");
      const products = await api.get("products/variants/");

      setStats({
        totalProducts: products.data.length,   // fixed
        totalStock: inventory.data.reduce(
          (sum, item) => sum + item.stock_quantity,
          0
        ),
        totalExpenses: expenses.data.length,
      });

    } catch (error) {
      console.log("Full Error:", error);
      console.log("Response:", error.response);
      console.log("Message:", error.message);
    }
  };

  return (
    <Layout>
      <h1>Dashboard</h1>

      <div className="cards">
        <DashboardCard title="Products" value={stats.totalProducts} />
        <DashboardCard title="Stock" value={stats.totalStock} />
        <DashboardCard title="Expenses" value={stats.totalExpenses} />
      </div>
    </Layout>
  );
}