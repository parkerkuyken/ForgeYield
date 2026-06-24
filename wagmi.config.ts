import { http, createConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { walletConnect, coinbaseWallet } from 'wagmi/connectors';

// ── Contract addresses (Ethereum mainnet) ──────────────────────────────────
export const ANVIL_COLLATERAL_VAULT = '0x0000000000000000000000000000000000000001' as `0x${string}`;
export const ANVIL_LOC_PROXY        = '0x0000000000000000000000000000000000000002' as `0x${string}`;
export const USDY                   = '0x0000000000000000000000000000000000000003' as `0x${string}`;
export const USDY_INSTANT_MANAGER   = '0x0000000000000000000000000000000000000004' as `0x${string}`;

// ── Wagmi config ───────────────────────────────────────────────────────────
// Using walletConnect + coinbaseWallet instead of injected() to avoid
// the deprecated MetaMask SDK and its React Native dependencies.
export const wagmiConfig = createConfig({
  chains: [mainnet],
  connectors: [
    walletConnect({ projectId: 'YOUR_WALLETCONNECT_PROJECT_ID' }),
    coinbaseWallet({ appName: 'ForgeYield' }),
  ],
  transports: { [mainnet.id]: http() },
});
