interface Props {
  anvilVault: number;
  ondoUSDY: number;
  monthlyYield: number;
  anvilReserved: number;
}

export default function MetricsBar({ anvilVault, ondoUSDY, monthlyYield, anvilReserved }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
      <div className="finance-card bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
        <div className="text-zinc-400 text-sm">Anvil Vault Collateral</div>
        <div className="text-3xl font-semibold tabular-nums mt-2">
          ${(anvilVault / 1_000_000).toFixed(2)}M
        </div>
      </div>

      <div className="finance-card bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
        <div className="text-zinc-400 text-sm">Ondo USDY Position</div>
        <div className="text-3xl font-semibold tabular-nums mt-2 text-blue-400">
          ${(ondoUSDY / 1_000_000).toFixed(2)}M
        </div>
      </div>

      <div className="finance-card bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
        <div className="text-zinc-400 text-sm">Monthly Yield</div>
        <div className="text-3xl font-semibold tabular-nums mt-2 text-emerald-400">
          ${monthlyYield.toLocaleString()}
        </div>
      </div>

      <div className="finance-card bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
        <div className="text-zinc-400 text-sm">Available for Upgrades</div>
        <div className="text-3xl font-semibold tabular-nums mt-2">
          ${((anvilVault + ondoUSDY - anvilReserved) / 1_000_000).toFixed(2)}M
        </div>
      </div>
    </div>
  );
}
