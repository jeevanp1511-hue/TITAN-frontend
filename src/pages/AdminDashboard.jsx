import React, { useState, useEffect, useCallback } from 'react';
import { allocationService } from '../services/allocationService.js';
import { networkService } from '../services/networkService.js';
import { requestService } from '../services/requestService.js';
import { useSocket } from '../hooks/useSocket.js';
import { useToast } from '../context/ToastContext.jsx';
import { SimulatedBanner } from '../components/common/SimulatedBanner.jsx';
import { StatCard } from '../components/dashboard/StatCard.jsx';
import { CapacityGauge } from '../components/dashboard/CapacityGauge.jsx';
import { BandwidthAllocationChart } from '../components/charts/BandwidthAllocationChart.jsx';
import { PriorityPieChart } from '../components/charts/PriorityPieChart.jsx';
import { PolicyComparisonModal } from '../components/dashboard/PolicyComparisonModal.jsx';
import { CreateNetworkModal } from '../components/forms/CreateNetworkModal.jsx';
import { StatusBadge, PriorityBadge } from '../components/common/Badge.jsx';
import { Button } from '../components/common/Button.jsx';
import {
  Activity,
  Layers,
  Users,
  Wifi,
  Scale,
  RefreshCw,
  Plus,
  Play,
  Pause,
  KeyRound,
  Sliders,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export const AdminDashboard = () => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [networks, setNetworks] = useState([]);
  const [selectedNetworkId, setSelectedNetworkId] = useState('');
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch admin networks and dashboard stats
  const fetchDashboard = useCallback(async (networkId) => {
    try {
      const netList = await networkService.getNetworks();
      setNetworks(netList);

      const targetNetId = networkId || (netList.length > 0 ? netList[0]._id : '');
      setSelectedNetworkId(targetNetId);

      if (targetNetId) {
        const data = await allocationService.getAdminDashboard(targetNetId);
        setDashboardData(data);
      } else {
        setDashboardData({ hasNetwork: false });
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchDashboard(selectedNetworkId);
  }, [fetchDashboard]);

  // Real-time socket updates for active network
  useSocket({
    networkId: selectedNetworkId,
    onAllocationUpdate: (event) => {
      addToast(`Realtime Update: Allocation updated for network via ${event.policy}`, 'info');
      // Refetch latest telemetry
      fetchDashboard(selectedNetworkId);
    },
  });

  // Switch policy handler
  const handlePolicyChange = async (newPolicy) => {
    if (!selectedNetworkId) return;
    setActionLoading(true);
    try {
      await networkService.updateNetwork(selectedNetworkId, { allocationPolicy: newPolicy });
      addToast(`Allocation policy switched to ${newPolicy}`, 'success');
      await fetchDashboard(selectedNetworkId);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle request pause
  const handleTogglePause = async () => {
    if (!dashboardData?.network) return;
    setActionLoading(true);
    try {
      const newState = !dashboardData.network.isRequestsPaused;
      await networkService.updateNetwork(selectedNetworkId, { isRequestsPaused: newState });
      addToast(newState ? 'New requests are now paused' : 'New requests resumed', 'info');
      await fetchDashboard(selectedNetworkId);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Manually force run allocation
  const handleManualRun = async () => {
    if (!selectedNetworkId) return;
    setActionLoading(true);
    try {
      await allocationService.triggerRecalculation(selectedNetworkId, dashboardData.network.allocationPolicy);
      addToast('Bandwidth allocation recalculation executed successfully!', 'success');
      await fetchDashboard(selectedNetworkId);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Cancel request from admin
  const handleCancelRequest = async (requestId) => {
    try {
      await requestService.cancelRequest(requestId);
      addToast('Request cancelled and bandwidth released', 'success');
      await fetchDashboard(selectedNetworkId);
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm text-slate-400">Loading network telemetry...</p>
      </div>
    );
  }

  const { network, stats, requests = [], activeRun, recentHistory = [] } = dashboardData || {};

  return (
    <div className="space-y-6">
      {/* Top Banner & Network Selector Bar */}
      <SimulatedBanner />

      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#1f293d] gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-teal-400" />
            Network Administrator Console
          </h1>
          <p className="text-xs text-slate-400">
            Real-time policy configuration, QoS allocation orchestration, and capacity telemetry
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {networks.length > 0 && (
            <select
              value={selectedNetworkId}
              onChange={(e) => {
                setSelectedNetworkId(e.target.value);
                fetchDashboard(e.target.value);
              }}
              className="bg-slate-900 border border-slate-700 text-xs font-medium text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-teal-500"
            >
              {networks.map((n) => (
                <option key={n._id} value={n._id}>
                  {n.name} ({n.totalCapacityMbps} Mbps)
                </option>
              ))}
            </select>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCompareOpen(true)}
            icon={Scale}
          >
            Policy Comparison
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            icon={Plus}
          >
            New Network
          </Button>
        </div>
      </div>

      {!dashboardData?.hasNetwork ? (
        <div className="titan-card p-12 text-center space-y-4">
          <Wifi className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Networks Configured</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Create your first network gateway to start allocating bandwidth and onboarding users.
          </p>
          <Button variant="primary" onClick={() => setIsCreateOpen(true)} icon={Plus}>
            Create First Network
          </Button>
        </div>
      ) : (
        <>
          {/* Network Header Quick Info */}
          <div className="titan-card p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-slate-900/60">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white">{network.name}</span>
                <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                  Code: <strong className="text-teal-400">{network.invitationCode}</strong>
                </span>
                {network.isRequestsPaused && (
                  <span className="text-xs bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded border border-rose-500/30">
                    Requests Paused
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">{network.description || 'Shared bandwidth domain'}</p>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={network.allocationPolicy}
                disabled={actionLoading}
                onChange={(e) => handlePolicyChange(e.target.value)}
                className="bg-slate-900 border border-teal-500/40 text-xs text-teal-300 rounded-lg px-2.5 py-1.5 font-semibold focus:outline-none"
              >
                <option value="ADAPTIVE">Policy C: Adaptive Fair</option>
                <option value="PRIORITY">Policy B: Priority</option>
                <option value="FCFS">Policy A: FCFS</option>
              </select>

              <Button
                variant={network.isRequestsPaused ? 'primary' : 'secondary'}
                size="sm"
                onClick={handleTogglePause}
                loading={actionLoading}
                icon={network.isRequestsPaused ? Play : Pause}
              >
                {network.isRequestsPaused ? 'Resume' : 'Pause'}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleManualRun}
                loading={actionLoading}
                icon={RefreshCw}
              >
                Recalculate
              </Button>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Uplink"
              value={network.totalCapacityMbps}
              subtitle={`Reserved: ${network.reservedBandwidthMbps} Mbps`}
              icon={Wifi}
              color="blue"
            />
            <StatCard
              title="Usable Budget"
              value={network.usableCapacityMbps}
              subtitle="Assignable to user requests"
              icon={Layers}
              color="teal"
            />
            <StatCard
              title="Allocated Mbps"
              value={stats.totalAllocatedMbps}
              subtitle={`Remaining: ${stats.remainingCapacityMbps} Mbps`}
              icon={Activity}
              color="emerald"
            />
            <StatCard
              title="Active Members"
              value={stats.memberCount}
              unit="users"
              subtitle={`${stats.requestCount} active requests`}
              icon={Users}
              color="amber"
            />
          </div>

          {/* Capacity Breakdown Gauge */}
          <CapacityGauge
            totalCapacityMbps={network.totalCapacityMbps}
            reservedBandwidthMbps={network.reservedBandwidthMbps}
            usableCapacityMbps={network.usableCapacityMbps}
            allocatedMbps={stats.totalAllocatedMbps}
            remainingMbps={stats.remainingCapacityMbps}
          />

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="titan-card p-5 lg:col-span-2">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="text-sm font-semibold text-slate-200">
                  Per-Request Bandwidth Allocation (Desired vs Allocated)
                </h4>
                <span className="text-[11px] font-mono text-slate-400">Unit: Mbps</span>
              </div>
              <div className="mt-4">
                <BandwidthAllocationChart requests={requests} />
              </div>
            </div>

            <div className="titan-card p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="text-sm font-semibold text-slate-200">Priority Tiers</h4>
                <span className="text-[11px] text-slate-400">Distribution</span>
              </div>
              <div className="mt-4">
                <PriorityPieChart distribution={stats.priorityDistribution} />
              </div>
            </div>
          </div>

          {/* Active Bandwidth Requests Table */}
          <div className="titan-card p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h4 className="text-sm font-semibold text-slate-200">
                  Active Bandwidth Requests ({requests.length})
                </h4>
                <p className="text-xs text-slate-400">
                  Real-time policy statuses and allocation justification
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Unmet Demand: <strong className="text-rose-400">{stats.unmetDemandMbps} Mbps</strong>
              </span>
            </div>

            {requests.length === 0 ? (
              <div className="py-10 text-center text-slate-500 text-xs">
                No active bandwidth requests submitted yet for this network.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3">User</th>
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
                    {requests.map((req) => (
                      <tr key={req._id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-3">
                          <p className="font-semibold text-slate-200">{req.user?.name || 'Member'}</p>
                          <p className="text-[10px] text-slate-500">{req.reason || 'General request'}</p>
                        </td>
                        <td className="p-3">
                          <PriorityBadge priority={req.priority} />
                        </td>
                        <td className="p-3 font-mono font-medium text-slate-200">
                          {req.desiredMbps} Mbps
                        </td>
                        <td className="p-3 font-mono font-bold text-teal-400">
                          {req.allocatedMbps} Mbps
                        </td>
                        <td className="p-3 font-mono font-medium text-rose-400">
                          {req.unmetMbps} Mbps
                        </td>
                        <td className="p-3">
                          <StatusBadge status={req.status} />
                        </td>
                        <td className="p-3 text-[11px] text-slate-400 max-w-xs truncate" title={req.allocationReason}>
                          {req.allocationReason}
                        </td>
                        <td className="p-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-rose-400 hover:text-rose-300"
                            onClick={() => handleCancelRequest(req._id)}
                          >
                            Release
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Policy Comparison Simulation Modal */}
      <PolicyComparisonModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        networkId={selectedNetworkId}
      />

      {/* Create Network Modal */}
      <CreateNetworkModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={(newNet) => {
          fetchDashboard(newNet._id);
        }}
      />
    </div>
  );
};
