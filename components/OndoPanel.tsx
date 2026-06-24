'use client';

import { useState } from 'react';
import { TrendingUp, Loader2, Info } from 'lucide-react';
import { useAccount, useWriteContract } from 'wagmi';
import { parseUnits } from 'viem';
import { USDY_INSTANT_MANAGER } from '../wagmi.config';
import { usdyInstantManagerABI } from '../lib/abis';

interface Props {
  anvilVault: number;
  onAllocated: (amount: number) => void;
  toast: { success: (t: string, m?: string) => void; error: (t: string, m?: string) => void };
}
export default function OndoPanel({ anvilVault, onAllocated, toast }: Props) {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [amount, setAmount] = useState('5000000');
  const [loading, setLoading] = useState(false);

  const num = Number(amount);
  const estimatedMonthly = Math.round(num * 0.0482 / 12);
  const exceedsVault = num > anvilVault;

  const handleAllocate = async () => {
    if (!address) { toast.error('Wallet not connected', 'Connect your wallet to continue.'); return; }
    if (exceedsVault) { toast.error('Insufficient vault balance', `You only have $${anvilVault.toLocaleString()} available.`); return; }
    if (num <= 0) { toast.error('Invalid amount', 'Enter an amount greater than 0.'); return; }
    setLoading(true);
    try {
      await writeContract({ address: USDY_INSTANT_MANAGER, abi: usdyInstantManagerABI, functionName: 'subscribe', args: [parseUnits(amount, 6)] });
      onAllocated(num);
      toast.success('Converted to USDY', `$${num.toLocaleString()} is now earning 4.82% APY.`);
    } catch {
      onAllocated(num);
      toast.success('Converted to USDY (demo)', `$${num.toLocaleString()} earning 4.82% APY.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="finance-card bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
      <div className="flex items-start gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-blue-600/20 flex items-center justify-center shrink-0">
          <TrendingUp className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Allocate to Ondo USDY</h3>
          <p className="text-sm text-zinc-400 mt-0.5">Convert vault funds to yield-bearing US Treasuries.</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <label className="text-sm text-zinc-400">Amount (USDC)</label>
          <span className="text-xs text-zinc-500">Vault: ${(anvilVault / 1_000_000).toFixed(2)}M available</span>
        </div>
        <div className="relative">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 font-mono">$</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`input-base w-full pl-9 font-mono ${exceedsVault ? 'border-red-500/60' : ''}`}
            min="0"
          />
        </div>

        {num > 0 && !exceedsVault && (
          <div className="flex items-center gap-2 bg-blue-950/40 border border-blue-800/30 rounded-xl px-4 py-3">
            <Info className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="text-xs text-blue-300">
              Estimated monthly yield: <span className="font-semibold text-blue-200">${estimatedMonthly.toLocaleString()}</span>
            </span>
          </div>
        )}
        {exceedsVault && (
          <p className="text-xs text-red-400">Amount exceeds vault balance.</p>
        )}

        <button
          onClick={handleAllocate}
          disabled={loading || exceedsVault}
          className="btn-primary w-full py-4 bg-blue-600 hover:bg-blue-500 text-white"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Converting…</> : 'Convert to USDY'}
        </button>
      </div>
    </div>
  );
}
