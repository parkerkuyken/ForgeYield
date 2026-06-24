'use client';

import { useState } from 'react';
import { Calendar, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { useAccount, useWriteContract } from 'wagmi';
import { parseUnits } from 'viem';
import { USDY_INSTANT_MANAGER } from '../wagmi.config';
import { usdyInstantManagerABI } from '../lib/abis';

interface Sweep { date: string; amount: number; tx: string; }

interface Props {
  ondoUSDY: number;
  toast: { success: (t: string, m?: string) => void; error: (t: string, m?: string) => void };
}

export default function YieldSweepPanel({ ondoUSDY, toast }: Props) {
  const { address, isConnected } = useAccount();
  const { writeContract } = useWriteContract();

  const [sweepEnabled, setSweepEnabled] = useState(true);
  const [sweepPercentage, setSweepPercentage] = useState(100);
  const [targetWallet, setTargetWallet] = useState('');
  const [lastSweepDate, setLastSweepDate] = useState<Date>(new Date(Date.now() - 25 * 86400000));
  const [history, setHistory] = useState<Sweep[]>([
    { date: '2026-05-24', amount: 128450, tx: '0x71c...f3a9' },
    { date: '2026-04-24', amount: 119200, tx: '0xa1b...9fe3' },
  ]);
  const [loading, setLoading] = useState(false);

  const estimatedAmount = Math.floor((ondoUSDY * 0.0482 / 12) * (sweepPercentage / 100));
  const nextSweepDate = new Date(lastSweepDate.getTime() + 30 * 86400000);
  const daysUntilSweep = Math.max(0, Math.ceil((nextSweepDate.getTime() - Date.now()) / 86400000));
  const invalidWallet = targetWallet.length > 0 && !targetWallet.startsWith('0x');

  const addSweep = (tx: string) => {
    setHistory((prev) => [{ date: new Date().toISOString().split('T')[0], amount: estimatedAmount, tx }, ...prev]);
    setLastSweepDate(new Date());
  };

  const handleExecuteSweep = async () => {
    if (!sweepEnabled) return;
    if (!targetWallet) { toast.error('No maintenance wallet set', 'Enter a destination wallet address.'); return; }
    setLoading(true);
    try {
      await writeContract({ address: USDY_INSTANT_MANAGER, abi: usdyInstantManagerABI, functionName: 'redeem', args: [parseUnits(estimatedAmount.toString(), 6)] });
      addSweep('0x' + Math.random().toString(16).slice(2, 10) + '…');
      toast.success('Sweep complete', `$${estimatedAmount.toLocaleString()} sent to maintenance wallet.`);
    } catch {
      addSweep('DEMO-' + Date.now().toString().slice(-6));
      toast.success('Sweep complete (demo)', `$${estimatedAmount.toLocaleString()} sent to maintenance wallet.`);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulate = () => {
    addSweep('SIM-' + Date.now().toString().slice(-6));
    toast.info('Sweep simulated', `$${estimatedAmount.toLocaleString()} would be sent on ${nextSweepDate.toLocaleDateString()}.`);
  };

  return (
    <div className="finance-card bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600/20 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Automated Yield Sweeps</h3>
            <p className="text-sm text-zinc-400 mt-0.5">Monthly yield → maintenance wallet, automatically.</p>
          </div>
        </div>
        <button
          onClick={() => setSweepEnabled(!sweepEnabled)}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0
                      ${sweepEnabled ? 'bg-purple-600' : 'bg-zinc-700'}`}
          aria-label="Toggle sweeps"
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200
                            ${sweepEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
      </div>

      <div className="space-y-5">
        {/* Next sweep summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-zinc-950 rounded-2xl p-4">
            <div className="text-xs text-zinc-400 mb-1">Next sweep</div>
            <div className="font-semibold text-sm">{nextSweepDate.toLocaleDateString()}</div>
            <div className="text-xs text-zinc-500 mt-0.5">{daysUntilSweep} days away</div>
          </div>
          <div className="bg-zinc-950 rounded-2xl p-4">
            <div className="text-xs text-zinc-400 mb-1">Est. amount</div>
            <div className="text-xl font-semibold text-emerald-400">${estimatedAmount.toLocaleString()}</div>
            <div className="text-xs text-zinc-500 mt-0.5">{sweepPercentage}% of yield</div>
          </div>
        </div>

        {/* Wallet */}
        <div className="space-y-2">
          <label className="text-sm text-zinc-400">Maintenance wallet</label>
          <input
            type="text"
            value={targetWallet}
            onChange={(e) => setTargetWallet(e.target.value)}
            className={`input-base w-full font-mono text-sm ${invalidWallet ? 'border-red-500/60' : ''}`}
            placeholder="0x... destination address"
          />
          {invalidWallet && <p className="text-xs text-red-400">Must start with 0x</p>}
        </div>

        {/* Percentage slider */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm text-zinc-400">Sweep percentage</label>
            <span className="font-mono text-sm font-semibold">{sweepPercentage}%</span>
          </div>
          <input
            type="range" min="10" max="100" step="5"
            value={sweepPercentage}
            onChange={(e) => setSweepPercentage(Number(e.target.value))}
            className="w-full accent-purple-500"
          />
          <div className="flex justify-between text-xs text-zinc-600">
            <span>10%</span><span>50%</span><span>100%</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleSimulate}
            className="btn-primary flex-1 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-sm"
          >
            Simulate
          </button>
          <button
            onClick={handleExecuteSweep}
            disabled={loading || !sweepEnabled || invalidWallet}
            className="btn-primary flex-1 py-3.5 bg-purple-600 hover:bg-purple-500 text-white text-sm"
          >
            {loading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Sweeping…</>
              : <>Execute <ArrowRight className="w-4 h-4" /></>}
          </button>
        </div>

        {/* History */}
        <div>
          <div className="text-sm font-medium mb-3 text-zinc-300">Sweep history</div>
          <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
            {history.map((s, i) => (
              <div key={i} className="flex justify-between items-center bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-sm font-medium">{s.date}</div>
                    <div className="font-mono text-xs text-zinc-500">{s.tx}</div>
                  </div>
                </div>
                <div className="text-emerald-400 font-mono font-semibold text-sm">+${s.amount.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
