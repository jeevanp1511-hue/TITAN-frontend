import React, { useState, useEffect, useCallback } from 'react';
import { networkService } from '../services/networkService.js';
import { requestService } from '../services/requestService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { SimulatedBanner } from '../components/common/SimulatedBanner.jsx';
import { StatusBadge, PriorityBadge } from '../components/common/Badge.jsx';
import { Button } from '../components/common/Button.jsx';
import { BandwidthRequestModal } from '../components/forms/BandwidthRequestModal.jsx';
import { Activity, Send, Filter, RefreshCw, XCircle } from 'lucide-react';

export const BandwidthRequestsPage = () => {
  const { user, isAdmin } = useAuth();
  const { addToast } = useToast();

  const [networks, setNetworks] = useState([]);
  const [selectedNetworkId, setSelectedNetworkId] = useState('');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchRequests = useCallback(async (networkId) => {
    if (!networkId) return;
    setLoading(true);
    try {
      const data = await requestService.getRequests(networkId);
      setRequests(data);
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
          await fetchRequests(netList[0]._id);
        } else {
          setLoading(false);
        }
      } catch (err) {
        addToast(err.message, 'error');
        setLoading(false);
      }
    };
    init();
  }, [addToast, fetchRequests]);

  const handleCancelRequest = async (requestId) => {
    try {
      await requestService.cancelRequest(requestId);
      addToast('Request cancelled and bandwidth released', 'success');
      fetchRequests(selectedNetworkId);
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (filterPriority !== 'ALL' && r.priority?.toLowerCase() !== filterPriority.toLowerCase()) {
      return false;
    }
    if (filterStatus !== 'ALL' && r.status !== filterStatus) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <SimulatedBanner />

      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#1f293d] gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-teal-400" />
            Bandwidth Allocation Requests
          </h1>
          <p className="text-xs text-slate-400">
            Audit request queues, granted quotas, and automated engine explanations
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {networks.length > 0 && (
            <select
              value={selectedNetworkId}
              onChange={(e) => {
                setSelectedNetworkId(e.target.value);
                fetchRequests(e.target.value);
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

          {selectedNetworkId && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              icon={Send}
            >
              New Request
            </Button>
          )}
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="titan-card p-4 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-900/40">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-semibold text-slate-400 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-teal-400" /> Filters:
          </span>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-300 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Priorities</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-300 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="partially_allocated">Partially Allocated</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => fetchRequests(selectedNetworkId)}
          icon={RefreshCw}
        >
          Refresh
        </Button>
      </div>

      {/* Requests Table */}
      <div className="titan-card p-5 space-y-4">
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            Loading requests for active network...
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            No matching bandwidth requests found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">User / Applicant</th>
                  <th className="p-3">Purpose</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Desired</th>
                  <th className="p-3">Allocated</th>
                  <th className="p-3">Unmet</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Engine Explanation</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filteredRequests.map((req) => (
                  <tr key={req._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3 font-semibold text-slate-200">
                      {req.user?.name || 'Authorized Member'}
                    </td>
                    <td className="p-3 text-slate-300 font-medium">{req.reason || 'General'}</td>
                    <td className="p-3">
                      <PriorityBadge priority={req.priority} />
                    </td>
                    <td className="p-3 font-mono text-slate-200">{req.desiredMbps} Mbps</td>
                    <td className="p-3 font-mono font-bold text-teal-400">
                      {req.allocatedMbps} Mbps
                    </td>
                    <td className="p-3 font-mono text-rose-400">{req.unmetMbps} Mbps</td>
                    <td className="p-3">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="p-3 text-[11px] text-slate-400 max-w-sm truncate" title={req.allocationReason}>
                      {req.allocationReason}
                    </td>
                    <td className="p-3 text-right">
                      {req.status !== 'cancelled' && (req.user?._id === user?._id || isAdmin) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-rose-400 hover:text-rose-300"
                          onClick={() => handleCancelRequest(req._id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedNetworkId && (
        <BandwidthRequestModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          networkId={selectedNetworkId}
          onSubmitted={() => fetchRequests(selectedNetworkId)}
        />
      )}
    </div>
  );
};
