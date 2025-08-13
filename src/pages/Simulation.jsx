import { useState } from "react";
import { api, tokenStore } from "../api"; // tokenStore used only to detect auth loss
import ChartOnTimeLate from "../components/ChartOnTimeLate";
import ChartFuelBreakdown from "../components/ChartFuelBreakdown";
import { useNavigate } from "react-router-dom";

export default function Simulation() {
  const [form, setForm] = useState({
    available_drivers: 3,
    route_start_time: "09:00",
    max_hours_per_driver: 8,
  });
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function validHHMM(s) {
    const m = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(s);
    return !!m;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validHHMM(form.route_start_time)) {
      alert("Start Time must be in HH:MM (24h) format");
      return;
    }
    if (form.available_drivers <= 0 || form.max_hours_per_driver <= 0) {
      alert("Drivers and Max Hours must be positive");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/api/simulations/run/", {
        available_drivers: Number(form.available_drivers),
        route_start_time: form.route_start_time,
        max_hours_per_driver: Number(form.max_hours_per_driver),
      });
      setResult(data);
    } catch (err) {
      // If refresh failed, our interceptor clears tokens → redirect to login
      if (!tokenStore.access) {
        navigate("/login", { replace: true });
        return;
      }
      const serverMsg =
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        err?.message ||
        "Simulation failed";
      alert(serverMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Safeguards
  const kpis  = result?.kpis || null;
  const fuel  = result?.totals?.fuel_by_traffic || null;

  // If your ChartFuelBreakdown expects an array, convert from object:
  const fuelRows = fuel
    ? Object.entries(fuel).map(([traffic, value]) => ({ traffic, value }))
    : [];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Run Simulation</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 max-w-sm">
        <input
          type="number"
          className="border p-2 rounded"
          value={form.available_drivers}
          onChange={e => setForm({ ...form, available_drivers: +e.target.value })}
          placeholder="Available Drivers"
          min={1}
        />
        <input
          type="text"
          className="border p-2 rounded"
          value={form.route_start_time}
          onChange={e => setForm({ ...form, route_start_time: e.target.value })}
          placeholder="Start Time (HH:MM)"
        />
        <input
          type="number"
          className="border p-2 rounded"
          value={form.max_hours_per_driver}
          onChange={e => setForm({ ...form, max_hours_per_driver: +e.target.value })}
          placeholder="Max Hours Per Driver"
          min={1}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Running..." : "Run Simulation"}
        </button>
      </form>

      {kpis && (
        <div className="mt-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>Total Profit: ₹{kpis.total_profit}</div>
            <div>Efficiency: {kpis.efficiency}%</div>
          </div>

          <ChartOnTimeLate onTime={kpis.on_time} late={kpis.late} />
          
          <ChartFuelBreakdown data={fuelRows} />
        </div>
      )}
    </div>
  );
}
