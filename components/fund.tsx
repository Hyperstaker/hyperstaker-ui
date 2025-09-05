import React, { useState, useMemo } from "react";
import {
  NativeSelect,
  rem,
  TextInput,
  Slider,
  Button,
  Group,
} from "@mantine/core";
import { ethers } from "ethers";
import {
  type BaseError,
  useWaitForTransactionReceipt,
  useAccount,
  useWriteContract,
  useReadContract,
} from "wagmi";
import { IconExternalLink } from "@tabler/icons-react";

import Project from "../interfaces/Project";
import { getTransactionExplorerUrl } from "../explorer";
import { alloAbi, contracts, erc20ContractABI } from "./data";
import { formatCurrency } from "@/lib/formatters";

interface FundProps {
  project: Project;
  poolId: number;
}

const coinData = [{ value: "USDC", label: "USDC" }];

const presetAmounts = [5, 10, 20, 50, 100];

const Fund: React.FC<FundProps> = ({ project, poolId }) => {
  const { address, chain, isConnected } = useAccount();
  const [selectedToken, setSelectedToken] = useState<string>("USDC");
  const [amount, setAmount] = useState<string>("");
  const {
    data: hash,
    error,
    isPending,
    writeContract,
    writeContractAsync,
  } = useWriteContract();

  // Get contract addresses for the current chain, if supported
  const currentContracts = useMemo(() => {
    if (chain?.id && contracts[chain.id as keyof typeof contracts]) {
      return contracts[chain.id as keyof typeof contracts];
    }
    return null;
  }, [chain?.id]);

  const isUnsupportedNetwork = isConnected && !currentContracts;

  const transactionUrl =
    hash && chain ? getTransactionExplorerUrl(chain.id, hash) : undefined;
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false);

  // Parse project goal (assume project.goal is in USDC, as a number)
  const projectGoal = (project.totalUnits ?? 0) / 10 ** 6; // fallback if not set

  // Helper to parse and format amount
  const parseAmount = (val: string | number) => {
    const n = typeof val === "string" ? parseFloat(val) : val;
    return isNaN(n) ? 0 : n;
  };

  // Update amount and slider together
  const handlePresetClick = (val: number) => {
    setAmount(val.toString());
    setIsButtonEnabled(true);
  };

  const handleSliderChange = (val: number) => {
    setAmount(val.toString());
    setIsButtonEnabled(val > 0 && !isUnsupportedNetwork);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const amountValue = event.target.value;
    setAmount(amountValue);
    setIsButtonEnabled(
      amountValue !== "" &&
        parseAmount(amountValue) > 0 &&
        !isUnsupportedNetwork
    );
  };

  const allowance = useReadContract({
    abi: erc20ContractABI,
    address: currentContracts?.usdc as `0x${string}` | undefined,
    functionName: "allowance",
    args: [address, currentContracts?.alloContract],
    query: {
      enabled: !!currentContracts && !!address,
    },
  });

  const checkAllowance = async () => {
    const refreshedAllowance = await allowance.refetch();
    return refreshedAllowance?.data;
  };

  const approveToken = async (amount: string) => {
    if (!currentContracts) {
      console.error(
        "Cannot approve token: Unsupported network or contracts not loaded."
      );
      return;
    }
    await writeContractAsync({
      abi: erc20ContractABI,
      address: currentContracts.usdc as `0x${string}`,
      functionName: "approve",
      args: [currentContracts.alloContract, amount],
    });
  };

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!currentContracts || isUnsupportedNetwork) {
      console.error("Cannot submit: Unsupported network.");
      return;
    }

    const value = ethers.parseUnits(amount, 6); // 6 decimals in USDC

    const currentAllowance = await checkAllowance();
    if (
      currentAllowance === undefined ||
      (typeof currentAllowance !== "string" &&
        typeof currentAllowance !== "number" &&
        typeof currentAllowance !== "bigint")
    ) {
      console.error("Invalid allowance value:", currentAllowance);
      return;
    }

    if (BigInt(currentAllowance) < BigInt(value)) {
      try {
        await approveToken(value.toString());
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (approvalError) {
        console.error("Failed to approve token:", approvalError);
        return;
      }
    }

    try {
      writeContract({
        abi: alloAbi,
        address: currentContracts.alloContract as `0x${string}`,
        functionName: "fundPool",
        args: [poolId, value],
      });
    } catch (fundError) {
      console.error("Failed to initiate fundPool transaction:", fundError);
    }
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
              Hyperstaker has allocated 50% of it&apos;s hypercert to the donors
              of this round, and the other half of this will go to the project
              contributors. The hypercert will be distributed relative to the
              amount donated.
            </p>
            {/* Preset donation buttons */}
            <Group mb="xs">
              {presetAmounts.map((val) => (
                <Button
                  key={val}
                  variant={parseAmount(amount) === val ? "filled" : "outline"}
                  onClick={() => handlePresetClick(val)}
                  size="sm"
                >
                  {formatCurrency(val)}
                </Button>
              ))}
            </Group>
            {/* Slider for donation amount */}
            <div style={{ margin: "16px 0" }}>
              <Slider
                min={0}
                max={projectGoal}
                step={1}
                value={parseAmount(amount)}
                onChange={handleSliderChange}
                label={(val) => `$${val}`}
                style={{ width: 300 }}
              />
            </div>
            {/* Custom amount input */}
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
                label="Custom amount"
                rightSection={select}
                rightSectionWidth={92}
                onChange={handleAmountChange}
                value={amount}
                min={0}
                max={projectGoal}
                placeholder={`Enter ${selectedToken} amount`}
                style={{ width: 300 }}
              />
              {isConnected && !isUnsupportedNetwork && (
                <button
                  className="p-2 mt-6 ml-2 text-white rounded-md bg-blue-500 disabled:opacity-50"
                  disabled={isPending || !isButtonEnabled}
                  type="submit"
                >
                  {isPending ? "Confirming..." : "Send"}
                </button>
              )}
              {!isConnected && (
                <p className="mt-8 ml-2">Connect your wallet to continue</p>
              )}
              {isUnsupportedNetwork && (
                <p className="mt-8 ml-2 text-red-500">
                  Unsupported network. Please connect to Celo.
                </p>
              )}
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
                  <a
                    href={transactionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View transaction on explorer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <IconExternalLink size={20} />
                    <span>View your transaction</span>
                  </a>
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
        {error && (
          <div>Error: {(error as BaseError).shortMessage || error.message}</div>
        )}
      </div>
    </form>
  );
};
export default Fund;
