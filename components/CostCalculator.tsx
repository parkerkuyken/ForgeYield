'use client';

import { useState } from 'react';
import { Calculator, TrendingDown } from 'lucide-react';

const PRESETS = [
  { label: 'Small clinic', value: 50000 },
  { label: 'Mid hospital', value: 150000 },
  { label: 'Large system', value: 500000 },
];

export default function CostCalculator() {
  const [monthlyCost, setMonthlyCost] = useState(150000);
  const [targetCoverage, setTargetCoverage] = useState(90);

  const requiredCapital = Math.round((monthlyCost * targetCoverage / 100) * 12 / 0.0482);
  const coveredMonthly = Math.round(monthlyCost * targetCoverage / 100);
  const annualSavings = coveredMonthly * 12;

  return (
    <div className="finance-card bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
      <div className="flex items-start gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-amber-600/20 flex items-center justify-center shrink-0">
          <Calculator className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Coverage Calculator</h3>
          <p className="text-sm text-zinc-400 mt-0.5">Find out how much capital you need to deploy.</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Presets */}
        <div className="flex gap-2 flex-wrap">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => setMonthlyCost(p.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors
                          ${monthlyCost === p.value
                            ? 'bg-amber-600/30 border border-amber-500/40 text-amber-300'
                            : 'bg-zinc-800 border border-zinc-700 text-zinc-400 hover:border-zinc-600'}`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Monthly cost input */}
        <div className="space-y-2">
          <label className="text-sm text-zinc-400">Monthly maintenance budget</label>
          <div className="flex items-center bg-zinc-950 border border-zinc-700 rounded-2xl px-5 focus-within:border-zinc-500 transition-colors">
            <span className="text-zinc-400 font-mono">$</span>
            <input
              type="number"
              value={monthlyCost}
              onChange={(e) => setMonthlyCost(Number(e.target.value))}
              className="flex-1 bg-transparent py-4 pl-2 font-mono text-xl outline-none"
            />
          </div>
        </div>

        {/* Coverage slider */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm text-zinc-400">Yield coverage target</label>
            <span className="text-sm font-semibold text-amber-400">{targetCoverage}%</span>
          </div>
          <input
            type="range" min="10" max="100" step="5"
            value={targetCoverage}
            onChange={(e) => setTargetCoverage(Number(e.target.value))}
            className="w-full accent-amber-500"
          />
          <div className="flex justify-between text-xs text-zinc-600">
            <span>10% covered</span><span>100% covered</span>
          </div>
        </div>

        {/* Results */}
        <div className="border-t border-zinc-800 pt-5 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-zinc-400">Capital to deploy</span>
            <span className="text-2xl font-semibold tabular-nums">${requiredCapital.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-zinc-400">Monthly cost covered</span>
            <span className="text-sm font-semibold text-emerald-400">${coveredMonthly.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 bg-emerald-950/30 border border-emerald-800/30 rounded-xl px-4 py-3 mt-2">
            <TrendingDown className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs text-emerald-300">
              Your annual budget impact: <span className="font-semibold">−${annualSavings.toLocaleString()}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
