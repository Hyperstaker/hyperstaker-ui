import { useQuery } from "@tanstack/react-query";
import { createConfig, getEnsName } from "@wagmi/core";
import { Address, http } from "viem";
import { mainnet } from "wagmi/chains";

export const EnsName = ({ address }: { address: Address }) => {
  const getEns = async (address: Address) => {
    const ensAddress = getEnsName(
      createConfig({
        chains: [mainnet],
        transports: {
          [mainnet.id]: http(),
        },
      }),
      { address: address as unknown as Address }
    );
    return ensAddress;
  };

  const { isPending, isError, data } = useQuery({
    queryKey: ["ens", address],
    queryFn: () => getEns(address),
  });

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <div>{address}</div>;
  }

  return <div>{data ?? address}</div>;
};
