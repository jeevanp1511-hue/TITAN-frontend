import React, { useState, useEffect, useCallback } from 'react';
import { networkService } from '../services/networkService.js';
import { allocationService } from '../services/allocationService.js';
import { useToast } from '../context/ToastContext.jsx';
import { SimulatedBanner } from '../components/common/SimulatedBanner.jsx';
import { Button } from '../components/common/Button.jsx';
import { History, RefreshCw, Clock, CheckCircle2, FileText } from 'lucide-react';

export const AllocationHistoryPage = () => {
  const { addToast } = useToast();
  const [networks, setNetworks] = useState([]);
  const [selectedNetworkId, setSelectedNetworkId] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async (networkId) => {
    if (!networkId) return;
    setLoading(true);
    try {
      const data = await allocationService.getAllocationHistory(networkId);
      setHistory(data);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    const init = async () => {
      try {
        const netList = await networkService.getNetworks();
        setNetworks(netList);
        if (netList.length > 0) {
          setSelectedNetworkId(netList[0]._id);
          await fetchHistory(netList[0]._id);
        } else {
          setLoading(false);
        }
      } catch (err) {
        addToast(err.message, 'error');
        setLoading(false);
      }
    };
    init();
  }, [addToast, fetchHistory]);

  return (
    <div className="space-y-6">
      <SimulatedBanner />

      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#1f293d] gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <History className="w-6 h-6 text-teal-400" />
            Allocation Audit History
          </h1>
          <p className="text-xs text-slate-400">
            Immutable longitudinal record of allocation runs, policy changes, and capacity events
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {networks.length > 0 && (
            <select
              value={selectedNetworkId}
              onChange={(e) => {
                setSelectedNetworkId(e.target.value);
                fetchHistory(e.target.value);
              }}
              className="bg-slate-900 border border-slate-700 text-xs font-medium text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-teal-500"
            >
              {networks.map((n) => (
                <option key={n._id} value={n._id}>
                  {n.name}
                </option>
              ))}
            </select>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchHistory(selectedNetworkId)}
            icon={RefreshCw}
          >
            Refresh
          </Button>
        </div>
      </div>

      <div className="titan-card p-5 space-y-4">
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            Loading allocation history log...
          </div>
        ) : history.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            No allocation events recorded yet for this network.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Trigger Event</th>
                  <th className="p-3">Policy</th>
                  <th className="p-3">Allocated Mbps</th>
                  <th className="p-3">Remaining Usable</th>
                  <th className="p-3">Unmet Demand</th>
                  <th className="p-3">Active Requests</th>
                  <th className="p-3">Audit Summary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {history.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3 font-mono text-slate-400">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-800 text-slate-300 border border-slate-700">
                        {item.eventType}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-teal-400">
                      {item.policy}
                    </td>
                    <td className="p-3 font-mono text-slate-200">
                      {item.totalAllocatedMbps} / {item.usableCapacityMbps} Mbps
                    </td>
                    <td className="p-3 font-mono text-slate-300">
                      {item.remainingCapacityMbps} Mbps
                    </td>
                    <td className="p-3 font-mono text-rose-400">
                      {item.unmetDemandMbps || 0} Mbps
                    </td>
                    <td className="p-3 font-mono text-slate-300">
                      {item.activeRequestCount || 0}
                    </td>
                    <td className="p-3 text-[11px] text-slate-400 max-w-xs truncate" title={item.summaryNote}>
                      {item.summaryNote}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
