import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Button } from '../components/common/Button.jsx';
import {
  Activity,
  ShieldCheck,
  Scale,
  Zap,
  ArrowRight,
  Cpu,
  Lock,
  Layers,
  BarChart3,
  Server,
} from 'lucide-react';

export const LandingPage = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="space-y-20 py-4">
      {/* Hero Section */}
      <section className="relative text-center max-w-4xl mx-auto space-y-6 pt-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-teal-500/10 border border-teal-500/30 rounded-full text-xs font-mono text-teal-300">
          <Activity className="w-3.5 h-3.5 text-teal-400" />
          <span>Hackathon Problem Statement: PS-32 | Team CBC048</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Intelligent Shared Internet <br />
          <span className="text-teal-gradient">Bandwidth Usage Manager</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          TITAN resolves shared uplink congestion through mathematically rigorous,
          policy-driven bandwidth allocation. Protect mission-critical exam and teleconferencing
          traffic while ensuring fair sharing without starvation.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          {isAuthenticated ? (
            <Link to={isAdmin ? '/admin' : '/dashboard'}>
              <Button size="lg" icon={ArrowRight}>
                Enter {isAdmin ? 'Admin Console' : 'My Dashboard'}
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/register">
                <Button size="lg" icon={ArrowRight}>
                  Get Started (Register)
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="lg">
                  Sign In with Demo Account
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Demo Credentials Helper Pill */}
        <div className="pt-6 max-w-xl mx-auto">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 text-left font-mono">
            <div className="flex items-center justify-between mb-2">
              <span className="text-teal-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Local Demo Quick-Credentials:
              </span>
              <span className="text-[10px] text-slate-500">Pass: TitanDemo123!</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-300 font-bold">Admin:</span> admin@titan.local
              </div>
              <div>
                <span className="text-slate-300 font-bold">User A (Exam):</span> alex@titan.local
              </div>
              <div>
                <span className="text-slate-300 font-bold">User B (Video):</span> bella@titan.local
              </div>
              <div>
                <span className="text-slate-300 font-bold">User C (Bulk):</span> charlie@titan.local
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">How TITAN Works</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            From policy declaration to deterministic water-filling allocation in milliseconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="titan-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-mono font-bold">
              01
            </div>
            <h3 className="text-base font-semibold text-white">Network Budgeting</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Admin sets total uplink Mbps and reserves an untouchable emergency buffer for network management.
            </p>
          </div>

          <div className="titan-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-mono font-bold">
              02
            </div>
            <h3 className="text-base font-semibold text-white">Demand Ingestion</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Authorized users submit bandwidth requests declaring priority, desired Mbps, and application intent.
            </p>
          </div>

          <div className="titan-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono font-bold">
              03
            </div>
            <h3 className="text-base font-semibold text-white">Deterministic Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              The pure allocation engine executes policy invariants, guarantees minimum floors, and redistributes unused share.
            </p>
          </div>

          <div className="titan-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold">
              04
            </div>
            <h3 className="text-base font-semibold text-white">Realtime Telemetry</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Room-authorized WebSocket channels broadcast updated policy allocations to connected user dashboards.
            </p>
          </div>
        </div>
      </section>

      {/* Allocation Policy Comparison Summary */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Three Integrated Allocation Policies
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Choose the right policy for your campus or enterprise environment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="titan-card p-6 space-y-4 border-blue-500/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400">
                Policy A
              </span>
              <span className="text-xs bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded border border-blue-500/20">
                Baseline
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">First Come, First Served (FCFS)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Allocates bandwidth in order of request arrival time until usable capacity is fully exhausted. Stable tie-breaking prevents race condition nondeterminism.
            </p>
            <div className="pt-2 text-xs font-mono text-slate-300 border-t border-slate-800">
              Ideal for: Unranked open public Wi-Fi zones.
            </div>
          </div>

          <div className="titan-card p-6 space-y-4 border-amber-500/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                Policy B
              </span>
              <span className="text-xs bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20">
                Preemptive
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">Strict Priority-Based Allocation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Partitions traffic into High, Medium, and Low tiers. Higher tiers preempt lower tiers completely before remaining capacity is offered to subordinate requests.
            </p>
            <div className="pt-2 text-xs font-mono text-slate-300 border-t border-slate-800">
              Ideal for: Critical mission control & proctored exams.
            </div>
          </div>

          <div className="titan-card p-6 space-y-4 border-teal-500/40 bg-teal-950/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-400">
                Policy C
              </span>
              <span className="text-xs bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded border border-teal-500/30">
                Adaptive
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">Adaptive Priority-Aware Fair Sharing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Combines minimum bandwidth guarantees with iterative water-filling redistribution and waiting-time aging to prevent low-priority starvation.
            </p>
            <div className="pt-2 text-xs font-mono text-slate-300 border-t border-slate-800">
              Ideal for: Modern educational campuses and enterprise networks.
            </div>
          </div>
        </div>
      </section>

      {/* Core Architectural Invariants */}
      <section className="titan-card p-8 space-y-6">
        <div className="flex items-center space-x-3">
          <ShieldCheck className="w-6 h-6 text-teal-400" />
          <h2 className="text-xl font-bold text-white">Guaranteed Invariants & Security Principles</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
          <div className="space-y-2">
            <p className="font-semibold text-slate-100 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" /> Usable Capacity Conservation:
            </p>
            <p className="text-slate-400">
              &Sigma;(Allocations) &le; TotalCapacity - ReservedBandwidth. The sum of allocated bandwidth will mathematically never exceed usable capacity under any load.
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-semibold text-slate-100 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" /> Zero Client Trust:
            </p>
            <p className="text-slate-400">
              All allocations are computed exclusively by the server engine. Frontend clients can never dictate their own bandwidth limits or bypass network authorization.
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-semibold text-slate-100 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" /> Deterministic Reproducibility:
            </p>
            <p className="text-slate-400">
              Given identical network capacity and input requests, the allocation engine yields 100% identical outputs for verifiable auditability.
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-semibold text-slate-100 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" /> Starvation Mitigation:
            </p>
            <p className="text-slate-400">
              Configurable waiting-time aging boosts effective priority for long-queued requests so that heavy high-tier users cannot starve low-tier background tasks indefinitely.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
