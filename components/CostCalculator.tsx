'use client';

import { useState } from 'react';
import { Calculator } from 'lucide-react';

export default function CostCalculator() {
  const [monthlyCost, setMonthlyCost] = useState(150000);
  const [targetCoverage, setTargetCoverage] = useState(90);

  const requiredCapital = Math.round(
    (monthlyCost * targetCoverage / 100) * 12 / 0.0482
  );

  return (
    <div className="finance-card bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
        <Calculator className="text-amber-400" /> Equipment Cost Coverage
      </h3>

      <div className="space-y-6">
        <div>
          <label className="text-sm text-zinc-400">Monthly Maintenance + Upgrades</label>
          <div className="mt-2 flex items-center bg-zinc-950 border border-zinc-700 rounded-2xl px-5">
            <span className="text-zinc-400">$</span>
            <input
              type="number"
              value={monthlyCost}
              onChange={(e) => setMonthlyCost(Number(e.target.value))}
              className="flex-1 bg-transparent py-4 font-mono text-xl outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-zinc-400">
            Target Coverage: {targetCoverage}%
          </label>
          <input
            type="range"
            min="50"
            max="100"
            step="5"
            value={targetCoverage}
            onChange={(e) => setTargetCoverage(Number(e.target.value))}
            className="w-full accent-emerald-500 mt-2"
          />
        </div>

        <div className="pt-4 border-t border-zinc-800">
          <div className="text-sm text-zinc-400">Required Ondo Capital</div>
          <div className="text-4xl font-semibold tabular-nums mt-1">
            ${requiredCapital.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
