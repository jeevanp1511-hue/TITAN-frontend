import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export const BandwidthAllocationChart = ({ requests = [] }) => {
  const data = requests.map((r, i) => ({
    name: r.userName || (r.user && r.user.name) || `Req #${i + 1}`,
    Desired: r.desiredMbps,
    Allocated: r.allocatedMbps || 0,
    Unmet: r.unmetMbps || Math.max(0, r.desiredMbps - (r.allocatedMbps || 0)),
  }));

  if (data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-500">
        <p className="text-sm">No active allocation data to visualize</p>
      </div>
    );
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" />
          <XAxis
            dataKey="name"
            stroke="#64748b"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            interval={0}
          />
          <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} unit="M" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#111827',
              borderColor: '#1f293d',
              borderRadius: '8px',
              color: '#f8fafc',
            }}
            formatter={(value) => [`${value} Mbps`]}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          <Bar dataKey="Desired" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Desired (Mbps)" />
          <Bar dataKey="Allocated" fill="#14b8a6" radius={[4, 4, 0, 0]} name="Allocated (Mbps)" />
          <Bar dataKey="Unmet" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Unmet (Mbps)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
