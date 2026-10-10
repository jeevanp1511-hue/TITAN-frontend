import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { networkService } from '../services/networkService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { SimulatedBanner } from '../components/common/SimulatedBanner.jsx';
import { StatusBadge } from '../components/common/Badge.jsx';
import { Button } from '../components/common/Button.jsx';
import {
  Network,
  Users,
  Copy,
  Settings,
  Shield,
  KeyRound,
  ArrowLeft,
  Check,
} from 'lucide-react';

export const NetworkDetailsPage = () => {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [network, setNetwork] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const netData = await networkService.getNetworkById(id);
        setNetwork(netData);
        const memberList = await networkService.getMembers(id);
        setMembers(memberList);
      } catch (err) {
        addToast(err.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, addToast]);

  const handleCopyCode = () => {
    if (network?.invitationCode) {
      navigator.clipboard.writeText(network.invitationCode);
      setCopied(true);
      addToast('Invitation code copied to clipboard!', 'info');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm text-slate-400">Loading network configuration...</p>
      </div>
    );
  }

  if (!network) {
    return (
      <div className="py-16 text-center space-y-4">
        <p className="text-slate-400">Network not found or access unauthorized.</p>
        <Button onClick={() => navigate(-1)} icon={ArrowLeft}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SimulatedBanner />

      <div className="flex items-center justify-between pb-4 border-b border-[#1f293d]">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">{network.name}</h1>
            <p className="text-xs text-slate-400">{network.description || 'Configured bandwidth domain'}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyCode}
            icon={copied ? Check : Copy}
          >
            {copied ? 'Copied' : `Code: ${network.invitationCode}`}
          </Button>
        </div>
      </div>

      {/* Network Specs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="titan-card p-5 space-y-3">
          <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
            Bandwidth Capacity
          </h4>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">Total Physical Uplink:</span>
              <span className="text-slate-100 font-bold">{network.totalCapacityMbps} Mbps</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Emergency Reserve:</span>
              <span className="text-rose-400 font-bold">{network.reservedBandwidthMbps} Mbps</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-800">
              <span className="text-slate-300 font-bold">Usable Budget:</span>
              <span className="text-teal-400 font-bold">
                {Math.max(0, network.totalCapacityMbps - network.reservedBandwidthMbps)} Mbps
              </span>
            </div>
          </div>
        </div>

        <div className="titan-card p-5 space-y-3">
          <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
            Policy Specifications
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Active Policy:</span>
              <span className="text-teal-400 font-bold font-mono">{network.allocationPolicy}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Priority Weights:</span>
              <span className="text-slate-200 font-mono">H:5 | M:3 | L:1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Starvation Aging:</span>
              <span className="text-emerald-400 font-semibold">
                {network.enableAging ? 'Enabled (+5m)' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>

        <div className="titan-card p-5 space-y-3">
          <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
            Governance & Access
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Owner:</span>
              <span className="text-slate-200 font-medium">{network.owner?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Members:</span>
              <span className="text-slate-100 font-bold font-mono">{members.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Request Acceptance:</span>
              <span className={network.isRequestsPaused ? 'text-rose-400' : 'text-emerald-400 font-semibold'}>
                {network.isRequestsPaused ? 'Paused' : 'Active'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Network Members Roster */}
      <div className="titan-card p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h4 className="text-sm font-semibold text-slate-200">
              Authorized Network Members ({members.length})
            </h4>
            <p className="text-xs text-slate-400">
              Users granted access to request bandwidth under this gateway
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Membership Status</th>
                <th className="p-3">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {members.map((m) => (
                <tr key={m._id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-3 font-semibold text-slate-200">{m.user?.name || 'Member'}</td>
                  <td className="p-3 text-slate-400 font-mono">{m.user?.email}</td>
                  <td className="p-3 font-mono text-[11px] uppercase">
                    <span
                      className={`px-2 py-0.5 rounded font-semibold ${
                        m.role === 'owner'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : 'bg-teal-500/10 text-teal-400 border border-teal-500/30'
                      }`}
                    >
                      {m.role}
                    </span>
                  </td>
                  <td className="p-3">
                    <StatusBadge status={m.status} />
                  </td>
                  <td className="p-3 text-slate-400 font-mono">
                    {new Date(m.joinedAt || m.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
