import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

export default function ChartOnTimeLate({ onTime, late }) {
  const data = [{ name: "Deliveries", OnTime: onTime, Late: late }];
  return (
    <BarChart width={400} height={250} data={data}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="OnTime" fill="#4caf50" />
      <Bar dataKey="Late" fill="#f44336" />
    </BarChart>
  );
}
