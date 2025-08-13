import { useState } from "react";
import { api, tokenStore } from "../api"; 
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
    
      const { data } = await api.post("/api/auth/login/", { username, password });
      tokenStore.set({ access: data.access, refresh: data.refresh });
      api.defaults.headers.common.Authorization = `Bearer ${data.access}`;

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(err?.response?.data || err);
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Login failed";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl mb-4">Manager Login</h2>
        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Username"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
        />
        <input
          type="password"
          className="w-full mb-3 p-2 border rounded"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />
        <button disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="text-sm text-center mt-3">
          New here? <Link to="/register" className="text-blue-600">Create an account</Link>
        </div>
      </form>
    </div>
  );
}
