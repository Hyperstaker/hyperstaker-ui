import React, { useState } from "react";
import { NativeSelect, rem, TextInput } from "@mantine/core";
import {
  type BaseError,
  useWaitForTransactionReceipt,
  useAccount,
  useWriteContract,
  useReadContract,
} from "wagmi";

import Project from "../interfaces/Project";
import { getTransactionExplorerUrl } from "../explorer";
import { alloAbi, contracts, erc20ContractABI } from "./data";

interface FundProps {
  project: Project;
  poolId: number;
}

const coinData = [{ value: "USDC", label: "USDC" }];

const Fund: React.FC<FundProps> = ({ project, poolId }) => {
  const { address, chain, isConnected } = useAccount();
  const [selectedToken, setSelectedToken] = useState<string>("USDC");
  const [amount, setAmount] = useState<string>("");
  const { data: hash, error, isPending, writeContract } = useWriteContract();
  const erc20Contract = useWriteContract();

  const transactionUrl =
    hash && chain ? getTransactionExplorerUrl(chain.id, hash) : undefined;
  const [, setIsButtonEnabled] = useState<boolean>(false);
  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const amountValue = event.target.value;
    setAmount(amountValue);
    setIsButtonEnabled(amountValue !== "");
  };

  const allowance = useReadContract({
    abi: erc20ContractABI,
    address: contracts[chain?.id as keyof typeof contracts]
      ?.usdc as `0x${string}`,
    functionName: "allowance",
    args: [
      address,
      contracts[chain?.id as keyof typeof contracts]?.alloContract,
    ],
  });

  const checkAllowance = async () => {
    return allowance.data;
  };

  const approveToken = async () => {
    await erc20Contract.writeContractAsync({
      abi: erc20ContractABI,
      address: contracts[chain?.id as keyof typeof contracts]
        .usdc as `0x${string}`,
      functionName: "approve",
      args: [
        contracts[chain?.id as keyof typeof contracts].alloContract,
        amount,
      ],
    });
  };

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = amount;

    const allowance = await checkAllowance();
    if (Number(allowance) < Number(value)) {
      await approveToken();
    }

    writeContract({
      abi: alloAbi,
      address: contracts[chain?.id as keyof typeof contracts]
        .alloContract as `0x${string}`,
      functionName: "fundPool",
      args: [poolId, value],
    });
  }
  const handleTokenChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedToken(event.target.value);
  };
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });
  const select = (
    <NativeSelect
      data={coinData}
      rightSectionWidth={28}
      styles={{
        input: {
          fontWeight: 500,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          width: rem(92),
          marginRight: rem(-2),
        },
      }}
      onChange={handleTokenChange}
    />
  );

  return (
    <form onSubmit={submit}>
      <div className="space-y-4 space-x-4">
        {!hash && (
          <>
            <h4>Prospectively fund this project</h4>
            <p>
              Hyperstaker as allocated 20% of it&apos;s level 1 hypercert to
              this round, and half of this will go to early stage funders, and
              they will be distributed relative to the amount donated.
            </p>
            <div className="flex flex-row">
              <input
                type="hidden"
                name="address"
                placeholder={project.recipient}
                required
                value={project.recipient}
              />
              <TextInput
                type="number"
                label="How much would you like to donate?"
                rightSection={select}
                rightSectionWidth={92}
                onChange={handleAmountChange}
                placeholder={`Enter ${selectedToken} amount`}
              />
              {isConnected && (
                <button
                  className="p-2 mt-6 ml-2 text-white rounded-md bg-blue-500"
                  disabled={isPending}
                  type="submit"
                >
                  {isPending ? "Confirming..." : "Send"}
                </button>
              )}
              {!isConnected && <p>Connect your wallet to contiue</p>}
            </div>
          </>
        )}
        {hash && (
          <div className="pt-4">
            <h3>🎉 Success!</h3>
            <p>Thank you for supporting this project!</p>
            <div>
              {transactionUrl && (
                <span>
                  <a href={transactionUrl}></a>View your transactions here:{" "}
                  {hash}
                </span>
              )}
            </div>
            <h4>This project&apos;s funding life cycle</h4>
            <h5 className="hyper">Step 1</h5>
            <p className="hyper">
              You have just donated to this public goods project
            </p>
            <h5>Step 2</h5>
            <p>The project reaches the complete funding round</p>
            <h5>Step 3</h5>
            <p>Project is funded</p>
          </div>
        )}
        {isConfirming && <div>Waiting for confirmation...</div>}
        {isConfirmed && <div>Transaction confirmed.</div>}
        {error && (
          <div>Error: {(error as BaseError).shortMessage || error.message}</div>
        )}
      </div>
    </form>
  );
};
export default Fund;
