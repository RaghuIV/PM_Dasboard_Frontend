import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="bg-gray-800 text-white px-4 py-2 flex gap-4">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/simulation">Simulation</Link>
      <Link to="/drivers">Drivers</Link>
      <Link to="/routes">Routes</Link>
      <Link to="/orders">Orders</Link>
      <button onClick={handleLogout} className="ml-auto text-red-400">Logout</button>
    </nav>
  );
}
