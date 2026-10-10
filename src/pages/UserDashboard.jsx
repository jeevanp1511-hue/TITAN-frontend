import React, { useState, useEffect, useCallback } from 'react';
import { allocationService } from '../services/allocationService.js';
import { requestService } from '../services/requestService.js';
import { useSocket } from '../hooks/useSocket.js';
import { useToast } from '../context/ToastContext.jsx';
import { SimulatedBanner } from '../components/common/SimulatedBanner.jsx';
import { StatCard } from '../components/dashboard/StatCard.jsx';
import { StatusBadge, PriorityBadge } from '../components/common/Badge.jsx';
import { Button } from '../components/common/Button.jsx';
import { BandwidthRequestModal } from '../components/forms/BandwidthRequestModal.jsx';
import { JoinNetworkModal } from '../components/forms/JoinNetworkModal.jsx';
import {
  Activity,
  Wifi,
  Send,
  Plus,
  KeyRound,
  Layers,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from 'lucide-react';

export const UserDashboard = () => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [selectedNetworkId, setSelectedNetworkId] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUserDashboard = useCallback(async () => {
    try {
      const data = await allocationService.getUserDashboard();
      setDashboardData(data);
      if (data.joinedNetworks?.length > 0 && !selectedNetworkId) {
        setSelectedNetworkId(data.joinedNetworks[0]._id);
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast, selectedNetworkId]);

  useEffect(() => {
    fetchUserDashboard();
  }, [fetchUserDashboard]);

  // Real-time updates for joined networks
  useSocket({
    networkId: selectedNetworkId,
    onAllocationUpdate: (event) => {
      addToast(`Realtime Update: Bandwidth allocations recalculated via ${event.policy}`, 'info');
      fetchUserDashboard();
    },
  });

  const handleCancelRequest = async (requestId) => {
    setActionLoading(true);
    try {
      await requestService.cancelRequest(requestId);
      addToast('Bandwidth request cancelled', 'success');
      fetchUserDashboard();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm text-slate-400">Loading your network allocations...</p>
      </div>
    );
  }

  const { joinedNetworks = [], myRequests = [], summary = {} } = dashboardData || {};

  return (
    <div className="space-y-6">
      <SimulatedBanner />

      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#1f293d] gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-teal-400" />
            Member Bandwidth Portal
          </h1>
          <p className="text-xs text-slate-400">
            Monitor policy-allocated bandwidth, submit requests, and join networks
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsJoinOpen(true)}
            icon={KeyRound}
          >
            Join Network
          </Button>

          {joinedNetworks.length > 0 && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsRequestOpen(true)}
              icon={Send}
            >
              Request Bandwidth
            </Button>
          )}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Allocated to Me"
          value={summary.totalAllocatedMbps || 0}
          subtitle="Currently active grant"
          icon={Activity}
          color="teal"
        />
        <StatCard
          title="Active Requests"
          value={summary.totalActiveRequests || 0}
          unit="requests"
          subtitle="In queue or approved"
          icon={Layers}
          color="blue"
        />
        <StatCard
          title="Joined Networks"
          value={summary.totalJoinedNetworks || 0}
          unit="networks"
          subtitle="Authorized uplink domains"
          icon={Wifi}
          color="emerald"
        />
      </div>

      {/* Joined Networks Card */}
      <div className="titan-card p-5 space-y-4">
        <h4 className="text-sm font-semibold text-slate-200">Authorized Networks</h4>
        {joinedNetworks.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            You have not joined any networks yet. Use an invitation code to join.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {joinedNetworks.map((net) => (
              <div
                key={net._id}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 hover:border-teal-500/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-200">{net.name}</span>
                  <span className="text-[10px] font-mono bg-teal-500/10 text-teal-300 px-2 py-0.5 rounded border border-teal-500/20 font-semibold">
                    {net.allocationPolicy}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {net.description || 'Shared bandwidth group'}
                </p>
                <div className="pt-2 flex justify-between items-center text-xs font-mono text-slate-400 border-t border-slate-800">
                  <span>Capacity: {net.totalCapacityMbps} Mbps</span>
                  <span className="text-teal-400 font-semibold">
                    Usable: {Math.max(0, net.totalCapacityMbps - net.reservedBandwidthMbps)} Mbps
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Bandwidth Requests Table */}
      <div className="titan-card p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h4 className="text-sm font-semibold text-slate-200">
              My Bandwidth Requests ({myRequests.length})
            </h4>
            <p className="text-xs text-slate-400">
              History of your submitted requests, policy grants, and engine decisions
            </p>
          </div>
        </div>

        {myRequests.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs space-y-3">
            <p>You have not submitted any bandwidth requests yet.</p>
            {joinedNetworks.length > 0 && (
              <Button size="sm" onClick={() => setIsRequestOpen(true)} icon={Send}>
                Submit Request Now
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Network</th>
                  <th className="p-3">Application Intent</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Desired</th>
                  <th className="p-3">Policy Grant</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Engine Explanation</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {myRequests.map((req) => (
                  <tr key={req._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3 font-semibold text-slate-200">
                      {req.network?.name || 'Network'}
                    </td>
                    <td className="p-3 text-slate-300 font-medium">{req.reason || 'General'}</td>
                    <td className="p-3">
                      <PriorityBadge priority={req.priority} />
                    </td>
                    <td className="p-3 font-mono text-slate-300">{req.desiredMbps} Mbps</td>
                    <td className="p-3 font-mono font-bold text-teal-400">
                      {req.allocatedMbps} Mbps
                    </td>
                    <td className="p-3">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="p-3 text-[11px] text-slate-400 max-w-xs truncate" title={req.allocationReason}>
                      {req.allocationReason}
                    </td>
                    <td className="p-3 text-right">
                      {req.status !== 'cancelled' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={actionLoading}
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

      {/* Modals */}
      {joinedNetworks.length > 0 && (
        <BandwidthRequestModal
          isOpen={isRequestOpen}
          onClose={() => setIsRequestOpen(false)}
          networkId={joinedNetworks[0]._id}
          onSubmitted={() => fetchUserDashboard()}
        />
      )}

      <JoinNetworkModal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
        onJoined={() => fetchUserDashboard()}
      />
    </div>
  );
};
