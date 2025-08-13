import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import DataTable from "../components/DataTable";

function parsePastWeek(input) {
  // "8|9|7|8|8|0|0" -> [8,9,7,8,8,0,0]
  const clean = String(input).trim();
  if (!clean) return [];
  const nums = clean.split("|").map(s => Number(s.trim()));
  if (nums.some(n => Number.isNaN(n) || n < 0)) throw new Error("Past week hours must be non-negative numbers separated by |");
  return nums;
}

export default function Drivers() {
  const qc = useQueryClient();
  const [form, setForm] = useState({ name: "", shift_hours: "", past_week_hours: "" });

  // ---- Fetch (supports paginated or array responses) ----
  const driversQuery = useQuery({
    queryKey: ["/api/drivers/"],
    queryFn: async () => (await api.get("/api/drivers/")).data,
    select: (data) => (Array.isArray(data) ? data : data?.results || []),
    refetchOnWindowFocus: false,
    staleTime: 10_000,
    retry: 1,
  });

  // Pre-format rows for the table (join arrays)
  const rows = useMemo(() => {
    return (driversQuery.data || []).map(d => ({
      ...d,
      past_week_hours: Array.isArray(d.past_week_hours)
        ? d.past_week_hours.join("|")
        : d.past_week_hours ?? "",
    }));
  }, [driversQuery.data]);

  // ---- Create ----
  const createDriver = useMutation({
    mutationFn: async (payload) => (await api.post("/api/drivers/", payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/drivers/"] }),
  });

  // ---- Delete ----
  const deleteDriver = useMutation({
    mutationFn: async (id) => (await api.delete(`/api/drivers/${id}/`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/drivers/"] }),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name.trim(),
        shift_hours: Number(form.shift_hours),
        past_week_hours: parsePastWeek(form.past_week_hours),
      };
      if (!payload.name) throw new Error("Name is required");
      if (!Number.isFinite(payload.shift_hours) || payload.shift_hours <= 0)
        throw new Error("Shift hours must be a positive number");

      await createDriver.mutateAsync(payload);
      setForm({ name: "", shift_hours: "", past_week_hours: "" });
    } catch (err) {
      alert(err?.message || "Could not add driver");
      console.error(err);
    }
  };

  const handleDelete = async (row) => {
    if (!row?.id) return;
    if (!confirm(`Delete driver "${row.name}"?`)) return;
    try {
      await deleteDriver.mutateAsync(row.id);
    } catch (err) {
      alert(err?.response?.data?.detail || "Delete failed");
      console.error(err);
    }
  };

  if (driversQuery.isLoading) return <div className="p-4">Loading…</div>;
  if (driversQuery.isError) {
    return (
      <div className="p-4 text-red-600">
        Failed to load drivers.
        <pre className="text-xs mt-2 bg-red-50 p-2 rounded">
          {JSON.stringify(driversQuery.error?.response?.data || {}, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Drivers</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-3 mb-4">
        <input
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          placeholder="Name"
          className="border p-2 rounded"
        />
        <input
          type="number"
          min={1}
          value={form.shift_hours}
          onChange={e => setForm({ ...form, shift_hours: e.target.value })}
          placeholder="Shift Hours"
          className="border p-2 rounded"
        />
        <input
          value={form.past_week_hours}
          onChange={e => setForm({ ...form, past_week_hours: e.target.value })}
          placeholder="Past Week Hours (e.g. 8|9|7|8|8|0|0)"
          className="border p-2 rounded"
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded col-span-3 disabled:opacity-60"
          disabled={createDriver.isPending}
        >
          {createDriver.isPending ? "Adding…" : "Add Driver"}
        </button>
      </form>

      <DataTable
        columns={["id", "name", "shift_hours", "past_week_hours"]}
        data={rows}
        onDelete={handleDelete}
      />
    </div>
  );
}
