'use client';

import { useState, useEffect } from 'react';
import { Hammer } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

import MetricsBar      from '../components/MetricsBar';
import DepositPanel    from '../components/DepositPanel';
import OndoPanel       from '../components/OndoPanel';
import LOCPanel        from '../components/LOCPanel';
import CostCalculator  from '../components/CostCalculator';
import YieldSweepPanel from '../components/YieldSweepPanel';

export default function HomePage() {
  // Shared portfolio state (lifted up so all panels can read/write it)
  const [anvilVault,    setAnvilVault]    = useState(16_300_000);
  const [ondoUSDY,      setOndoUSDY]      = useState(32_450_000);
  const [monthlyYield,  setMonthlyYield]  = useState(130_300);
  const [anvilReserved, setAnvilReserved] = useState(0);

  // Simulate live yield accrual in the demo
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
    <div className="min-h-screen bg-zinc-950 text-zinc-200 pb-20">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-emerald-600 rounded-2xl flex items-center justify-center">
              <Hammer className="w-7 h-7" />
            </div>
            <span className="text-4xl font-semibold tracking-tighter">ForgeYield</span>
          </div>
          <ConnectButton />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-10">
        {/* Hero */}
        <div className="flex flex-col lg:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <h1 className="text-6xl font-semibold tracking-tighter">
              Collateral to Self-Funding Equipment
            </h1>
            <p className="text-2xl text-zinc-400 mt-3">
              Anvil Protocol + Ondo Finance • Automated Yield Sweeps
            </p>
          </div>
          <div className="text-right">
            <div className="text-emerald-400 text-sm tracking-widest">USDY CURRENT APY</div>
            <div className="text-5xl font-semibold tabular-nums">4.82%</div>
          </div>
        </div>

        {/* Portfolio metrics */}
        <MetricsBar
          anvilVault={anvilVault}
          ondoUSDY={ondoUSDY}
          monthlyYield={monthlyYield}
          anvilReserved={anvilReserved}
        />

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: action panels */}
          <div className="lg:col-span-7 space-y-8">
            <DepositPanel
              onDeposited={(amount) => setAnvilVault((prev) => prev + amount)}
            />
            <OndoPanel
              anvilVault={anvilVault}
              onAllocated={(amount) => {
                setAnvilVault((prev) => prev - amount);
                setOndoUSDY((prev)   => prev + amount);
              }}
            />
            <LOCPanel
              anvilVault={anvilVault}
              onIssued={(amount) => {
                setAnvilReserved((prev) => prev + amount);
                setAnvilVault((prev)    => prev - amount);
              }}
            />
          </div>

          {/* Right: calculator + sweeps */}
          <div className="lg:col-span-5 space-y-8">
            <CostCalculator />
            <YieldSweepPanel ondoUSDY={ondoUSDY} />
          </div>
        </div>
      </main>
    </div>
  );
}
