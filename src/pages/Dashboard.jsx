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
    select: pickLatest, // grab the most recent item
    refetchOnWindowFocus: false,
    staleTime: 15_000, // 15s cache
    retry: 1,
  });

  // Optional: quick-run a simulation from dashboard if none exist yet
  const runSim = useMutation({
    mutationFn: (payload) => api.post("/api/simulations/run/", payload).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/simulations/"] }),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 font-medium">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    console.error(error?.response?.data || error);
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.332 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-red-800">Failed to load dashboard</h2>
                <p className="text-red-600">There was an error loading your dashboard data.</p>
              </div>
            </div>
            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-red-700 hover:text-red-800 font-medium">
                View error details
              </summary>
              <pre className="text-xs mt-2 bg-red-50 p-3 rounded-lg border border-red-200 overflow-auto">
                {JSON.stringify(error?.response?.data || {}, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome to your logistics management dashboard</p>
          </div>

          {/* Empty State */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No simulations found</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Get started by running your first simulation to see analytics and insights on this dashboard.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/simulation" 
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Go to Simulation
              </Link>
              
              <button
                className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={runSim.isPending}
                onClick={() =>
                  runSim.mutate({ 
                    available_drivers: 3, 
                    route_start_time: "09:00", 
                    max_hours_per_driver: 8 
                  })
                }
              >
                {runSim.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Running...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Quick Run
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const kpis = data.kpis || { total_profit: 0, efficiency: 0, on_time: 0, late: 0 };
  const fuel = data.totals?.fuel_by_traffic || { Low: 0, Medium: 0, High: 0 };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">
              Last simulation ran {data.ran_at ? new Date(data.ran_at).toLocaleString() : 'recently'}
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link 
              to="/simulation"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Simulation
            </Link>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <KpiCard title="Total Profit" value={`₹${kpis.total_profit}`} />
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <KpiCard title="Efficiency" value={`${kpis.efficiency}%`} />
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <KpiCard title="On Time" value={kpis.on_time} />
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <KpiCard title="Late Deliveries" value={kpis.late} />
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* On Time vs Late Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delivery Performance</h3>
            </div>
            <ChartOnTimeLate onTime={kpis.on_time} late={kpis.late} />
          </div>

          {/* Fuel Breakdown Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Fuel Usage by Traffic</h3>
            </div>
            <ChartFuelBreakdown data={fuel} />
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-blue-900 mb-2">Simulation Summary</h4>
              <p className="text-blue-700 leading-relaxed">
                This dashboard shows the results from your most recent logistics simulation. 
                Data is automatically refreshed every 15 seconds to show the latest insights.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}