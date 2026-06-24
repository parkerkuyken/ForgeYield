# ForgeYield

Medical facility maintenance cost management via yield-generating assets.

Built with Next.js 14, Wagmi v2, RainbowKit, Ondo Finance (USDY), and Anvil Protocol.

## Project structure

```
forgeyield/
├── app/
│   ├── layout.tsx          # Root layout — wraps app in Wagmi + RainbowKit providers
│   ├── page.tsx            # Main page — holds shared state, assembles all panels
│   └── globals.css         # Tailwind base styles
├── components/
│   ├── MetricsBar.tsx      # Top row: vault, USDY, yield, available totals
│   ├── DepositPanel.tsx    # Deposit USDC into Anvil vault
│   ├── OndoPanel.tsx       # Convert vault funds → Ondo USDY
│   ├── LOCPanel.tsx        # Issue Letter of Credit via Anvil
│   ├── CostCalculator.tsx  # Equipment coverage calculator (no wallet needed)
│   └── YieldSweepPanel.tsx # Automated monthly yield sweeps + history
├── lib/
│   └── abis.ts             # Smart contract ABIs
├── wagmi.config.ts         # Contract addresses + Wagmi client config
├── package.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
└── tsconfig.json
```

## Quick start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Add your WalletConnect project ID** (free at https://cloud.walletconnect.com)
   
   Open `wagmi.config.ts` and replace `YOUR_WALLETCONNECT_PROJECT_ID`.

3. **Run the dev server**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Notes

- The demo works without a wallet connected — the "Simulate" button on sweeps and all calculators run in local state.
- Contract addresses in `wagmi.config.ts` are placeholders. Replace with real Anvil/Ondo addresses before going live.
- All transactions fall back gracefully to demo mode if they fail (no wallet, wrong network, etc.).
# ForgeYield
# ForgeYield
