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
} from "./data";
import { Abi } from "viem";
import { useState } from "react";
import { Modal } from "./ui/Modal";

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
  const hyperstakerContract = useWriteContract();
  const hyperfundContract = useWriteContract();
  const hyperminterWrite = useWriteContract();
  const config = useConfig();

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

  const handleStakeFraction = async (fractionId: string) => {
    try {
      await setApprovalForAll(hyperstaker as `0x${string}`);
      const tx = await hyperstakerContract.writeContractAsync({
        address: hyperstaker as `0x${string}`,
        abi: hyperstakerAbi as Abi,
        functionName: "stake",
        args: [fractionId],
      });

      setTxHash(tx);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  const handleUnStakeFraction = async (fractionId: string) => {
    try {
      const tx = await hyperstakerContract.writeContractAsync({
        address: hyperstaker as `0x${string}`,
        abi: hyperstakerAbi as Abi,
        functionName: "unstake",
        args: [fractionId],
      });

      setTxHash(tx);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  const handleRetireFraction = async (fractionId: string, token: string) => {
    try {
      await setApprovalForAll(hyperfund as `0x${string}`);
      const tx = await hyperfundContract.writeContractAsync({
        address: hyperfund as `0x${string}`,
        abi: hyperfundAbi as Abi,
        functionName: "redeem",
        args: [fractionId, token],
      });

      setTxHash(tx);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Transaction failed:", error);
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
            <div className="p-2 mr-16  flex-1">
              <h3>{project?.name}</h3>
              <div className="mb-2">
                <p className="h-10 text-sm dark:text-gray-300">
                  <Skeleton isLoading={isLoading} className="w-full">
                    {project?.longDescription || project?.longDescription}
                  </Skeleton>
                </p>
              </div>
              {/* <div className="mb-24">
                <Skeleton isLoading={isLoading} className="w-full">
                  <div className="">
                    <h5 className="mt-8">
                      Funds raised <span className="float-right">40%</span>
                    </h5>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div
                        style={{ width: "45%" }}
                        className="mb-4 bg-blue-600 h-2.5 rounded-full"
                      ></div>
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <div className="text-sm font-medium text-gray-100">
                            Past Funding
                          </div>
                          <div className="text-2xl font-bold text-gray-200">
                            1.2 ETH
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-medium text-gray-100">
                            Target
                          </div>
                          <div className="text-2xl font-bold text-gray-300">
                            40 ETH
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-200">
                            Retro split
                          </div>
                          <div className="text-2xl font-bold text-gray-300">
                            20%
                          </div>
                        </div>
                      </div>
                      <div className="clear-both"></div>
                    </div>
                    <div className="clear-both"></div>
                  </div>
                </Skeleton>
              </div> */}
              {/* <Skeleton isLoading={isLoading} className="w-[100px]">
                <ImpactCategories tags={metadata?.data?.impactCategory} />
              </Skeleton> */}
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
                      {/* Example staked item - Replace with actual data mapping */}
                      {stakedFractions.map((s) => (
                        <div
                          className="flex items-center justify-between p-3 bg-gray-600 dark:bg-gray-800 rounded"
                          key={s}
                        >
                          <div>
                            <p className="font-medium">
                              Fraction ID: {s.slice(0, 5)}...{s.slice(-5)}
                            </p>
                            {/* <p className="text-sm text-gray-200">
                            Yield: 0.5 ETH
                          </p> */}
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
                      {/* Example unstaked item - Replace with actual data mapping */}
                      {unstakedFractions.map((f, idx) => (
                        <div
                          className="flex items-center justify-between p-3 bg-gray-600 dark:bg-gray-800 rounded"
                          key={f}
                        >
                          <div>
                            <p className="font-medium">
                              Fraction ID: {f.slice(0, 5)}...{f.slice(-5)}
                            </p>
                            <p>
                              Units:{" "}
                              {fractionUnits.data
                                ? (fractionUnits?.data[idx].result as bigint)
                                : 0}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              onClick={() => handleStakeFraction(f)}
                            >
                              Stake
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                const tokenAddress = prompt(
                                  "Enter token address:"
                                );
                                if (tokenAddress) {
                                  handleRetireFraction(f, tokenAddress);
                                }
                              }}
                            >
                              Retire
                            </Button>
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
                      {/* Example retirable item - Replace with actual data mapping */}
                      <div className="flex items-center justify-between p-3 bg-gray-600 dark:bg-gray-800 rounded">
                        <div>
                          <p className="font-medium">
                            {nonFinancialContributions?.toString()} units
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
          <h3 className="text-black text-lg font-medium mb-4">
            Transaction Successful!
          </h3>
          <p className="text-gray-600 mb-4">Transaction Hash:</p>
          <p className="break-all text-sm bg-gray-100 p-2 rounded">{txHash}</p>
          <Button className="mt-4" onClick={() => setShowSuccessModal(false)}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
}
