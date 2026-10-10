import React, { useState } from 'react';
import { Modal } from '../common/Modal.jsx';
import { Button } from '../common/Button.jsx';
import { networkService } from '../../services/networkService.js';
import { useToast } from '../../context/ToastContext.jsx';
import { Network, Plus } from 'lucide-react';

export const CreateNetworkModal = ({ isOpen, onClose, onCreated }) => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    totalCapacityMbps: 100,
    reservedBandwidthMbps: 10,
    allocationPolicy: 'ADAPTIVE',
    highWeight: 5,
    medWeight: 3,
    lowWeight: 1,
    highGuarantee: 10,
    medGuarantee: 5,
    lowGuarantee: 0,
    enableAging: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.reservedBandwidthMbps > form.totalCapacityMbps) {
      addToast('Reserved bandwidth cannot exceed total network capacity', 'error');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        totalCapacityMbps: Number(form.totalCapacityMbps),
        reservedBandwidthMbps: Number(form.reservedBandwidthMbps),
        allocationPolicy: form.allocationPolicy,
        priorityWeights: {
          high: Number(form.highWeight),
          medium: Number(form.medWeight),
          low: Number(form.lowWeight),
        },
        minimumGuarantees: {
          high: Number(form.highGuarantee),
          medium: Number(form.medGuarantee),
          low: Number(form.lowGuarantee),
        },
        enableAging: form.enableAging,
      };

      const newNetwork = await networkService.createNetwork(payload);
      addToast(`Network "${newNetwork.name}" created successfully!`, 'success');
      onCreated(newNetwork);
      onClose();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Bandwidth Network">
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Network Name *</label>
          <input
            type="text"
            required
            placeholder="e.g. Campus Backbone Alpha"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
          <textarea
            rows="2"
            placeholder="Network usage purpose and coverage details..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Total Capacity (Mbps) *</label>
            <input
              type="number"
              min="1"
              required
              value={form.totalCapacityMbps}
              onChange={(e) => setForm({ ...form, totalCapacityMbps: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-teal-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Reserved Bandwidth (Mbps) *</label>
            <input
              type="number"
              min="0"
              required
              value={form.reservedBandwidthMbps}
              onChange={(e) => setForm({ ...form, reservedBandwidthMbps: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 text-xs text-slate-400">
          Usable Bandwidth Pool:{' '}
          <span className="font-bold text-teal-400 font-mono">
            {Math.max(0, form.totalCapacityMbps - form.reservedBandwidthMbps)} Mbps
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Allocation Policy *</label>
          <select
            value={form.allocationPolicy}
            onChange={(e) => setForm({ ...form, allocationPolicy: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500"
          >
            <option value="ADAPTIVE">Policy C: Adaptive Priority-Aware Fair Sharing</option>
            <option value="PRIORITY">Policy B: Strict Priority-Based Allocation</option>
            <option value="FCFS">Policy A: First Come, First Served (FCFS)</option>
          </select>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <input
            type="checkbox"
            id="agingCheck"
            checked={form.enableAging}
            onChange={(e) => setForm({ ...form, enableAging: e.target.checked })}
            className="rounded bg-slate-900 border-slate-700 text-teal-500 focus:ring-teal-500"
          />
          <label htmlFor="agingCheck" className="text-xs text-slate-300">
            Enable Waiting-Time Aging (Mitigates starvation for long-waiting low priority requests)
          </label>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading} icon={Plus}>
            Create Network
          </Button>
        </div>
      </form>
    </Modal>
  );
};
