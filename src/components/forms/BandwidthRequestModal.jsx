import React, { useState } from 'react';
import { Modal } from '../common/Modal.jsx';
import { Button } from '../common/Button.jsx';
import { requestService } from '../../services/requestService.js';
import { useToast } from '../../context/ToastContext.jsx';
import { Send, Zap } from 'lucide-react';

export const BandwidthRequestModal = ({ isOpen, onClose, networkId, onSubmitted }) => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    desiredMbps: 20,
    priority: 'medium',
    reason: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.desiredMbps <= 0) {
      addToast('Desired bandwidth must be greater than 0 Mbps', 'error');
      return;
    }

    setLoading(true);
    try {
      const newRequest = await requestService.createRequest({
        networkId,
        desiredMbps: Number(form.desiredMbps),
        priority: form.priority,
        reason: form.reason,
      });

      addToast(
        `Request submitted! Allocated: ${newRequest.allocatedMbps} Mbps (${newRequest.status})`,
        'success'
      );
      onSubmitted(newRequest);
      onClose();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Submit Bandwidth Allocation Request">
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Desired Bandwidth (Mbps) *
          </label>
          <input
            type="number"
            min="0.5"
            step="0.5"
            required
            placeholder="e.g. 25"
            value={form.desiredMbps}
            onChange={(e) => setForm({ ...form, desiredMbps: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-teal-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Priority Tier *</label>
          <select
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500"
          >
            <option value="high">High (Exams, critical telemetry, emergency meetings)</option>
            <option value="medium">Medium (Interactive video calls, regular lectures)</option>
            <option value="low">Low (Background downloads, dataset backups, streaming)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Application / Justification *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Online proctored final examination"
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="p-3 bg-teal-950/20 border border-teal-500/20 rounded-lg text-xs text-teal-300">
          <p className="font-semibold mb-0.5">Automated Allocation Notice:</p>
          Your request will be evaluated deterministically by the network's active allocation policy. If total demand exceeds capacity, partial allocation or queue prioritization will apply.
        </div>

        <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading} icon={Send}>
            Submit Request
          </Button>
        </div>
      </form>
    </Modal>
  );
};
