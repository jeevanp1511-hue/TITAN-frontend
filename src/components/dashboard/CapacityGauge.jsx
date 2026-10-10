import React from 'react';

export const CapacityGauge = ({
  totalCapacityMbps = 100,
  reservedBandwidthMbps = 10,
  usableCapacityMbps = 90,
  allocatedMbps = 0,
  remainingMbps = 90,
}) => {
  const allocatedPct = totalCapacityMbps > 0 ? (allocatedMbps / totalCapacityMbps) * 100 : 0;
  const reservedPct = totalCapacityMbps > 0 ? (reservedBandwidthMbps / totalCapacityMbps) * 100 : 0;
  const remainingPct = totalCapacityMbps > 0 ? (remainingMbps / totalCapacityMbps) * 100 : 0;

  return (
    <div className="titan-card p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-2">
        <div>
          <h4 className="text-base font-semibold text-slate-100">Capacity Distribution Breakdown</h4>
          <p className="text-xs text-slate-400">Total physical uplink vs system reserve and active software allocations</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono text-slate-400">Total Uplink: </span>
          <span className="text-sm font-bold text-white font-mono">{totalCapacityMbps} Mbps</span>
        </div>
      </div>

      {/* Segmented Visual Bar */}
      <div className="mt-5">
        <div className="h-4 w-full bg-slate-900 rounded-full overflow-hidden flex shadow-inner border border-slate-800">
          {/* Allocated to Users */}
          <div
            style={{ width: `${Math.min(100, allocatedPct)}%` }}
            className="bg-teal-500 h-full transition-all duration-500 relative group"
            title={`Allocated: ${allocatedMbps} Mbps`}
          />
          {/* Remaining Usable Capacity */}
          <div
            style={{ width: `${Math.min(100, remainingPct)}%` }}
            className="bg-slate-700/60 h-full transition-all duration-500"
            title={`Remaining: ${remainingMbps} Mbps`}
          />
          {/* Reserved Bandwidth */}
          <div
            style={{ width: `${Math.min(100, reservedPct)}%` }}
            className="bg-rose-500/80 h-full transition-all duration-500"
            title={`Emergency Reserve: ${reservedBandwidthMbps} Mbps`}
          />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="flex items-center space-x-2.5">
            <div className="w-3 h-3 rounded-full bg-teal-500 shrink-0" />
            <div>
              <p className="text-[11px] text-slate-400">Active Allocated</p>
              <p className="text-sm font-bold text-slate-100 font-mono">{allocatedMbps} Mbps</p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <div className="w-3 h-3 rounded-full bg-slate-600 shrink-0" />
            <div>
              <p className="text-[11px] text-slate-400">Remaining Usable</p>
              <p className="text-sm font-bold text-slate-100 font-mono">{remainingMbps} Mbps</p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <div className="w-3 h-3 rounded-full bg-rose-500 shrink-0" />
            <div>
              <p className="text-[11px] text-slate-400">Reserved Reserve</p>
              <p className="text-sm font-bold text-rose-300 font-mono">{reservedBandwidthMbps} Mbps</p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <div className="w-3 h-3 rounded-full bg-cyan-400 shrink-0" />
            <div>
              <p className="text-[11px] text-slate-400">Usable Budget</p>
              <p className="text-sm font-bold text-cyan-300 font-mono">{usableCapacityMbps} Mbps</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
