import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import DataTable from "../components/DataTable";

function selectList(data) {
  return Array.isArray(data) ? data : data?.results || [];
}

export default function Orders() {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    order_id: "",
    value_rs: "",
    route: "",              // will store route PK (id)
    delivery_time_min: "",
  });

  // Fetch orders
  const ordersQ = useQuery({
    queryKey: ["/api/orders/"],
    queryFn: async () => (await api.get("/api/orders/")).data,
    select: selectList,
    refetchOnWindowFocus: false,
    staleTime: 10_000,
    retry: 1,
  });

  // Fetch routes for the select
  const routesQ = useQuery({
    queryKey: ["/api/routes/"],
    queryFn: async () => (await api.get("/api/routes/")).data,
    select: selectList,
    refetchOnWindowFocus: false,
    staleTime: 60_000,
  });

  // Normalize rows for table
  const rows = useMemo(() => {
    return (ordersQ.data || []).map((o) => {
      // route can be an object (e.g., {id, route_id, ...}) or a number (pk)
      const r = o.route;
      const routeLabel =
        typeof r === "object" && r !== null
          ? (r.route_id ?? r.id ?? "")
          : r ?? "";
      return { ...o, route: routeLabel };
    });
  }, [ordersQ.data]);

  // Create
  const createOrder = useMutation({
    mutationFn: async (payload) => (await api.post("/api/orders/", payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/orders/"] }),
  });

  // Delete
  const deleteOrder = useMutation({
    mutationFn: async (id) => (await api.delete(`/api/orders/${id}/`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/orders/"] }),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        order_id: Number(form.order_id),
        value_rs: Number(form.value_rs),
        route: Number(form.route),              // FK id/PK
        delivery_time_min: Number(form.delivery_time_min),
      };

      // Basic validation
      if (!Number.isInteger(payload.order_id) || payload.order_id <= 0)
        throw new Error("Order ID must be a positive integer");
      if (!Number.isInteger(payload.value_rs) || payload.value_rs < 0)
        throw new Error("Value (Rs) must be a non-negative integer");
      if (!Number.isInteger(payload.route) || payload.route <= 0)
        throw new Error("Select a valid Route");
      if (!Number.isInteger(payload.delivery_time_min) || payload.delivery_time_min <= 0)
        throw new Error("Delivery time (min) must be a positive integer");

      await createOrder.mutateAsync(payload);
      setForm({ order_id: "", value_rs: "", route: "", delivery_time_min: "" });
    } catch (err) {
      alert(err?.message || err?.response?.data?.detail || "Could not add order");
      console.error(err);
    }
  };

  const handleDelete = async (row) => {
    if (!row?.id) return;
    if (!confirm(`Delete order #${row.order_id}?`)) return;
    try {
      await deleteOrder.mutateAsync(row.id);
    } catch (err) {
      alert(err?.response?.data?.detail || "Delete failed");
      console.error(err);
    }
  };

  if (ordersQ.isLoading || routesQ.isLoading) return <div className="p-4">Loading…</div>;
  if (ordersQ.isError) {
    return (
      <div className="p-4 text-red-600">
        Failed to load orders.
        <pre className="text-xs mt-2 bg-red-50 p-2 rounded">
          {JSON.stringify(ordersQ.error?.response?.data || {}, null, 2)}
        </pre>
      </div>
    );
  }
  if (routesQ.isError) {
    return (
      <div className="p-4 text-red-600">
        Failed to load routes for the order form.
        <pre className="text-xs mt-2 bg-red-50 p-2 rounded">
          {JSON.stringify(routesQ.error?.response?.data || {}, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Orders</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-3 mb-4">
        <input
          value={form.order_id}
          onChange={(e) => setForm({ ...form, order_id: e.target.value })}
          placeholder="Order ID"
          className="border p-2 rounded"
          inputMode="numeric"
        />
        <input
          value={form.value_rs}
          onChange={(e) => setForm({ ...form, value_rs: e.target.value })}
          placeholder="Value (Rs)"
          className="border p-2 rounded"
          inputMode="numeric"
        />
        <select
          value={form.route}
          onChange={(e) => setForm({ ...form, route: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">Select Route</option>
          {routesQ.data?.map((r) => (
            <option key={r.id} value={r.id}>
              {r.route_id ?? r.id} {/* show business route_id if present */}
            </option>
          ))}
        </select>
        <input
          value={form.delivery_time_min}
          onChange={(e) => setForm({ ...form, delivery_time_min: e.target.value })}
          placeholder="Delivery Time (min)"
          className="border p-2 rounded"
          inputMode="numeric"
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded col-span-4 disabled:opacity-60"
          disabled={createOrder.isPending}
        >
          {createOrder.isPending ? "Adding…" : "Add Order"}
        </button>
      </form>

      <DataTable
        columns={["id", "order_id", "value_rs", "route", "delivery_time_min"]}
        data={rows}
        onDelete={handleDelete}
      />
    </div>
  );
}
