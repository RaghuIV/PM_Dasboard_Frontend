import { useState, useMemo } from "react";
import { ShoppingCart, Plus, Trash2, DollarSign, MapPin, Clock, Package, AlertCircle, Loader2 } from "lucide-react";

// Mock DataTable component for demonstration
const DataTable = ({ columns, data, onDelete }) => (
  <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="text-left px-6 py-3 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                {col.replace(/_/g, ' ')}
              </th>
            ))}
            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr key={row.id || index} className="hover:bg-gray-50">
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="px-6 py-4 text-sm text-gray-900">
                  {col === 'value_rs' ? (
                    <span className="font-medium text-green-600">₹{row[col]}</span>
                  ) : col === 'delivery_time_min' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      <Clock className="w-3 h-3" />
                      {row[col]} min
                    </span>
                  ) : col === 'route' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                      <MapPin className="w-3 h-3" />
                      Route {row[col]}
                    </span>
                  ) : col === 'order_id' ? (
                    <span className="font-mono font-medium">#{row[col]}</span>
                  ) : (
                    row[col]
                  )}
                </td>
              ))}
              <td className="px-6 py-4">
                <button
                  onClick={() => onDelete(row)}
                  className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  title="Delete order"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    {data.length === 0 && (
      <div className="text-center py-8 text-gray-500">
        <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>No orders found</p>
      </div>
    )}
  </div>
);

function selectList(data) {
  return Array.isArray(data) ? data : data?.results || [];
}

export default function Orders() {
  const [form, setForm] = useState({
    order_id: "",
    value_rs: "",
    route: "",
    delivery_time_min: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  // Mock data for demonstration
  const mockOrders = [
    { id: 1, order_id: 1001, value_rs: 2500, route: "R001", delivery_time_min: 45 },
    { id: 2, order_id: 1002, value_rs: 1800, route: "R002", delivery_time_min: 30 },
    { id: 3, order_id: 1003, value_rs: 3200, route: "R001", delivery_time_min: 60 },
  ];

  const mockRoutes = [
    { id: 1, route_id: "R001" },
    { id: 2, route_id: "R002" },
    { id: 3, route_id: "R003" },
  ];

  const rows = useMemo(() => {
    return mockOrders.map((o) => {
      const r = o.route;
      const routeLabel = typeof r === "object" && r !== null
        ? (r.route_id ?? r.id ?? "")
        : r ?? "";
      return { ...o, route: routeLabel };
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      const payload = {
        order_id: Number(form.order_id),
        value_rs: Number(form.value_rs),
        route: Number(form.route),
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

      setIsCreating(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setForm({ order_id: "", value_rs: "", route: "", delivery_time_min: "" });
    } catch (err) {
      setError(err?.message || "Could not add order");
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (row) => {
    if (!row?.id) return;
    if (!confirm(`Delete order #${row.order_id}?`)) return;
    
    try {
      // Simulate delete API call
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log("Deleted order:", row.id);
    } catch (err) {
      alert("Delete failed");
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-blue-600" />
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error && !rows.length) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-red-800 mb-2">Failed to load orders</h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          </div>
          <p className="text-gray-600">Create and manage delivery orders for your routes</p>
        </div>

        {/* Add Order Form */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-green-600" />
            Add New Order
          </h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Package className="w-4 h-4 inline mr-1" />
                Order ID
              </label>
              <input
                value={form.order_id}
                onChange={(e) => setForm({ ...form, order_id: e.target.value })}
                placeholder="Enter order ID"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                inputMode="numeric"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Value (₹)
              </label>
              <input
                value={form.value_rs}
                onChange={(e) => setForm({ ...form, value_rs: e.target.value })}
                placeholder="Order value"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                inputMode="numeric"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Route
              </label>
              <select
                value={form.route}
                onChange={(e) => setForm({ ...form, route: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white"
              >
                <option value="">Select Route</option>
                {mockRoutes?.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.route_id ?? r.id}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Delivery Time (min)
              </label>
              <input
                value={form.delivery_time_min}
                onChange={(e) => setForm({ ...form, delivery_time_min: e.target.value })}
                placeholder="Minutes"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                inputMode="numeric"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            disabled={isCreating}
          >
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Adding Order...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add Order
              </>
            )}
          </button>
        </div>

        {/* Orders Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Order List</h2>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                {rows.length} order{rows.length !== 1 ? 's' : ''} total
              </div>
              <div className="text-sm font-medium text-green-600">
                Total Value: ₹{rows.reduce((sum, order) => sum + order.value_rs, 0).toLocaleString()}
              </div>
            </div>
          </div>

          <DataTable
            columns={["id", "order_id", "value_rs", "route", "delivery_time_min"]}
            data={rows}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}