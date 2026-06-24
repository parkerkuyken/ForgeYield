'use client';

import { useState } from 'react';
import { FileText } from 'lucide-react';
import { useAccount, useWriteContract } from 'wagmi';
import { parseUnits } from 'viem';
import { ANVIL_LOC_PROXY } from '../wagmi.config';
import { letterOfCreditABI } from '../lib/abis';

interface Props {
  anvilVault: number;
  onIssued: (amount: number) => void;
}

export default function LOCPanel({ anvilVault, onIssued }: Props) {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [beneficiary, setBeneficiary] = useState('0xCaterpillarFinancial...');
  const [amount, setAmount] = useState('8500000');

  const handleIssueLOC = async () => {
    if (!address) return alert('Connect wallet');
    if (Number(amount) > anvilVault) return alert('Insufficient collateral');
    const parsed = parseUnits(amount, 6);
    const expiry = BigInt(Math.floor(Date.now() / 1000) + 365 * 24 * 3600);

    try {
      await writeContract({
        address: ANVIL_LOC_PROXY,
        abi: letterOfCreditABI,
        functionName: 'createLOC',
        args: [beneficiary as `0x${string}`, parsed, expiry],
      });
      onIssued(Number(amount));
      alert('✅ LOC Issued via Anvil');
    } catch {
      alert('Transaction failed (demo mode)');
    }
  };

  return (
    <div className="finance-card bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
        <FileText className="text-amber-400" /> Issue Letter of Credit (Anvil)
      </h3>
      <div className="space-y-4">
        <input
          type="text"
          value={beneficiary}
          onChange={(e) => setBeneficiary(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-5 py-4"
          placeholder="Beneficiary address"
        />
        <div className="flex gap-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 bg-zinc-950 border border-zinc-700 rounded-2xl px-5 py-4 font-mono"
          />
          <button
            onClick={handleIssueLOC}
            className="px-10 bg-amber-600 hover:bg-amber-500 rounded-2xl font-semibold"
          >
            Issue LOC
          </button>
        </div>
      </div>
    </div>
  );
}
