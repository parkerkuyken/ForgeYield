'use client';

import { useState, useEffect } from 'react';
import { Hammer } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

import MetricsBar       from '../components/MetricsBar';
import DepositPanel     from '../components/DepositPanel';
import OndoPanel        from '../components/OndoPanel';
import LOCPanel         from '../components/LOCPanel';
import CostCalculator   from '../components/CostCalculator';
import YieldSweepPanel  from '../components/YieldSweepPanel';
import OnboardingBanner from '../components/OnboardingBanner';
import ToastContainer   from '../components/Toast';
import { useToast }     from '../lib/useToast';

export default function HomePage() {
  const [anvilVault,    setAnvilVault]    = useState(16_300_000);
  const [ondoUSDY,      setOndoUSDY]      = useState(32_450_000);
  const [monthlyYield,  setMonthlyYield]  = useState(130_300);
  const [anvilReserved, setAnvilReserved] = useState(0);

  const { toasts, removeToast, toast } = useToast();

  // Simulate live yield accrual
  useEffect(() => {
    const interval = setInterval(() => {
      if (ondoUSDY > 0) {
        setOndoUSDY((prev) => prev + Math.round(prev * 0.0482 / 365) * 0.3);
        setMonthlyYield(Math.round(ondoUSDY * 0.0482 / 12));
      }
    }, 30_000);
    return () => clearInterval(interval);
  }, [ondoUSDY]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 pb-24">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shrink-0">
              <Hammer className="w-5 h-5" />
            </div>
            <span className="text-2xl md:text-3xl font-bold tracking-tight">ForgeYield</span>
          </div>
          <div className="flex items-center gap-3">
            <ConnectButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-8 md:pt-10">
        {/* Hero */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-10">
          <div className="max-w-2xl">
            <div className="text-xs text-emerald-400 tracking-widest font-medium mb-3">
              MEDICAL FACILITY TREASURY MANAGEMENT
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
              Collateral to<br />
              <span className="text-emerald-400">Self-Funding</span> Equipment
            </h1>
            <p className="text-base md:text-lg text-zinc-400 mt-4 leading-relaxed">
              Turn idle reserve cash into a maintenance budget that pays for itself — 
              powered by Anvil Protocol and Ondo Finance.
            </p>
          </div>
          <div className="text-left lg:text-right shrink-0">
            <div className="text-xs text-emerald-400 tracking-widest font-medium">USDY CURRENT APY</div>
            <div className="text-5xl md:text-6xl font-bold tabular-nums mt-1">4.82%</div>
            <div className="text-xs text-zinc-500 mt-1">Ondo Finance · Tokenized T-Bills</div>
          </div>
        </div>

        {/* Onboarding */}
        <OnboardingBanner />

        {/* Metrics */}
        <MetricsBar
          anvilVault={anvilVault}
          ondoUSDY={ondoUSDY}
          monthlyYield={monthlyYield}
          anvilReserved={anvilReserved}
        />

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          <div className="lg:col-span-7 space-y-6 md:space-y-8">
            <DepositPanel
              toast={toast}
              onDeposited={(amount) => setAnvilVault((prev) => prev + amount)}
            />
            <OndoPanel
              anvilVault={anvilVault}
              toast={toast}
              onAllocated={(amount) => {
                setAnvilVault((prev) => prev - amount);
                setOndoUSDY((prev)   => prev + amount);
              }}
            />
            <LOCPanel
              anvilVault={anvilVault}
              toast={toast}
              onIssued={(amount) => {
                setAnvilReserved((prev) => prev + amount);
                setAnvilVault((prev)    => prev - amount);
              }}
            />
          </div>

          <div className="lg:col-span-5 space-y-6 md:space-y-8">
            <CostCalculator />
            <YieldSweepPanel ondoUSDY={ondoUSDY} toast={toast} />
          </div>
        </div>


      </main>

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
