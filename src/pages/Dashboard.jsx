import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import ChartOnTimeLate from "../components/ChartOnTimeLate";
import ChartFuelBreakdown from "../components/ChartFuelBreakdown";
import KpiCard from "../components/KpiCard";
import { Link } from "react-router-dom";

function pickLatest(listLike) {
  if (!listLike) return null;
  const list = Array.isArray(listLike) ? listLike : listLike.results || [];
  return list[0] || null; // API is already ordered by -ran_at
}

export default function Dashboard() {
  const qc = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["/api/simulations/"],
    queryFn: async () => (await api.get("/api/simulations/")).data,
    select: pickLatest,                 // grab the most recent item
    refetchOnWindowFocus: false,
    staleTime: 15_000,                  // 15s cache
    retry: 1,
  });

  // Optional: quick-run a simulation from dashboard if none exist yet
  const runSim = useMutation({
    mutationFn: (payload) => api.post("/api/simulations/run/", payload).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/simulations/"] }),
  });

  if (isLoading) return <div className="p-4">Loading…</div>;

  if (isError) {
    console.error(error?.response?.data || error);
    return (
      <div className="p-4 text-red-600">
        Failed to load dashboard.
        <pre className="text-xs mt-2 bg-red-50 p-2 rounded">
          {JSON.stringify(error?.response?.data || {}, null, 2)}
        </pre>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4 space-y-4">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded">
          No simulations found yet. Run your first one.
        </div>
        <div className="flex gap-3">
          <Link to="/simulation" className="inline-block bg-blue-600 text-white px-4 py-2 rounded">
            Go to Simulation
          </Link>
          <button
            className="inline-block bg-green-600 text-white px-4 py-2 rounded disabled:opacity-60"
            disabled={runSim.isPending}
            onClick={() =>
              runSim.mutate({ available_drivers: 3, route_start_time: "09:00", max_hours_per_driver: 8 })
            }
          >
            {runSim.isPending ? "Running…" : "Quick Run"}
          </button>
        </div>
      </div>
    );
  }

  const kpis = data.kpis || { total_profit: 0, efficiency: 0, on_time: 0, late: 0 };
  const fuel = data.totals?.fuel_by_traffic || { Low: 0, Medium: 0, High: 0 };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4">
        <KpiCard title="Total Profit" value={`₹${kpis.total_profit}`} />
        <KpiCard title="Efficiency" value={`${kpis.efficiency}%`} />
      </div>

      <ChartOnTimeLate onTime={kpis.on_time} late={kpis.late} />
      {/* If ChartFuelBreakdown expects rows, convert: Object.entries(fuel).map(([traffic, value])=>({traffic, value})) */}
      <ChartFuelBreakdown data={fuel} />
    </div>
  );
}
