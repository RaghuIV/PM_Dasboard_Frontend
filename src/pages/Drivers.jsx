import { useState, useMemo } from "react";
import { Users, Plus, Trash2, Clock, Calendar, User, AlertCircle, Loader2 } from "lucide-react";

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
                  {col === 'past_week_hours' ? (
                    <div className="flex gap-1">
                      {row[col].split('|').map((hour, i) => (
                        <span key={i} className={`px-2 py-1 rounded text-xs font-medium ${
                          parseInt(hour) === 0 ? 'bg-gray-100 text-gray-600' : 
                          parseInt(hour) >= 8 ? 'bg-green-100 text-green-700' : 
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {hour}h
                        </span>
                      ))}
                    </div>
                  ) : (
                    row[col]
                  )}
                </td>
              ))}
              <td className="px-6 py-4">
                <button
                  onClick={() => onDelete(row)}
                  className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  title="Delete driver"
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
        <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>No drivers found</p>
      </div>
    )}
  </div>
);

function parsePastWeek(input) {
  const clean = String(input).trim();
  if (!clean) return [];
  const nums = clean.split("|").map(s => Number(s.trim()));
  if (nums.some(n => Number.isNaN(n) || n < 0)) throw new Error("Past week hours must be non-negative numbers separated by |");
  return nums;
}

export default function Drivers() {
  const [form, setForm] = useState({ name: "", shift_hours: "", past_week_hours: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  // Mock data for demonstration
  const mockDrivers = [
    { id: 1, name: "John Doe", shift_hours: 8, past_week_hours: "8|9|7|8|8|0|0" },
    { id: 2, name: "Jane Smith", shift_hours: 10, past_week_hours: "10|8|9|8|7|6|0" },
    { id: 3, name: "Mike Johnson", shift_hours: 8, past_week_hours: "8|8|8|0|8|8|4" },
  ];

  const rows = useMemo(() => {
    return mockDrivers.map(d => ({
      ...d,
      past_week_hours: Array.isArray(d.past_week_hours)
        ? d.past_week_hours.join("|")
        : d.past_week_hours ?? "",
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      const payload = {
        name: form.name.trim(),
        shift_hours: Number(form.shift_hours),
        past_week_hours: parsePastWeek(form.past_week_hours),
      };
      
      if (!payload.name) throw new Error("Name is required");
      if (!Number.isFinite(payload.shift_hours) || payload.shift_hours <= 0)
        throw new Error("Shift hours must be a positive number");

      setIsCreating(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setForm({ name: "", shift_hours: "", past_week_hours: "" });
    } catch (err) {
      setError(err?.message || "Could not add driver");
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (row) => {
    if (!row?.id) return;
    if (!confirm(`Delete driver "${row.name}"?`)) return;
    
    try {
      // Simulate delete API call
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log("Deleted driver:", row.id);
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
          <p className="text-gray-600">Loading drivers...</p>
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
            <h2 className="text-lg font-semibold text-red-800 mb-2">Failed to load drivers</h2>
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
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Driver Management</h1>
          </div>
          <p className="text-gray-600">Manage your driver roster and track their work schedules</p>
        </div>

        {/* Add Driver Form */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-green-600" />
            Add New Driver
          </h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Driver Name
              </label>
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Enter driver name"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Shift Hours
              </label>
              <input
                type="number"
                min={1}
                max={24}
                value={form.shift_hours}
                onChange={e => setForm({ ...form, shift_hours: e.target.value })}
                placeholder="8"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Past Week Hours
              </label>
              <input
                value={form.past_week_hours}
                onChange={e => setForm({ ...form, past_week_hours: e.target.value })}
                placeholder="8|9|7|8|8|0|0"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
              <p className="text-xs text-gray-500 mt-1">Format: Mon|Tue|Wed|Thu|Fri|Sat|Sun</p>
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
                Adding Driver...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add Driver
              </>
            )}
          </button>
        </div>

        {/* Drivers Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Current Drivers</h2>
            <div className="text-sm text-gray-600">
              {rows.length} driver{rows.length !== 1 ? 's' : ''} total
            </div>
          </div>

          <DataTable
            columns={["id", "name", "shift_hours", "past_week_hours"]}
            data={rows}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}