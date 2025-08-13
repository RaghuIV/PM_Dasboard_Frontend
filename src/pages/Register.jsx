import { useState } from "react";
import { api } from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/auth/register/", { username, password });
      const { data } = await api.post("/api/auth/login/", { username, password });
      localStorage.setItem("token", data.access);
      navigate("/dashboard");
    } catch (err) {
      alert("Registration failed. Try a different username.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl mb-4">Create Manager Account</h2>
        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Username"
          value={username}
          onChange={e=>setUsername(e.target.value)}
        />
        <input
          type="password"
          className="w-full mb-3 p-2 border rounded"
          placeholder="Password"
          value={password}
          onChange={e=>setPassword(e.target.value)}
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded w-full">
          {loading ? "Creating..." : "Register"}
        </button>
        <div className="text-sm text-center mt-3">
          Already have an account? <Link to="/" className="text-blue-600">Login</Link>
        </div>
      </form>
    </div>
  );
}
