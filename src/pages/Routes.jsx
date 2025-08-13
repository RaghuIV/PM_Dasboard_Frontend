import { useEffect, useState } from "react";
import { Route, Plus, Trash2, MapPin, Navigation, Clock, Activity, AlertCircle, Loader2 } from "lucide-react";

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
                  {col === 'distance_km' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      <Navigation className="w-3 h-3" />
                      {row[col]} km
                    </span>
                  ) : col === 'base_time_min' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      <Clock className="w-3 h-3" />
                      {row[col]} min
                    </span>
                  ) : col === 'traffic_level' ? (
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      row[col] === 'Low' ? 'bg-green-100 text-green-700' :
                      row[col] === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      <Activity className="w-3 h-3" />
                      {row[col]}
                    </span>
                  ) : col === 'route_id' ? (
                    <span className="font-mono font-medium">{row[col]}</span>
                  ) : (
                    row[col]
                  )}
                </td>
              ))}
              <td className="px-6 py-4">
                <button
                  onClick={() => onDelete(row)}
                  className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  title="Delete route"
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
        <Route className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>No routes found</p>
      </div>
    )}
  </div>
);

export default function RoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [form, setForm] = useState({ 
    route_id: "", 
    distance_km: "", 
    traffic_level: "Low", 
    base_time_min: "" 
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  // Mock data for demonstration
  const mockRoutes = [
    { id: 1, route_id: "R001", distance_km: 25, traffic_level: "Low", base_time_min: 45 },
    { id: 2, route_id: "R002", distance_km: 18, traffic_level: "Medium", base_time_min: 35 },
    { id: 3, route_id: "R003", distance_km: 32, traffic_level: "High", base_time_min: 65 },
    { id: 4, route_id: "R004", distance_km: 15, traffic_level: "Low", base_time_min: 25 },
  ];

  const fetchRoutes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRoutes(mockRoutes);
    } catch (err) {
      setError("Failed to load routes");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!form.route_id.trim()) {
      setError("Route ID is required");
      return;
    }
    if (!form.distance_km || Number(form.distance_km) <= 0) {
      setError("Distance must be a positive number");
      return;
    }
    if (!form.base_time_min || Number(form.base_time_min) <= 0) {
      setError("Base time must be a positive number");
      return;
    }

    setIsCreating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setForm({ route_id: "", distance_km: "", traffic_level: "Low", base_time_min: "" });
      fetchRoutes();
    } catch (err) {
      setError("Failed to add route");
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (row) => {
    if (!confirm(`Delete route ${row.route_id}?`)) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log("Deleted route:", row.id);
      fetchRoutes();
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
          <p className="text-gray-600">Loading routes...</p>
        </div>
      </div>
    );
  }

  if (error && !routes.length) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-red-800 mb-2">Failed to load routes</h2>
            <p className="text-red-600">{error}</p>
            <button 
              onClick={fetchRoutes}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate route statistics
  const routeStats = {
    total: routes.length,
    totalDistance: routes.reduce((sum, route) => sum + route.distance_km, 0),
    avgTime: routes.length > 0 ? Math.round(routes.reduce((sum, route) => sum + route.base_time_min, 0) / routes.length) : 0,
    trafficBreakdown: {
      Low: routes.filter(r => r.traffic_level === 'Low').length,
      Medium: routes.filter(r => r.traffic_level === 'Medium').length,
      High: routes.filter(r => r.traffic_level === 'High').length,
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Route className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Route Management</h1>
          </div>
          <p className="text-gray-600">Configure and manage delivery routes with traffic and timing information</p>
        </div>

        {/* Route Statistics */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Routes</p>
                <p className="text-2xl font-bold text-blue-600">{routeStats.total}</p>
              </div>
              <Route className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Distance</p>
                <p className="text-2xl font-bold text-green-600">{routeStats.totalDistance} km</p>
              </div>
              <Navigation className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Time</p>
                <p className="text-2xl font-bold text-purple-600">{routeStats.avgTime} min</p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Traffic Levels</p>
                <div className="flex gap-1 mt-1">
                  <span className="text-xs bg-green-100 text-green-700 px-1 rounded">{routeStats.trafficBreakdown.Low}L</span>
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-1 rounded">{routeStats.trafficBreakdown.Medium}M</span>
                  <span className="text-xs bg-red-100 text-red-700 px-1 rounded">{routeStats.trafficBreakdown.High}H</span>
                </div>
              </div>
              <Activity className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Add Route Form */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-green-600" />
            Add New Route
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
                <MapPin className="w-4 h-4 inline mr-1" />
                Route ID
              </label>
              <input
                value={form.route_id}
                onChange={e => setForm({...form, route_id: e.target.value})}
                placeholder="e.g., R001"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Navigation className="w-4 h-4 inline mr-1" />
                Distance (km)
              </label>
              <input
                value={form.distance_km}
                onChange={e => setForm({...form, distance_km: e.target.value})}
                placeholder="Distance in km"
                type="number"
                min="0"
                step="0.1"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Activity className="w-4 h-4 inline mr-1" />
                Traffic Level
              </label>
              <select
                value={form.traffic_level}
                onChange={e => setForm({...form, traffic_level: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Base Time (min)
              </label>
              <input
                value={form.base_time_min}
                onChange={e => setForm({...form, base_time_min: e.target.value})}
                placeholder="Time in minutes"
                type="number"
                min="1"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
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
                Adding Route...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add Route
              </>
            )}
          </button>
        </div>

        {/* Routes Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Route List</h2>
            <div className="text-sm text-gray-600">
              {routes.length} route{routes.length !== 1 ? 's' : ''} configured
            </div>
          </div>

          <DataTable
            columns={["id", "route_id", "distance_km", "traffic_level", "base_time_min"]}
            data={routes}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}