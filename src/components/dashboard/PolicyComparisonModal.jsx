import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal.jsx';
import { allocationService } from '../../services/allocationService.js';
import { Button } from '../common/Button.jsx';
import { StatusBadge, PriorityBadge } from '../common/Badge.jsx';
import { ArrowRight, CheckCircle2, AlertTriangle, Scale, RefreshCw } from 'lucide-react';

export const PolicyComparisonModal = ({ isOpen, onClose, networkId }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchComparison = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await allocationService.comparePolicies({ networkId });
      setData(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchComparison();
    }
  }, [isOpen, networkId]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Algorithmic Policy Comparison (Software Simulation)"
      maxWidth="max-w-5xl"
    >
      <div className="space-y-6">
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-slate-100 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-teal-400" />
              Side-by-Side Invariant Simulation
            </p>
            <p className="mt-1 text-slate-400">
              Evaluates identical user demand across <strong>First-Come-First-Served (FCFS)</strong>,{' '}
              <strong>Priority Preemption</strong>, and{' '}
              <strong>Adaptive Fair Sharing (Weighted Water-Filling + Guarantees)</strong>.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchComparison}
            loading={loading}
            icon={RefreshCw}
          >
            Re-simulate
          </Button>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="inline-block w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm text-slate-400">Executing pure allocation engine across policies...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-rose-950/50 border border-rose-500/30 rounded-lg text-rose-300 text-sm">
            {error}
          </div>
        ) : data ? (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['FCFS', 'PRIORITY', 'ADAPTIVE'].map((pKey) => {
                const pol = data.policies[pKey];
                const borderColors = {
                  FCFS: 'border-blue-500/30 bg-blue-950/20',
                  PRIORITY: 'border-amber-500/30 bg-amber-950/20',
                  ADAPTIVE: 'border-teal-500/40 bg-teal-950/30',
                };
                return (
                  <div key={pKey} className={`p-4 rounded-xl border ${borderColors[pKey]}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm tracking-wider text-slate-200">
                        {pKey === 'FCFS' ? 'Policy A: FCFS' : pKey === 'PRIORITY' ? 'Policy B: Priority' : 'Policy C: Adaptive Fair'}
                      </span>
                      {pKey === 'ADAPTIVE' && (
                        <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded font-mono font-semibold">
                          Recommended
                        </span>
                      )}
                    </div>

                    <div className="mt-3 space-y-1.5 text-xs font-mono">
                      <div className="flex justify-between text-slate-400">
                        <span>Total Allocated:</span>
                        <span className="text-slate-100 font-bold">{pol.totalAllocatedMbps} Mbps</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Remaining Usable:</span>
                        <span className="text-slate-100 font-bold">{pol.remainingCapacityMbps} Mbps</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Unmet Demand:</span>
                        <span className="text-rose-400 font-bold">{pol.unmetDemandMbps} Mbps</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3">User / Request</th>
                    <th className="p-3">Priority</th>
                    <th className="p-3">Desired</th>
                    <th className="p-3 text-blue-400">FCFS Granted</th>
                    <th className="p-3 text-amber-400">Priority Granted</th>
                    <th className="p-3 text-teal-400">Adaptive Granted</th>
                    <th className="p-3">Adaptive Explanation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                  {data.policies.ADAPTIVE.requests.map((r, i) => {
                    const fcfsReq = data.policies.FCFS.requests[i] || {};
                    const prioReq = data.policies.PRIORITY.requests[i] || {};

                    return (
                      <tr key={r.id || i} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 font-medium text-slate-200">{r.userName}</td>
                        <td className="p-3">
                          <PriorityBadge priority={r.priority} />
                        </td>
                        <td className="p-3 font-mono text-slate-300">{r.desiredMbps} Mbps</td>
                        <td className="p-3 font-mono text-blue-300 font-bold">
                          {fcfsReq.allocatedMbps} Mbps
                        </td>
                        <td className="p-3 font-mono text-amber-300 font-bold">
                          {prioReq.allocatedMbps} Mbps
                        </td>
                        <td className="p-3 font-mono text-teal-300 font-bold">
                          {r.allocatedMbps} Mbps
                        </td>
                        <td className="p-3 text-[11px] text-slate-400 max-w-xs truncate" title={r.explanation}>
                          {r.explanation}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Trade-off Analysis */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
              <h5 className="font-semibold text-slate-200">Architectural Trade-Off Analysis:</h5>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>
                  <strong className="text-slate-300">FCFS Trade-off:</strong> Highly predictable and fair in time, but oblivious to mission-critical applications (e.g. an exam app submitted 10 seconds late gets completely starved by a bulk video download).
                </li>
                <li>
                  <strong className="text-slate-300">Strict Priority Trade-off:</strong> Guarantees urgent requests get 100% capacity, but low-priority background users can suffer complete starvation indefinitely.
                </li>
                <li>
                  <strong className="text-slate-300">Adaptive Fair Sharing Trade-off:</strong> Provides minimum guarantees to protect critical workloads while using weighted water-filling to distribute remaining headroom and aging to prevent low-tier starvation.
                </li>
              </ul>
            </div>
          </div>
        ) : null}

        <div className="flex justify-end pt-2">
          <Button variant="secondary" onClick={onClose}>
            Close Simulation
          </Button>
        </div>
      </div>
    </Modal>
  );
};
