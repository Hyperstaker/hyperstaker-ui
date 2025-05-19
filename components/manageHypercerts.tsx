"use client";
import { ProjectAvatar } from "./ProjectAvatar";
import { ProjectBanner } from "./ProjectBanner";
import { Skeleton } from "./ui/Skeleton";
import { Button } from "./ui/Button";
import Project from "../interfaces/Project";
import Metadata from "../interfaces/Metadata";
import {
  useWriteContract,
  useAccount,
  useConfig,
  useReadContracts,
} from "wagmi";
import { readContract } from "@wagmi/core";
import {
  contracts,
  hypercertMinterAbi,
  hyperfundAbi,
  hyperstakerAbi,
  erc20ContractABI,
} from "./data";
import { Abi } from "viem";
import { useState } from "react";
import { Modal } from "./ui/Modal";
import { getTransactionExplorerUrl } from "@/explorer";

export default function ManageHypercert({
  project,
  isLoading,
  hyperfund,
  hyperstaker,
  unstakedFractions,
  stakedFractions,
  nonFinancialContributions,
}: {
  project: Project;
  metadata: Metadata;
  isLoading: boolean;
  hyperfund: string;
  hyperstaker: string;
  unstakedFractions: string[];
  stakedFractions: string[];
  nonFinancialContributions: bigint | number;
}) {
  const account = useAccount();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [txStatus, setTxStatus] = useState("");
  const [showInsufficientFundsModal, setShowInsufficientFundsModal] =
    useState(false);
  const [retireAmount, setRetireAmount] = useState<bigint>(BigInt(0));
  const hyperstakerContract = useWriteContract();
  const hyperfundContract = useWriteContract();
  const hyperminterWrite = useWriteContract();
  const config = useConfig();
  const [isStaking, setIsStaking] = useState<string>("");
  const [isRetiring, setIsRetiring] = useState<string>("");

  const poolBalances = useReadContracts({
    contracts: [
      {
        abi: erc20ContractABI,
        address: contracts[account.chain?.id as keyof typeof contracts]
          ?.usdc as `0x${string}`,
        functionName: "balanceOf",
        args: [hyperstaker as `0x${string}`],
      },
      {
        abi: erc20ContractABI,
        address: contracts[account.chain?.id as keyof typeof contracts]
          ?.usdc as `0x${string}`,
        functionName: "balanceOf",
        args: [hyperfund as `0x${string}`],
      },
    ],
  });

  const callAbis = unstakedFractions.map((f) => {
    return {
      abi: hypercertMinterAbi,
      address: contracts[account.chain?.id as keyof typeof contracts]
        ?.hypercertMinterContract as `0x${string}`,
      functionName: "unitsOf",
      args: [BigInt(f)],
    };
  });
  const fractionUnits = useReadContracts({
    contracts: callAbis as any,
  });

  const checkApproved = async (operator: `0x${string}`) => {
    if (account.chainId) {
      const isApproved = await readContract(config, {
        address: contracts[account.chainId as keyof typeof contracts]
          .hypercertMinterContract as `0x${string}`,
        abi: hypercertMinterAbi,
        functionName: "isApprovedForAll",
        args: [account.address, operator],
      });

      return isApproved;
    }
  };

  const setApprovalForAll = async (operator: `0x${string}`) => {
    const isApproved = await checkApproved(operator);

    if (!isApproved) {
      await hyperminterWrite.writeContractAsync({
        abi: hypercertMinterAbi,
        address: contracts[account.chainId as keyof typeof contracts]
          .hypercertMinterContract as `0x${string}`,
        functionName: "setApprovalForAll",
        args: [operator, true],
      });
    }
  };

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const handleStakeFraction = async (fractionId: string) => {
    try {
      setIsStaking(fractionId);
      setTxStatus("pending");

      console.log(hyperstaker);

      await setApprovalForAll(hyperstaker as `0x${string}`);
      await delay(2000); // 2 second delay
      const tx = await hyperstakerContract.writeContractAsync({
        address: hyperstaker as `0x${string}`,
        abi: hyperstakerAbi as Abi,
        functionName: "stake",
        args: [fractionId],
      });

      setTxHash(tx);
      setTxStatus("success");
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Transaction failed:", error);
      setTxStatus("failed");
      setShowSuccessModal(true);
    } finally {
      setIsStaking("");
    }
  };

  const handleUnStakeFraction = async (fractionId: string) => {
    try {
      setTxStatus("pending");
      const tx = await hyperstakerContract.writeContractAsync({
        address: hyperstaker as `0x${string}`,
        abi: hyperstakerAbi as Abi,
        functionName: "unstake",
        args: [fractionId],
      });

      setTxHash(tx);
      setTxStatus("success");
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Transaction failed:", error);
      setTxStatus("failed");
      setShowSuccessModal(true);
    }
  };

  const handleRetireFraction = async (fractionId: string) => {
    try {
      setIsRetiring(fractionId);

      // Get the fraction units
      const fractionUnitsResult = await readContract(config, {
        address: contracts[account.chainId as keyof typeof contracts]
          ?.hypercertMinterContract as `0x${string}`,
        abi: hypercertMinterAbi,
        functionName: "unitsOf",
        args: [BigInt(fractionId)],
      });

      // Get Hyperfund pool balance
      const hyperfundBalance = await readContract(config, {
        address: contracts[account.chainId as keyof typeof contracts]
          ?.usdc as `0x${string}`,
        abi: erc20ContractABI,
        functionName: "balanceOf",
        args: [hyperfund as `0x${string}`],
      });

      // Check if there are sufficient funds
      if (
        BigInt(hyperfundBalance as bigint) <
        BigInt(fractionUnitsResult as bigint)
      ) {
        setRetireAmount(fractionUnitsResult as bigint);
        setShowInsufficientFundsModal(true);
        setIsRetiring("");
        return;
      }

      setTxStatus("pending");
      await setApprovalForAll(hyperfund as `0x${string}`);
      await delay(2000); // 2 second delay
      const tx = await hyperfundContract.writeContractAsync({
        address: hyperfund as `0x${string}`,
        abi: hyperfundAbi as Abi,
        functionName: "redeem",
        args: [
          fractionId,
          contracts[account.chainId as keyof typeof contracts]
            ?.usdc as `0x${string}`,
        ],
      });

      setTxHash(tx);
      setTxStatus("success");
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Transaction failed:", error);
      setTxStatus("failed");
      setShowSuccessModal(true);
    } finally {
      setIsRetiring("");
    }
  };

  return (
    <div className="basis-10/12 mx-auto">
      {/* data-testid={`project-${project.id}`} */}
      <article className=" group rounded-2xl border border-gray-200 p-2 hover:border-primary-500 dark:border-gray-700 dark:hover:border-primary-500">
        <div className="opacity-70 transition-opacity group-hover:opacity-100">
          <ProjectBanner
            profileId={project?.recipient}
            url={project?.bannerUrl}
          />
          <ProjectAvatar
            className="-mt-8 ml-4 rounded-full"
            address={project?.recipient}
            url={project?.avatarUrl}
          />
        </div>
        <div className="px-4">
          <div className="flex">
            <div className="p-2 mr-16 flex-1">
              <h3>{project?.name}</h3>
              <div className="mb-2">
                <p className="h-10 text-sm dark:text-gray-300">
                  <Skeleton isLoading={isLoading} className="w-full">
                    {project?.longDescription || project?.longDescription}
                  </Skeleton>
                </p>
              </div>

              {/* Pool Information Section */}
              <div className="mt-8 space-y-6">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-lg font-medium mb-3">Pool Information</h4>
                  <div className="space-y-2">
                    <p className="text-gray-300">
                      <span className="font-medium">Hyperfund Pool:</span>{" "}
                      {poolBalances?.data
                        ? (
                            parseInt(
                              (
                                poolBalances.data[1]?.result as bigint
                              )?.toString()
                            ) /
                            10 ** 6
                          ).toFixed(2)
                        : 0}{" "}
                      USD
                    </p>
                    <p className="text-gray-300">
                      <span className="font-medium">Hyperstaker Pool:</span>{" "}
                      {poolBalances?.data
                        ? (
                            parseInt(
                              (
                                poolBalances.data[0]?.result as bigint
                              )?.toString()
                            ) /
                            10 ** 6
                          ).toFixed(2)
                        : 0}{" "}
                      USD
                    </p>
                  </div>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-lg font-medium mb-3">
                    Understanding Actions
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium text-gray-200">Staking</h5>
                      <p className="text-sm text-gray-300">
                        When you stake your hypercert, it becomes eligible to
                        earn yields from the project&apos;s success. The longer
                        you stake, the more yields you can earn. You can unstake
                        at any time.
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-200">Unstaking</h5>
                      <p className="text-sm text-gray-300">
                        Unstaking removes your hypercert from earning yields and
                        you will be ineligible for the retroactive rewards. You
                        can choose to stake it again later or retire it to
                        convert to USD.
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-200">Retiring</h5>
                      <p className="text-sm text-gray-300">
                        Retiring burns your hypercert and returns the equivalent
                        amount of funds from the project&apos;s treasury. This
                        is a one-way action - once retired, you cannot stake or
                        transfer the hypercert. Make sure the Hyperfund pool has
                        enough balance before retiring.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="px-4 mt-8">
                <div className="grid grid-cols-1 gap-6">
                  {/* Staked Hypercerts Section */}
                  <section className="border rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-4">
                      My Staked Hypercerts
                    </h2>
                    <div className="space-y-4">
                      {stakedFractions.map((s) => (
                        <div
                          className="flex items-center justify-between p-3 bg-gray-600 dark:bg-gray-800 rounded"
                          key={s}
                        >
                          <div>
                            <p className="font-medium">
                              Fraction ID: {s.slice(0, 5)}...{s.slice(-5)}
                            </p>
                            <p className="text-sm text-gray-300">
                              Units:{" "}
                              {fractionUnits.data
                                ? (fractionUnits?.data[0]?.result as bigint) ||
                                  BigInt(0)
                                : BigInt(0)}
                              (≈{" "}
                              {fractionUnits.data
                                ? (
                                    ((fractionUnits?.data[0]
                                      ?.result as bigint) || BigInt(0)) /
                                    BigInt(10 ** 6)
                                  ).toString()
                                : 0}{" "}
                              USD)
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => handleUnStakeFraction(s)}
                          >
                            Unstake
                          </Button>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Unstaked Hypercerts Section */}
                  <section className="border rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-4">
                      My Unstaked Hypercerts
                    </h2>
                    <div className="space-y-4">
                      {unstakedFractions.map((f, idx) => (
                        <div
                          className="flex items-center justify-between p-3 bg-gray-600 dark:bg-gray-800 rounded"
                          key={f}
                        >
                          <div>
                            <p className="font-medium">
                              Fraction ID: {f.slice(0, 5)}...{f.slice(-5)}
                            </p>
                            <p className="text-sm text-gray-300">
                              Units:{" "}
                              {fractionUnits.data
                                ? (fractionUnits?.data[idx]
                                    ?.result as bigint) || BigInt(0)
                                : BigInt(0)}
                              (≈{" "}
                              {fractionUnits.data
                                ? (
                                    ((fractionUnits?.data[idx]
                                      ?.result as bigint) || BigInt(0)) /
                                    BigInt(10 ** 6)
                                  ).toString()
                                : 0}{" "}
                              USD)
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              className="bg-gray-800 hover:bg-gray-700"
                              onClick={() => handleStakeFraction(f)}
                              disabled={isStaking === f}
                            >
                              {isStaking === f ? "Confirming..." : "Stake"}
                            </Button>
                            {nonFinancialContributions?.toString() != "0" && (
                              <Button
                                variant="outline"
                                className="bg-gray-800 hover:bg-gray-700"
                                onClick={() => handleRetireFraction(f)}
                                disabled={isRetiring === f}
                              >
                                {isRetiring === f ? "Confirming..." : "Retire"}
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Retirable Hypercerts Section */}
                  <section className="border rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-4">
                      Retire Allowance
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-600 dark:bg-gray-800 rounded">
                        <div>
                          <p className="font-medium">
                            {nonFinancialContributions?.toString()} units (≈{" "}
                            {(
                              Number(nonFinancialContributions) /
                              10 ** 6
                            ).toFixed(2)}{" "}
                            USD)
                          </p>
                          <p className="text-sm text-gray-300">
                            Available in Hyperfund:{" "}
                            {poolBalances?.data
                              ? (
                                  parseInt(
                                    (
                                      poolBalances.data[1]?.result as bigint
                                    )?.toString()
                                  ) /
                                  10 ** 6
                                ).toFixed(2)
                              : 0}{" "}
                            USD
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
      <Modal open={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
        <div className="p-6">
          {txStatus === "success" ? (
            <>
              <h3 className="text-lg font-medium mb-4 text-green-500">
                Transaction Successful!
              </h3>
              <p className="text-gray-200 mb-4">Transaction Hash:</p>
              <a
                href={`${getTransactionExplorerUrl(account.chainId, txHash)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-sm bg-gray-700 p-2 rounded text-blue-400 hover:text-blue-300 block mb-4"
              >
                {txHash}
              </a>
            </>
          ) : txStatus === "failed" ? (
            <>
              <h3 className="text-lg font-medium mb-4 text-red-500">
                Transaction Failed
              </h3>
              <p className="text-gray-200 mb-4">Please try again</p>
              <Button
                className="mt-4 bg-red-500 hover:bg-red-600"
                onClick={() => {
                  setShowSuccessModal(false);
                  // Note: We can't automatically retry since we don't know which action failed
                  // The user will need to retry manually
                }}
              >
                Close
              </Button>
            </>
          ) : (
            <h3 className="text-lg font-medium mb-4">Transaction Pending...</h3>
          )}
          {txStatus === "success" && (
            <Button className="mt-4" onClick={() => setShowSuccessModal(false)}>
              Close
            </Button>
          )}
        </div>
      </Modal>

      <Modal
        open={showInsufficientFundsModal}
        onClose={() => setShowInsufficientFundsModal(false)}
      >
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4 text-yellow-500">
            Insufficient Funds in Hyperfund Pool
          </h3>
          <p className="text-gray-200 mb-4">
            The Hyperfund pool does not have enough funds to process your
            retirement request.
          </p>
          <p className="text-gray-300 mb-4">
            Required amount: {(Number(retireAmount) / 10 ** 6).toFixed(2)} USD
          </p>
          <p className="text-gray-300 mb-4">
            Available in pool:{" "}
            {poolBalances?.data
              ? (
                  parseInt(
                    (poolBalances.data[1]?.result as bigint)?.toString()
                  ) /
                  10 ** 6
                ).toFixed(2)
              : 0}{" "}
            USD
          </p>
          <Button
            className="mt-4"
            onClick={() => setShowInsufficientFundsModal(false)}
          >
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
}
