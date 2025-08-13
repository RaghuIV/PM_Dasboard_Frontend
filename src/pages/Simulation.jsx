import { useState } from "react";
import { Truck, Clock, Users, BarChart3, TrendingUp, Fuel } from "lucide-react";

// Mock components for demonstration
const ChartOnTimeLate = ({ onTime, late }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border">
    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
      <Clock className="w-4 h-4" />
      On-Time Performance
    </h3>
    <div className="flex gap-4">
      <div className="flex-1 bg-green-50 p-3 rounded-lg border border-green-200">
        <div className="text-2xl font-bold text-green-600">{onTime}</div>
        <div className="text-sm text-green-700">On Time</div>
      </div>
      <div className="flex-1 bg-red-50 p-3 rounded-lg border border-red-200">
        <div className="text-2xl font-bold text-red-600">{late}</div>
        <div className="text-sm text-red-700">Late</div>
      </div>
    </div>
  </div>
);

const ChartFuelBreakdown = ({ data }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border">
    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
      <Fuel className="w-4 h-4" />
      Fuel Breakdown by Traffic
    </h3>
    <div className="space-y-2">
      {data.map((item, index) => (
        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
          <span className="capitalize text-gray-700">{item.traffic}</span>
          <span className="font-semibold text-blue-600">{item.value}L</span>
        </div>
      ))}
    </div>
  </div>
);

export default function Simulation() {
  const [form, setForm] = useState({
    available_drivers: 3,
    route_start_time: "09:00",
    max_hours_per_driver: 8,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

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
      // Simulated API response for demo
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockData = {
        kpis: {
          total_profit: "25,340",
          efficiency: 87,
          on_time: 45,
          late: 5
        },
        totals: {
          fuel_by_traffic: {
            light: 120,
            medium: 85,
            heavy: 45
          }
        }
      };
      setResult(mockData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Safeguards
  const kpis = result?.kpis || null;
  const fuel = result?.totals?.fuel_by_traffic || null;
  const fuelRows = fuel
    ? Object.entries(fuel).map(([traffic, value]) => ({ traffic, value }))
    : [];

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Route Simulation</h1>
          </div>
          <p className="text-gray-600">Configure your simulation parameters and analyze the results</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                Simulation Parameters
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    Available Drivers
                  </label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={form.available_drivers}
                    onChange={e => setForm({ ...form, available_drivers: +e.target.value })}
                    placeholder="Number of drivers"
                    min={1}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Route Start Time
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={form.route_start_time}
                    onChange={e => setForm({ ...form, route_start_time: e.target.value })}
                    placeholder="HH:MM (24-hour format)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Format: 09:00, 14:30, etc.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    Max Hours Per Driver
                  </label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={form.max_hours_per_driver}
                    onChange={e => setForm({ ...form, max_hours_per_driver: +e.target.value })}
                    placeholder="Maximum working hours"
                    min={1}
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Running Simulation...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-4 h-4" />
                      Run Simulation
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {kpis ? (
              <div className="space-y-6">
                {/* KPI Cards */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm font-medium">Total Profit</p>
                        <p className="text-3xl font-bold">₹{kpis.total_profit}</p>
                      </div>
                      <div className="p-3 bg-white/20 rounded-lg">
                        <TrendingUp className="w-8 h-8" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm font-medium">Efficiency</p>
                        <p className="text-3xl font-bold">{kpis.efficiency}%</p>
                      </div>
                      <div className="p-3 bg-white/20 rounded-lg">
                        <BarChart3 className="w-8 h-8" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid md:grid-cols-2 gap-6">
                  <ChartOnTimeLate onTime={kpis.on_time} late={kpis.late} />
                  <ChartFuelBreakdown data={fuelRows} />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <BarChart3 className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Simulation Results</h3>
                <p className="text-gray-600">Configure your parameters and run a simulation to see the results here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}