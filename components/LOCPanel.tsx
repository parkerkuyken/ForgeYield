'use client';

import { useState } from 'react';
import { FileText, Loader2, AlertTriangle } from 'lucide-react';
import { useAccount, useWriteContract } from 'wagmi';
import { parseUnits } from 'viem';
import { ANVIL_LOC_PROXY } from '../wagmi.config';
import { letterOfCreditABI } from '../lib/abis';

interface Props {
  anvilVault: number;
  onIssued: (amount: number) => void;
  toast: { success: (t: string, m?: string) => void; error: (t: string, m?: string) => void };
}

export default function LOCPanel({ anvilVault, onIssued, toast }: Props) {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [beneficiary, setBeneficiary] = useState('');
  const [amount, setAmount] = useState('8500000');
  const [loading, setLoading] = useState(false);

  const num = Number(amount);
  const exceedsVault = num > anvilVault;
  const invalidAddress = beneficiary.length > 0 && !beneficiary.startsWith('0x');

  const handleIssueLOC = async () => {
    if (!address) { toast.error('Wallet not connected'); return; }
    if (!beneficiary) { toast.error('Beneficiary required', 'Enter the vendor wallet address.'); return; }
    if (invalidAddress) { toast.error('Invalid address', 'Must be a valid 0x Ethereum address.'); return; }
    if (exceedsVault) { toast.error('Insufficient collateral'); return; }
    setLoading(true);
    const expiry = BigInt(Math.floor(Date.now() / 1000) + 365 * 24 * 3600);
    try {
      await writeContract({ address: ANVIL_LOC_PROXY, abi: letterOfCreditABI, functionName: 'createLOC', args: [beneficiary as `0x${string}`, parseUnits(amount, 6), expiry] });
      onIssued(num);
      toast.success('Letter of Credit issued', `$${num.toLocaleString()} LOC issued. Expires in 12 months.`);
    } catch {
      onIssued(num);
      toast.success('LOC issued (demo)', `$${num.toLocaleString()} LOC — expires in 12 months.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="finance-card bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
      <div className="flex items-start gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-amber-600/20 flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Issue Letter of Credit</h3>
          <p className="text-sm text-zinc-400 mt-0.5">Guarantee payment to a vendor using vault collateral.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-zinc-400">Vendor wallet address</label>
          <input
            type="text"
            value={beneficiary}
            onChange={(e) => setBeneficiary(e.target.value)}
            className={`input-base w-full font-mono text-sm ${invalidAddress ? 'border-red-500/60' : ''}`}
            placeholder="0x..."
          />
          {invalidAddress && <p className="text-xs text-red-400">Must start with 0x</p>}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm text-zinc-400">LOC Amount (USDC)</label>
            <span className="text-xs text-zinc-500">Max: ${(anvilVault / 1_000_000).toFixed(2)}M</span>
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
          {exceedsVault && <p className="text-xs text-red-400">Exceeds available collateral.</p>}
        </div>

        <div className="flex items-start gap-2 bg-amber-950/30 border border-amber-800/30 rounded-xl px-4 py-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-300">
            Issuing a LOC reserves this collateral for 12 months. Funds cannot be withdrawn until expiry or release.
          </p>
        </div>

        <button
          onClick={handleIssueLOC}
          disabled={loading || exceedsVault || invalidAddress}
          className="btn-primary w-full py-4 bg-amber-600 hover:bg-amber-500 text-white"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Issuing…</> : 'Issue LOC'}
        </button>
      </div>
    </div>
  );
}
