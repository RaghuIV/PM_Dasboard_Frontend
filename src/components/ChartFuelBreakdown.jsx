import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function ChartFuelBreakdown({ data }) {
  const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));
  const COLORS = ["#4caf50", "#ff9800", "#f44336"];

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="mb-3 font-bold">Fuel Cost Breakdown</h3>
      <PieChart width={400} height={250}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
