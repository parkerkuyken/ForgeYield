'use client';

import { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Deposit idle cash',
    body: 'Park your facility\'s reserve funds into the Anvil vault as USDC collateral.',
  },
  {
    number: '02',
    title: 'Earn 4.82% APY',
    body: 'Funds are converted to Ondo USDY — a tokenized US Treasury bill — and start earning yield immediately.',
  },
  {
    number: '03',
    title: 'Yield pays for maintenance',
    body: 'Every month, earned yield sweeps automatically to your maintenance wallet. Equipment costs fund themselves.',
  },
];

export default function OnboardingBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative bg-zinc-900 border border-zinc-700 rounded-3xl p-6 md:p-8 mb-10">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="mb-6">
        <div className="text-xs text-emerald-400 tracking-widest font-medium mb-1">HOW IT WORKS</div>
        <h2 className="text-xl font-semibold">Your reserves, working harder</h2>
        <p className="text-zinc-400 text-sm mt-1">
          ForgeYield turns idle hospital cash into a self-funding maintenance budget — no new capital required.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map((step, i) => (
          <div key={step.number} className="flex gap-4 items-start">
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-8 h-8 rounded-full bg-emerald-600/20 border border-emerald-600/40 
                              flex items-center justify-center text-emerald-400 text-xs font-mono font-bold">
                {step.number}
              </div>
              {i < steps.length - 1 && (
                <ArrowRight className="w-4 h-4 text-zinc-600 hidden md:block" />
              )}
            </div>
            <div>
              <div className="font-semibold text-sm">{step.title}</div>
              <div className="text-zinc-400 text-xs mt-1 leading-relaxed">{step.body}</div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setDismissed(true)}
        className="mt-6 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        Got it, hide this
      </button>
    </div>
  );
}
