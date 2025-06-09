"use client";
import { ProjectAvatar } from "./ProjectAvatar";
import { ProjectBanner } from "./ProjectBanner";
import Project from "../interfaces/Project";
import Metadata from "../interfaces/Metadata";
import { TextField } from "./ui/TextField";
import { useForm } from "react-hook-form";
import { useWriteContract, useAccount, useReadContracts } from "wagmi";
import { alloAbi, contracts, erc20ContractABI, hyperfundAbi } from "./data";
import { Abi, encodeAbiParameters } from "viem";
import { Button } from "./ui/Button";
import AllocateForm from "./allocate.js";
import { useState, useEffect } from "react";
import { Modal } from "./ui/Modal";
import { getTransactionExplorerUrl } from "@/explorer";
import { useRouter } from "next/navigation";

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
  const [txStatus, setTxStatus] = useState("");
  const assetForm = useForm();
  const contract = useWriteContract();
  const [isListed, setIsListed] = useState<boolean | null>(null);
  const [allocateHyperfund, setAllocateHyperfund] = useState(0);
  const [allocateHyperstaker, setAllocateHyperstaker] = useState(0);
  const [usdRaised, setUsdRaised] = useState(0);
  const [raisePercent, setRaisePercent] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();
  const { chain } = useAccount();

  const poolBalances = useReadContracts({
    contracts: [
      {
        abi: erc20ContractABI,
        address: contracts[chain?.id as keyof typeof contracts]
          ?.usdc as `0x${string}`,
        functionName: "balanceOf",
        args: [strategyAddress],
      },
      {
        abi: erc20ContractABI,
        address: contracts[chain?.id as keyof typeof contracts]
          ?.usdc as `0x${string}`,
        functionName: "balanceOf",
        args: [hyperstaker],
      },
      {
        abi: erc20ContractABI,
        address: contracts[chain?.id as keyof typeof contracts]
          ?.usdc as `0x${string}`,
        functionName: "balanceOf",
        args: [hyperfund],
      },
    ],
  });

  useEffect(() => {
    const checkListingStatus = async () => {
      try {
        const response = await fetch("/api/checkProjectListing", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ hypercertId: project.slug?.split("-")[2] }),
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
    const response = await fetch("/api/getTotalFinancialContributions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ poolId }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch financial contributions");
    }

    const data = await response.json();
    return data.units;
  }

  const handleAddAddress = async () => {
    try {
      setTxStatus("pending");
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
      setTxStatus("success");
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Transaction failed:", error);
      setTxStatus("failed");
      setShowSuccessModal(true);
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
      setTxStatus("pending");
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
      setTxStatus("success");
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error allocating funds:", error);
      setTxStatus("failed");
      setShowSuccessModal(true);
    }
  };

  const deleteProjectTab = (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-4">Delete Project</h3>
      <div className="space-y-4">
        <div className="bg-red-900/20 p-4 rounded-lg mb-6">
          <h4 className="text-lg font-medium mb-2 text-red-500">Warning</h4>
          <p className="text-gray-300 mb-3">
            Deleting a project is an irreversible action. This will:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Remove the project from the marketplace</li>
            <li>Hide the project from public view</li>
            <li>Prevent further contributions</li>
          </ul>
          <p className="text-gray-300 mt-3">
            Please ensure you have backed up any important project data before
            proceeding.
          </p>
        </div>
        <Button
          className="w-full bg-red-600 hover:bg-red-700"
          onClick={() => setShowDeleteModal(true)}
        >
          Delete Project
        </Button>
      </div>
    </div>
  );

  const handleDeleteProject = async () => {
    try {
      const response = await fetch("/api/deleteProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hypercertId: project.slug.split("-")[2],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      const data = await response.json();
      console.log("Project deleted successfully:", data);
      setShowDeleteModal(false);
      router.push("/organizations");
      // You might want to redirect or show a success message here
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const aboutTab = (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-4">About</h3>
      <div className="mb-6">
        <p className="text-md dark:text-gray-300">
          {project?.longDescription || project?.shortDescription}
        </p>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-medium mb-2">Project Details</h4>
        <div className="space-y-2">
          <p className="text-sm dark:text-gray-300">
            <span className="font-medium">Recipient:</span> {project?.recipient}
          </p>
        </div>
      </div>

      <div className="mt-4">
        {isListed === null ? (
          <p>Loading...</p>
        ) : (
          <Button
            className="w-full"
            onClick={isListed ? handleUnlistProject : handleListOnMarketplace}
          >
            {isListed ? "Unlist Project" : "List on Marketplace"}
          </Button>
        )}
      </div>
    </div>
  );

  const fundsRaisedTab = (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-4">Funds Raised</h3>
      <div className="space-y-4">
        <h5>
          Progress <span className="float-right">{raisePercent}%</span>
        </h5>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div
            style={{ width: `${raisePercent}%` }}
            className="bg-blue-600 h-2.5 rounded-full"
          ></div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <div className="text-sm font-medium text-gray-100">
              Past Funding
            </div>
            <div className="text-2xl font-bold text-gray-200">
              {usdRaised} USD
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-100">Target</div>
            <div className="text-2xl font-bold text-gray-300">
              {(project.totalUnits ?? 0) / 10 ** 6} USD
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-200">Retro split</div>
            <div className="text-2xl font-bold text-gray-300">20%</div>
          </div>
        </div>
      </div>
    </div>
  );

  const supportedAssetsTab = (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-4">Add Supported Assets</h3>
      <div className="space-y-4">
        <TextField
          label="Address"
          fullWidth
          margin="normal"
          {...assetForm.register("address", { required: true })}
        />
        <div className="relative">
          <TextField
            label="Multiplier"
            fullWidth
            margin="normal"
            {...assetForm.register("multiplier", { required: true })}
          />
          <div className="absolute top-0 right-0">
            <span
              className="cursor-pointer"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={() => setShowTooltip((prev) => !prev)}
            >
              ℹ️
            </span>
            {showTooltip && (
              <span className="absolute bg-gray-700 text-white text-xs rounded p-2 mt-1">
                The multiplier is the amount of hypercert fractions you can
                redeem for 1 unit of asset.
              </span>
            )}
          </div>
        </div>
        <Button type="button" onClick={handleAddAddress}>
          Add Token
        </Button>
      </div>
    </div>
  );

  const allocateFundsTab = (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-4">Allocate Funds</h3>
      <div className="space-y-4">
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <h4 className="text-lg font-medium mb-2">Understanding Allocation</h4>
          <p className="text-gray-300 mb-3">
            The Allo Pool is a smart contract that holds funds raised for your
            project. When funds are allocated, they are distributed between two
            key components:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>
              <span className="font-medium">Hyperfund:</span> This portion goes
              to the project&apos;s treasury and can be used for project
              development and operations. The contributors can retire their
              hypercerts to get equivalent amount of funds in USD from the
              Hyperfund.
            </li>
            <li>
              <span className="font-medium">Hyperstaker:</span> This portion is
              reserved for retroactive rewards to financial and non financial
              contributors who have supported the project. The funds in
              Hyperstaker is used to provide yields to the supporters who have
              staked their Hypercerts.
            </li>
          </ul>
          <p className="text-gray-300 mt-3">
            The allocation process is irreversible, so please ensure you are
            comfortable with the distribution before proceeding.
          </p>
        </div>

        <p>
          Available pool funds to be allocated:{" "}
          {(poolBalances?.data
            ? parseInt((poolBalances.data[0]?.result as bigint)?.toString())
            : 0) /
            10 ** 6}{" "}
          USD
        </p>
        <p>
          Hyperstaker balance:{" "}
          {(poolBalances?.data
            ? parseInt((poolBalances.data[1]?.result as bigint)?.toString())
            : 0) /
            10 ** 6}{" "}
          USD
        </p>
        <p>
          Hyperfund balance:{" "}
          {(poolBalances?.data
            ? parseInt((poolBalances.data[2]?.result as bigint)?.toString())
            : 0) /
            10 ** 6}{" "}
          USD
        </p>
        <TextField
          label="Amount to Allocate to Hyperfund (USD)"
          type="number"
          fullWidth
          margin="normal"
          value={allocateHyperfund}
          onChange={(e) => setAllocateHyperfund(Number(e.target.value))}
        />
        <TextField
          label="Amount to Allocate to Hyperstaker (USD)"
          type="number"
          fullWidth
          margin="normal"
          value={allocateHyperstaker}
          onChange={(e) => setAllocateHyperstaker(Number(e.target.value))}
        />
        <Button type="button" onClick={handleAllocateFunds}>
          Allocate Funds
        </Button>
      </div>
    </div>
  );

  const contributorsTab = (
    <div className="p-4">
      <AllocateForm hyperfund={hyperfund} />
    </div>
  );

  const getTabContent = () => {
    switch (activeTab) {
      case "about":
        return aboutTab;
      case "fundsRaised":
        return fundsRaisedTab;
      case "supportedAssets":
        return supportedAssetsTab;
      case "allocateFunds":
        return allocateFundsTab;
      case "contributors":
        return contributorsTab;
      case "delete":
        return deleteProjectTab;
      default:
        return aboutTab;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <ProjectBanner
          profileId={project?.recipient}
          url={project?.bannerUrl}
          className="w-full h-48 object-cover rounded-t-2xl"
        />
        <div className="relative -mt-16 text-center">
          <ProjectAvatar
            className="rounded-full mx-auto w-24 h-24 border-4 border-white dark:border-gray-800"
            address={project?.recipient}
            url={project?.avatarUrl}
          />
          <h2 className="text-2xl font-bold mt-4">{project?.name}</h2>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="w-64 space-y-2">
          <Button
            className={`w-full ${
              activeTab === "about" ? "bg-primary-600" : ""
            }`}
            onClick={() => setActiveTab("about")}
          >
            About
          </Button>
          <Button
            className={`w-full ${
              activeTab === "fundsRaised" ? "bg-primary-600" : ""
            }`}
            onClick={() => setActiveTab("fundsRaised")}
          >
            Funds Raised
          </Button>
          {/* <Button
            className={`w-full ${
              activeTab === "supportedAssets" ? "bg-primary-600" : ""
            }`}
            onClick={() => setActiveTab("supportedAssets")}
          >
            Add Supported Assets
          </Button> */}
          <Button
            className={`w-full ${
              activeTab === "allocateFunds" ? "bg-primary-600" : ""
            }`}
            onClick={() => setActiveTab("allocateFunds")}
          >
            Allocate Funds
          </Button>
          <Button
            className={`w-full ${
              activeTab === "contributors" ? "bg-primary-600" : ""
            }`}
            onClick={() => setActiveTab("contributors")}
          >
            Contributors
          </Button>
          <Button
            className={`w-full ${activeTab === "delete" ? "bg-red-600" : ""}`}
            onClick={() => setActiveTab("delete")}
          >
            Delete Project
          </Button>
        </div>

        <div className="flex-1 bg-[#1e293b] rounded-2xl border border-gray-200 dark:border-gray-700">
          {getTabContent()}
        </div>
      </div>

      <Modal open={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
        <div className="p-6">
          {txStatus === "success" ? (
            <>
              <h3 className="text-lg font-medium mb-4 text-green-500">
                Transaction Successful!
              </h3>
              <p className="text-gray-200 mb-4">Transaction Hash:</p>
              <a
                href={getTransactionExplorerUrl(chain?.id, txHash) ?? ""}
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
                  if (activeTab === "supportedAssets") {
                    handleAddAddress();
                  } else if (activeTab === "allocateFunds") {
                    handleAllocateFunds();
                  }
                }}
              >
                Retry
              </Button>
            </>
          ) : (
            <h3 className="text-lg font-medium mb-4">Transaction Pending...</h3>
          )}
          <Button className="mt-4" onClick={() => setShowSuccessModal(false)}>
            Close
          </Button>
        </div>
      </Modal>

      <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4 text-red-500">
            Confirm Project Deletion
          </h3>
          <p className="text-gray-200 mb-4">
            Are you sure you want to delete this project? This action cannot be
            undone.
          </p>
          <div className="flex gap-4">
            <Button
              className="flex-1 bg-gray-600 hover:bg-gray-700"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-red-600 hover:bg-red-700"
              onClick={handleDeleteProject}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
