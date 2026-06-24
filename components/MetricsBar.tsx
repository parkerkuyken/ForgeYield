'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Vault, DollarSign, Zap } from 'lucide-react';

interface Props {
  anvilVault: number;
  ondoUSDY: number;
  monthlyYield: number;
  anvilReserved: number;
}

function MetricCard({
  label,
  value,
  sub,
  accent,
  icon,
  live,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
  icon: React.ReactNode;
  live?: boolean;
}) {
  return (
    <div className="finance-card bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="text-zinc-400 text-sm font-medium">{label}</div>
        <div className="flex items-center gap-2">
          {live && (
            <span className="flex items-center gap-1 text-xs text-emerald-400">
              <span className="live-dot w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              LIVE
            </span>
          )}
          <div className="text-zinc-600">{icon}</div>
        </div>
      </div>
      <div className={`text-3xl font-semibold tabular-nums ${accent ?? ''}`}>{value}</div>
      {sub && <div className="text-xs text-zinc-500">{sub}</div>}
    </div>
  );
}

export default function MetricsBar({ anvilVault, ondoUSDY, monthlyYield, anvilReserved }: Props) {
  const [prevYield, setPrevYield] = useState(monthlyYield);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (monthlyYield !== prevYield) {
      setFlash(true);
      setPrevYield(monthlyYield);
      const t = setTimeout(() => setFlash(false), 600);
      return () => clearTimeout(t);
    }
  }, [monthlyYield, prevYield]);

  const available = anvilVault + ondoUSDY - anvilReserved;
  const annualYield = Math.round(ondoUSDY * 0.0482);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
      <MetricCard
        label="Vault Collateral"
        value={`$${(anvilVault / 1_000_000).toFixed(2)}M`}
        sub="Anvil Protocol"
        icon={<Vault className="w-4 h-4" />}
      />
      <MetricCard
        label="Ondo USDY Position"
        value={`$${(ondoUSDY / 1_000_000).toFixed(2)}M`}
        sub="Tokenized US Treasuries"
        accent="text-blue-400"
        icon={<TrendingUp className="w-4 h-4" />}
        live
      />
      <MetricCard
        label="Monthly Yield"
        value={`$${monthlyYield.toLocaleString()}`}
        sub={`$${annualYield.toLocaleString()} / year`}
        accent={`text-emerald-400 ${flash ? 'yield-updating' : ''}`}
        icon={<Zap className="w-4 h-4" />}
        live
      />
      <MetricCard
        label="Available for Upgrades"
        value={`$${(available / 1_000_000).toFixed(2)}M`}
        sub="Vault + USDY − Reserved"
        icon={<DollarSign className="w-4 h-4" />}
      />
    </div>
  );
}
