import { http, createConfig } from "wagmi";
import { polygon } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

const WALLETCONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WC_PROJECT_ID || "demo";

export const wagmiConfig = createConfig({
  chains: [polygon],
  connectors: [
    injected(),
    walletConnect({ projectId: WALLETCONNECT_PROJECT_ID }),
  ],
  transports: {
    [polygon.id]: http("https://polygon-bor-rpc.publicnode.com"),
  },
  ssr: true,
});
