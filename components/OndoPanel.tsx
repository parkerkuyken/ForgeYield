'use client';

import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { useAccount, useWriteContract } from 'wagmi';
import { parseUnits } from 'viem';
import { USDY_INSTANT_MANAGER } from '../wagmi.config';
import { usdyInstantManagerABI } from '../lib/abis';

interface Props {
  anvilVault: number;
  onAllocated: (amount: number) => void;
}

export default function OndoPanel({ anvilVault, onAllocated }: Props) {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [amount, setAmount] = useState('5000000');

  const handleAllocate = async () => {
    if (!address) return alert('Connect wallet');
    if (Number(amount) > anvilVault) return alert('Insufficient in vault');
    const parsed = parseUnits(amount, 6);

    try {
      await writeContract({
        address: USDY_INSTANT_MANAGER,
        abi: usdyInstantManagerABI,
        functionName: 'subscribe',
        args: [parsed],
      });
      onAllocated(Number(amount));
      alert('✅ Converted to Ondo USDY');
    } catch {
      alert('Transaction failed (demo mode)');
    }
  };

  return (
    <div className="finance-card bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
        <TrendingUp className="text-blue-400" /> Allocate to Ondo USDY
      </h3>
      <div className="flex gap-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="flex-1 bg-zinc-950 border border-zinc-700 rounded-2xl px-5 py-4 font-mono"
        />
        <button
          onClick={handleAllocate}
          className="px-10 bg-blue-600 hover:bg-blue-500 rounded-2xl font-semibold"
        >
          Convert to USDY
        </button>
      </div>
    </div>
  );
}
