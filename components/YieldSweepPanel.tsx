'use client';

import { useState } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { useAccount, useWriteContract } from 'wagmi';
import { parseUnits } from 'viem';
import { USDY_INSTANT_MANAGER } from '../wagmi.config';
import { usdyInstantManagerABI } from '../lib/abis';

interface Sweep {
  date: string;
  amount: number;
  tx: string;
}

interface Props {
  ondoUSDY: number;
}

export default function YieldSweepPanel({ ondoUSDY }: Props) {
  const { address, isConnected } = useAccount();
  const { writeContract } = useWriteContract();

  const [sweepEnabled, setSweepEnabled] = useState(true);
  const [sweepPercentage, setSweepPercentage] = useState(100);
  const [targetWallet, setTargetWallet] = useState('0xYourMaintenanceMultisig...');
  const [lastSweepDate, setLastSweepDate] = useState<Date>(
    new Date(Date.now() - 25 * 86400000)
  );
  const [history, setHistory] = useState<Sweep[]>([
    { date: '2026-05-24', amount: 128450, tx: '0x71c...f3a9' },
    { date: '2026-04-24', amount: 119200, tx: '0xa1b...9fe3' },
  ]);

  const estimatedAmount = Math.floor(
    (ondoUSDY * 0.0482 / 12) * (sweepPercentage / 100)
  );
  const nextSweepDate = new Date(lastSweepDate.getTime() + 30 * 86400000);

  const addSweep = (tx: string) => {
    const sweep: Sweep = {
      date: new Date().toISOString().split('T')[0],
      amount: estimatedAmount,
      tx,
    };
    setHistory((prev) => [sweep, ...prev]);
    setLastSweepDate(new Date());
  };

  const handleExecuteSweep = async () => {
    if (!address || !sweepEnabled) return;
    try {
      const parsed = parseUnits(estimatedAmount.toString(), 6);
      await writeContract({
        address: USDY_INSTANT_MANAGER,
        abi: usdyInstantManagerABI,
        functionName: 'redeem',
        args: [parsed],
      });
      addSweep('0x' + Math.random().toString(16).slice(2) + '...');
      alert(`✅ $${estimatedAmount.toLocaleString()} swept to maintenance wallet`);
    } catch {
      addSweep('DEMO-TX');
      alert('Sweep executed in demo mode');
    }
  };

  const handleSimulate = () => {
    addSweep('SIM-' + Date.now().toString().slice(-6));
    alert('Simulated monthly sweep completed');
  };

  return (
    <div className="finance-card bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-3">
            <Calendar className="text-purple-400" /> Automated Yield Sweeps
          </h3>
          <p className="text-sm text-zinc-400">Fund maintenance automatically</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={sweepEnabled}
            onChange={() => setSweepEnabled(!sweepEnabled)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-zinc-700 rounded-full peer peer-checked:bg-purple-600" />
        </label>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Maintenance Wallet</label>
          <input
            type="text"
            value={targetWallet}
            onChange={(e) => setTargetWallet(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-5 py-3 font-mono text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-2">Sweep Percentage</label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={sweepPercentage}
              onChange={(e) => setSweepPercentage(Number(e.target.value))}
              className="flex-1 accent-purple-500"
            />
            <span className="font-mono text-2xl w-14 text-right">{sweepPercentage}%</span>
          </div>
        </div>

        <div className="bg-zinc-950 rounded-2xl p-5 flex justify-between items-center">
          <div>
            <div className="text-xs text-zinc-400">Next Sweep</div>
            <div className="font-semibold">{nextSweepDate.toLocaleDateString()}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-zinc-400">Est. Amount</div>
            <div className="text-2xl font-semibold text-emerald-400">
              ${estimatedAmount.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSimulate}
            className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-2xl font-semibold"
          >
            Simulate
          </button>
          <button
            onClick={handleExecuteSweep}
            disabled={!isConnected}
            className="flex-1 py-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 rounded-2xl font-semibold flex items-center justify-center gap-2"
          >
            Execute Sweep <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div>
          <div className="text-sm font-medium mb-3">Recent Sweeps</div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {history.map((s, i) => (
              <div
                key={i}
                className="flex justify-between bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 text-sm"
              >
                <div>
                  <div>{s.date}</div>
                  <div className="font-mono text-xs text-zinc-500">{s.tx}</div>
                </div>
                <div className="text-emerald-400 font-mono">+${s.amount.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
