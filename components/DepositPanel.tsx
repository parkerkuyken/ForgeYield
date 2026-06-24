'use client';

import { useState } from 'react';
import { Vault } from 'lucide-react';
import { useAccount, useWriteContract } from 'wagmi';
import { parseUnits } from 'viem';
import { ANVIL_COLLATERAL_VAULT } from '../wagmi.config';
import { erc20ABI, collateralVaultABI } from '../lib/abis';

const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as `0x${string}`;

interface Props {
  onDeposited: (amount: number) => void;
}

export default function DepositPanel({ onDeposited }: Props) {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [amount, setAmount] = useState('5000000');

  const handleDeposit = async () => {
    if (!address) return alert('Connect wallet');
    const parsed = parseUnits(amount, 6);

    try {
      await writeContract({
        address: USDC_ADDRESS,
        abi: erc20ABI,
        functionName: 'approve',
        args: [ANVIL_COLLATERAL_VAULT, parsed],
      });
      await writeContract({
        address: ANVIL_COLLATERAL_VAULT,
        abi: collateralVaultABI,
        functionName: 'deposit',
        args: [USDC_ADDRESS, parsed],
      });
      onDeposited(Number(amount));
      alert('✅ Deposited to Anvil Vault');
    } catch {
      alert('Transaction failed (demo mode)');
    }
  };

  return (
    <div className="finance-card bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
        <Vault className="text-emerald-400" /> Deposit to Anvil Vault
      </h3>
      <div className="flex gap-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="flex-1 bg-zinc-950 border border-zinc-700 rounded-2xl px-5 py-4 font-mono"
          placeholder="Amount in USDC"
        />
        <button
          onClick={handleDeposit}
          className="px-10 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-semibold"
        >
          Deposit
        </button>
      </div>
    </div>
  );
}
