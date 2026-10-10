import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export const PriorityPieChart = ({ distribution = { high: 0, medium: 0, low: 0 } }) => {
  const data = [
    { name: 'High', value: distribution.high || 0, color: '#f43f5e' },
    { name: 'Medium', value: distribution.medium || 0, color: '#f59e0b' },
    { name: 'Low', value: distribution.low || 0, color: '#14b8a6' },
  ].filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-500">
        <p className="text-sm">No priority requests active</p>
      </div>
    );
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="#111827" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#111827',
              borderColor: '#1f293d',
              borderRadius: '8px',
              color: '#f8fafc',
            }}
            formatter={(value, name) => [`${value} Requests`, `${name} Priority`]}
          />
          <Legend
            wrapperStyle={{ paddingTop: '10px' }}
            formatter={(value) => <span className="text-xs text-slate-300">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
