"use client";

import "@rainbow-me/rainbowkit/styles.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import {
  Chain,
  // arbitrum,
  // base,
  // mainnet,
  // optimism,
  // polygon,
  celo,
  // zora,
} from "wagmi/chains";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";

const customCelo: Chain = {
  ...celo,
  rpcUrls: {
    default: {
      http: ["https://forno.celo.org"],
    },
  },
};
const config = getDefaultConfig({
  appName: "RainbowKit App",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID as string,
  chains: [
    customCelo,
    ...(process.env.NEXT_PUBLIC_WALLETCONNECT_ID === "true" ? [celo] : []),
  ],
  ssr: true,
});

const client = new QueryClient();

function MyApp({ children }: any) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
