import { HypercertClient } from "@hypercerts-org/sdk";
import { useWalletClient } from "wagmi";

export const useHypercertClient = () => {
  const { data: walletClient } = useWalletClient();
  const ENVIRONMENT = "production";

  const client = new HypercertClient({
    environment: ENVIRONMENT,
    // @ts-ignore
    walletClient,
  });

  return { client };
};
