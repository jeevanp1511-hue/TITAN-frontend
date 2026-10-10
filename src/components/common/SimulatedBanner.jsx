import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';

export const SimulatedBanner = () => {
  return (
    <div className="bg-teal-950/40 border border-teal-500/30 rounded-lg p-3 text-xs text-teal-300 flex items-center justify-between mb-6">
      <div className="flex items-center space-x-2.5">
        <Info className="w-4 h-4 text-teal-400 shrink-0" />
        <span>
          <strong className="font-semibold text-teal-200">Software Policy Allocation:</strong> Telemetry values reflect policy-allocated Mbps calculated by the TITAN allocation engine. Hardware network gateway (QoS/TC) integration is scheduled for physical production deployment.
        </span>
      </div>
      <span className="hidden md:inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-teal-500/20 text-teal-300 rounded border border-teal-500/30">
        PS-32 Compliant
      </span>
    </div>
  );
};
