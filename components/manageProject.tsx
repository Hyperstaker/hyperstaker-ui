"use client";
import { ProjectAvatar } from "./ProjectAvatar";
import { ProjectBanner } from "./ProjectBanner";
import { Skeleton } from "./ui/Skeleton";
import Project from "../interfaces/Project";
import Metadata from "../interfaces/Metadata";
import { TextField } from "./ui/TextField";
import { useForm } from "react-hook-form";
import { useReadContract, useWriteContract, useAccount } from "wagmi";
import { alloAbi, contracts, erc20ContractABI, hyperfundAbi } from "./data";
import { Abi, encodeAbiParameters } from "viem";
import { Button } from "./ui/Button";
import AllocateForm from "./allocate.js";
import { useState, useEffect } from "react";
import { Modal } from "./ui/Modal";

export default function ManageProject({
  project,
  isLoading,
  hyperfund,
  hyperstaker,
  poolId,
  strategyAddress,
}: {
  project: Project;
  metadata: Metadata;
  isLoading: boolean;
  hyperfund: string;
  hyperstaker: string;
  poolId: number;
  strategyAddress: `0x${string}`;
}) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [txHash, setTxHash] = useState("");
  const assetForm = useForm();
  const contract = useWriteContract();
  const [isListed, setIsListed] = useState<boolean | null>(null);
  const [allocateHyperfund, setAllocateHyperfund] = useState(0);
  const [allocateHyperstaker, setAllocateHyperstaker] = useState(0);
  const [usdRaised, setUsdRaised] = useState(0);
  const [raisePercent, setRaisePercent] = useState(0);

  const { chain } = useAccount();

  const strategyBalance = useReadContract({
    abi: erc20ContractABI,
    address: contracts[chain?.id as keyof typeof contracts]
      ?.usdc as `0x${string}`,
    functionName: "balanceOf",
    args: [strategyAddress],
  });

  useEffect(() => {
    const checkListingStatus = async () => {
      try {
        const response = await fetch("/api/checkProjectListing", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ hypercertId: project.slug.split("-")[2] }),
        });

        if (!response.ok) {
          throw new Error("Failed to check project listing");
        }

        const data = await response.json();
        setIsListed(data.listed);
      } catch (error) {
        console.error("Error checking listing status:", error);
      }
    };

    checkListingStatus();
  }, [project.slug]);

  useEffect(() => {
    const updateDonations = async () => {
      const nonFinancialUnits = await getTotalFinancialContributions(poolId);

      setUsdRaised(nonFinancialUnits / 10 ** 6);
      setRaisePercent((nonFinancialUnits * 100) / (project.totalUnits ?? 1));
    };

    if (poolId != 0) {
      updateDonations();
    }
  }, [poolId]);

  async function getTotalFinancialContributions(poolId: number) {
    const response = await fetch(
      process.env.NEXT_PUBLIC_HYPERINDEXER_ENDPOINT as unknown as URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
          query MyQuery {
            totalFinancialContributionsToPool(poolId: "${poolId}") {
              totalHypercertUnits
              poolId
            }
          }
        `,
        }),
      }
    );

    const data = await response.json();
    // TODO: Add additional verification to ensure that fractions are still staked
    const units =
      data.data?.totalFinancialContributionsToPool?.totalHypercertUnits ?? 0;
    return units;
  }

  const handleAddAddress = async () => {
    try {
      const newAsset = assetForm.getValues("address");
      const multiplier = assetForm.getValues("multiplier");

      const tx = await contract.writeContractAsync({
        address: hyperfund as `0x${string}`,
        abi: hyperfundAbi as Abi,
        functionName: "allowlistToken",
        args: [newAsset, multiplier],
      });

      assetForm.reset();
      setTxHash(tx);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  const handleListOnMarketplace = async () => {
    try {
      const response = await fetch("/api/updateProjectListing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hypercertId: project.slug.split("-")[2],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to list project on marketplace");
      }

      const data = await response.json();
      setIsListed(true);
      console.log("Project listed successfully:", data);
    } catch (error) {
      console.error("Error listing project:", error);
    }
  };

  const handleUnlistProject = async () => {
    try {
      const response = await fetch("/api/unlistProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hypercertId: project.slug.split("-")[2] }),
      });

      if (!response.ok) {
        throw new Error("Failed to unlist project");
      }

      const data = await response.json();
      console.log("Project unlisted successfully:", data);
      setIsListed(false); // Update state to reflect unlisted status
    } catch (error) {
      console.error("Error unlisting project:", error);
    }
  };

  const handleAllocateFunds = async () => {
    try {
      const allocationData = encodeAbiParameters(
        [
          { name: "recipients", type: "address[]" },
          { name: "amounts", type: "uint256[]" },
        ],
        [
          [hyperfund as `0x${string}`, hyperstaker as `0x${string}`],
          [
            BigInt(allocateHyperfund * 10 ** 6),
            BigInt(allocateHyperstaker * 10 ** 6),
          ],
        ]
      );
      const tx = await contract.writeContractAsync({
        address: contracts[chain?.id as keyof typeof contracts]
          ?.alloContract as `0x${string}`,
        abi: alloAbi as Abi,
        functionName: "allocate",
        args: [poolId, allocationData],
      });

      assetForm.reset();
      setTxHash(tx);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error allocating funds:", error);
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
            rounded="full"
            className="-mt-8 ml-4"
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
              <div className="mb-24">
                <Skeleton isLoading={isLoading} className="w-full">
                  <div className="">
                    <h5 className="mt-8">
                      Funds raised{" "}
                      <span className="float-right">{raisePercent}%</span>
                    </h5>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div
                        style={{ width: raisePercent.toString() + "%" }}
                        className="mb-4 bg-blue-600 h-2.5 rounded-full"
                      ></div>
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <div className="text-sm font-medium text-gray-100">
                            Past Funding
                          </div>
                          <div className="text-2xl font-bold text-gray-200">
                            {usdRaised} USD
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-medium text-gray-100">
                            Target
                          </div>
                          <div className="text-2xl font-bold text-gray-300">
                            {(project.totalUnits ?? 0) / 10 ** 6} USD
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
              </div>
              <div className="mb-5">
                {isListed === null ? (
                  <p>Loading...</p>
                ) : isListed ? (
                  <Button type="button" onClick={handleUnlistProject}>
                    Unlist Project
                  </Button>
                ) : (
                  <Button type="button" onClick={handleListOnMarketplace}>
                    List on Marketplace
                  </Button>
                )}
              </div>
              <div className="mb-5">
                <h4>Add Supported Assets</h4>
                <div>
                  <TextField
                    label="Address"
                    fullWidth
                    margin="normal"
                    {...assetForm.register("address", {
                      required: true,
                    })}
                  />
                </div>
                <div>
                  <TextField
                    label="Multiplier"
                    fullWidth
                    margin="normal"
                    {...assetForm.register("multiplier", {
                      required: true,
                    })}
                  />
                </div>
                <div>
                  <Button type="button" onClick={handleAddAddress}>
                    Add Token
                  </Button>
                </div>
              </div>
              <div>
                <h4>Allocate Funds</h4>
                <p>
                  Available Pool Funds:{" "}
                  {(strategyBalance?.data
                    ? parseInt(strategyBalance.data.toString())
                    : 0) /
                    10 ** 6}{" "}
                  USD
                </p>
                <div>
                  <TextField
                    label="Amount to Allocate to Hyperfund (USD)"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={allocateHyperfund}
                    onChange={(e) =>
                      setAllocateHyperfund(Number(e.target.value))
                    }
                  />
                </div>
                <div>
                  <TextField
                    label="Amount to Allocate to Hyperstaker (USD)"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={allocateHyperstaker}
                    onChange={(e) =>
                      setAllocateHyperstaker(Number(e.target.value))
                    }
                  />
                </div>
                <div>
                  <Button type="button" onClick={handleAllocateFunds}>
                    Allocate Funds
                  </Button>
                </div>
              </div>

              {/* <Skeleton isLoading={isLoading} className="w-[100px]">
                <ImpactCategories tags={metadata?.data?.impactCategory} />
              </Skeleton> */}
            </div>
            <div className="flex-1">
              <AllocateForm hyperfund={hyperfund} />
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
