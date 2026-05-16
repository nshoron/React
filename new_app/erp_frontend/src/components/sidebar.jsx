import { Link } from "react-router-dom";

export default function Sidebar() {
  const menu = [
    ["Dashboard", "/"],
    ["Products", "/products"],
    ["Inventory", "/inventory"],
    ["Sales", "/sales"],
    ["Expenses", "/expenses"],
  ];

  return (
    <aside className="sidebar">
      <h1>ERP System</h1>
      {menu.map(([name, path]) => (
        <Link key={name} to={path}>{name}</Link>
      ))}
    </aside>
  );
}