import { useEffect, useState } from "react";
import { api } from "../api";
import DataTable from "../components/DataTable";

export default function RoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [form, setForm] = useState({ route_id: "", distance_km: "", traffic_level: "Low", base_time_min: "" });

  const fetchRoutes = async () => {
    const res = await api.get("/api/routes/");
    setRoutes(res.data);
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    await api.post("/api/routes/", form);
    setForm({ route_id: "", distance_km: "", traffic_level: "Low", base_time_min: "" });
    fetchRoutes();
  };

  const handleDelete = async row => {
    await api.delete(`/api/routes/${row.id}/`);
    fetchRoutes();
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Routes</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-3 mb-4">
        <input value={form.route_id} onChange={e=>setForm({...form, route_id: e.target.value})} placeholder="Route ID" className="border p-2 rounded" />
        <input value={form.distance_km} onChange={e=>setForm({...form, distance_km: e.target.value})} placeholder="Distance (km)" className="border p-2 rounded" />
        <select value={form.traffic_level} onChange={e=>setForm({...form, traffic_level: e.target.value})} className="border p-2 rounded">
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <input value={form.base_time_min} onChange={e=>setForm({...form, base_time_min: e.target.value})} placeholder="Base Time (min)" className="border p-2 rounded" />
        <button className="bg-green-600 text-white px-4 py-2 rounded col-span-4">Add Route</button>
      </form>

      <DataTable columns={["id", "route_id", "distance_km", "traffic_level", "base_time_min"]} data={routes} onDelete={handleDelete} />
    </div>
  );
}
