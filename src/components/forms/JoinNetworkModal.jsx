import React, { useState } from 'react';
import { Modal } from '../common/Modal.jsx';
import { Button } from '../common/Button.jsx';
import { networkService } from '../../services/networkService.js';
import { useToast } from '../../context/ToastContext.jsx';
import { KeyRound, ArrowRight } from 'lucide-react';

export const JoinNetworkModal = ({ isOpen, onClose, onJoined }) => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      addToast('Please enter an invitation code', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await networkService.joinNetwork(code.trim().toUpperCase());
      addToast(`Joined network "${res.name}" successfully!`, 'success');
      onJoined(res);
      onClose();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Join Network via Invitation Code">
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Network Invitation Code *
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              required
              placeholder="e.g. TITAN99"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white font-mono uppercase tracking-wider focus:outline-none focus:border-teal-500"
            />
          </div>
          <p className="mt-1.5 text-xs text-slate-400">
            Obtain this 8-character unique code from your organization or network administrator.
          </p>
        </div>

        <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading} icon={ArrowRight}>
            Join Network
          </Button>
        </div>
      </form>
    </Modal>
  );
};
