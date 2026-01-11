import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { MonthlySalesData } from '../../types';

interface SalesChartProps {
  data: MonthlySalesData[];
}

const SalesChart = ({ data }: SalesChartProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Monthly Sales vs. Purchases</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip
            formatter={(value: number | undefined) => value ? `$${value.toLocaleString()}` : '$0'}
            contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
          />
          <Legend />
          <Bar dataKey="sales" fill="#10b981" name="Sales Revenue" radius={[8, 8, 0, 0]} />
          <Bar dataKey="purchases" fill="#3b82f6" name="Purchases" radius={[8, 8, 0, 0]} />
          <Bar dataKey="profit" fill="#8b5cf6" name="Profit" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
