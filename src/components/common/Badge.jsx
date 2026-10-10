import React from 'react';

export const StatusBadge = ({ status }) => {
  const styles = {
    approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    partially_allocated: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    pending: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    rejected: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    cancelled: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    suspended: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  };

  const labels = {
    approved: 'Approved',
    partially_allocated: 'Partial',
    pending: 'Pending',
    rejected: 'Rejected',
    cancelled: 'Cancelled',
    active: 'Active',
    suspended: 'Suspended',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        styles[status] || 'bg-slate-800 text-slate-300 border-slate-700'
      }`}
    >
      {labels[status] || status}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  const styles = {
    high: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    low: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider font-semibold border ${
        styles[priority?.toLowerCase()] || 'bg-slate-800 text-slate-400 border-slate-700'
      }`}
    >
      {priority}
    </span>
  );
};
