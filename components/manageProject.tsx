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
import { formatCurrency } from "@/lib/formatters";
import { colors } from "@/lib/colors";
import { 
  NavLink, 
  Box, 
  Paper, 
  Stack, 
  Title, 
  Text, 
  NumberInput, 
  Button as MantineButton, 
  Alert, 
  Group, 
  Card, 
  Badge, 
  Grid, 
  List, 
  ThemeIcon,
  Container
} from "@mantine/core";
import { 
  IconInfoCircle, 
  IconCoins, 
  IconUsers, 
  IconChartBar, 
  IconAlertCircle,
  IconWallet,
  IconTrendingUp,
  IconCheck
} from "@tabler/icons-react";

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
          Progress <span className="float-right">{raisePercent.toFixed(1)}%</span>
        </h5>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div
            style={{ width: `${raisePercent}%` }}
            className="bg-blue-600 h-2.5 rounded-full"
          ></div>
        </div>
        <div className="flex justify-between items-start mt-4">
          <div>
            <div className="text-sm font-medium text-gray-100">
              Past Funding
            </div>
            <div className="text-2xl font-bold text-gray-200">
              {formatCurrency(usdRaised)}
            </div>
          </div>
          <div className="text-left">
            <div className="text-sm font-medium text-gray-100">Target</div>
            <div className="text-2xl font-bold text-gray-300">
              {formatCurrency((project.totalUnits ?? 0) / 10 ** 6)}
            </div>
          </div>
          <div className="text-right">
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
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <Group gap="sm" mb="md">
          <IconCoins size={24} />
          <Title order={2}>Allocate Funds</Title>
        </Group>

        {/* Information Card */}
        <Alert 
          icon={<IconInfoCircle size="1.1rem" />} 
          title="Understanding Allocation"
          color="blue"
          variant="light"
        >
          <Text size="sm" mb="md">
            The Allo Pool is a smart contract that holds funds raised for your project. 
            When funds are allocated, they are distributed between two key components:
          </Text>
          
          <List spacing="xs" size="sm" withPadding>
            <List.Item 
              icon={
                <ThemeIcon color="blue" size={20} radius="xl">
                  <IconWallet size="0.8rem" />
                </ThemeIcon>
              }
            >
              <Text fw={600} span>Hyperfund:</Text> This portion goes to the project's treasury 
              for development and operations. Contributors can retire their hypercerts to get 
              equivalent funds in USD from the Hyperfund.
            </List.Item>
            
            <List.Item 
              icon={
                <ThemeIcon color="green" size={20} radius="xl">
                  <IconTrendingUp size="0.8rem" />
                </ThemeIcon>
              }
            >
              <Text fw={600} span>Hyperstaker:</Text> Reserved for retroactive rewards to 
              contributors. These funds provide yields to supporters who have staked their Hypercerts.
            </List.Item>
          </List>
          
          <Alert color="orange" variant="light" mt="md">
            <Text size="sm" fw={500}>
              ⚠️ The allocation process is irreversible. Please ensure you are comfortable 
              with the distribution before proceeding.
            </Text>
          </Alert>
        </Alert>

        {/* Balance Overview */}
        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card p="lg" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Text size="sm" c="dimmed">Available Pool Funds</Text>
                <IconWallet size={20} color="var(--mantine-color-blue-6)" />
              </Group>
              <Text fw={700} size="xl">
                {formatCurrency((poolBalances?.data
                  ? parseInt((poolBalances.data[0]?.result as bigint)?.toString())
                  : 0) / 10 ** 6)}
              </Text>
            </Card>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card p="lg" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Text size="sm" c="dimmed">Hyperstaker Balance</Text>
                <IconTrendingUp size={20} color="var(--mantine-color-green-6)" />
              </Group>
              <Text fw={700} size="xl" c="green">
                {formatCurrency((poolBalances?.data
                  ? parseInt((poolBalances.data[1]?.result as bigint)?.toString())
                  : 0) / 10 ** 6)}
              </Text>
            </Card>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card p="lg" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Text size="sm" c="dimmed">Hyperfund Balance</Text>
                <IconCoins size={20} color="var(--mantine-color-blue-6)" />
              </Group>
              <Text fw={700} size="xl" c="blue">
                {formatCurrency((poolBalances?.data
                  ? parseInt((poolBalances.data[2]?.result as bigint)?.toString())
                  : 0) / 10 ** 6)}
              </Text>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Allocation Form */}
        <Card p="lg" radius="md" withBorder>
          <Title order={3} mb="md">Set Allocation Amounts</Title>
          
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Amount to Allocate to Hyperfund"
                description="Project treasury funds (USD)"
                placeholder="0.00"
                value={allocateHyperfund}
                onChange={(value) => setAllocateHyperfund(Number(value))}
                leftSection={<IconWallet size={16} />}
                min={0}
                step={0.01}
                decimalScale={2}
                fixedDecimalScale
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Amount to Allocate to Hyperstaker"
                description="Staking rewards pool (USD)"
                placeholder="0.00"
                value={allocateHyperstaker}
                onChange={(value) => setAllocateHyperstaker(Number(value))}
                leftSection={<IconTrendingUp size={16} />}
                min={0}
                step={0.01}
                decimalScale={2}
                fixedDecimalScale
              />
            </Grid.Col>
          </Grid>

          {/* Summary */}
          {(allocateHyperfund > 0 || allocateHyperstaker > 0) && (
            <Paper p="md" withBorder radius="md" mt="md" bg="surface.6" style={{ borderColor: colors.surface.muted }}>
              <Group justify="space-between">
                <Text fw={500} c="dark.0">Total Allocation:</Text>
                <Badge size="lg" variant="light" color="brand">
                  {formatCurrency(allocateHyperfund + allocateHyperstaker)}
                </Badge>
              </Group>
            </Paper>
          )}

          <MantineButton 
            onClick={handleAllocateFunds}
            leftSection={<IconCheck size={16} />}
            size="md"
            fullWidth
            mt="xl"
            disabled={allocateHyperfund === 0 && allocateHyperstaker === 0}
          >
            Execute Allocation
          </MantineButton>
        </Card>
      </Stack>
    </Container>
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
        <Paper 
          w={280} 
          p={0} 
          radius="md" 
          withBorder
          bg="surface.7"
          style={{ 
            borderColor: colors.surface.muted
          }}
        >
          <Stack gap="xs" p="md">
            <NavLink
              href="#"
              label="About"
              leftSection={<IconInfoCircle size="1.2rem" />}
              active={activeTab === "about"}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("about");
              }}
              color={activeTab === "about" ? "brand" : undefined}
              styles={{
                root: {
                  borderRadius: 'var(--mantine-radius-md)',
                  color: activeTab === "about" ? colors.text.primary : colors.text.secondary,
                  backgroundColor: activeTab === "about" ? colors.brand.primary : 'transparent',
                  '&:hover': {
                    backgroundColor: activeTab === "about" ? colors.brand.dark : colors.surface.dark,
                  },
                },
                label: {
                  color: activeTab === "about" ? colors.text.primary : colors.text.secondary,
                },
              }}
            />
            
            <NavLink
              href="#"
              label="Funds Raised"
              leftSection={<IconChartBar size="1.2rem" />}
              active={activeTab === "fundsRaised"}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("fundsRaised");
              }}
              color={activeTab === "fundsRaised" ? "brand" : undefined}
              styles={{
                root: {
                  borderRadius: 'var(--mantine-radius-md)',
                  color: activeTab === "fundsRaised" ? colors.text.primary : colors.text.secondary,
                  backgroundColor: activeTab === "fundsRaised" ? colors.brand.primary : 'transparent',
                  '&:hover': {
                    backgroundColor: activeTab === "fundsRaised" ? colors.brand.dark : colors.surface.dark,
                  },
                },
                label: {
                  color: activeTab === "fundsRaised" ? colors.text.primary : colors.text.secondary,
                },
              }}
            />
            
            <NavLink
              href="#"
              label="Allocate Funds"
              leftSection={<IconCoins size="1.2rem" />}
              active={activeTab === "allocateFunds"}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("allocateFunds");
              }}
              color={activeTab === "allocateFunds" ? "brand" : undefined}
              styles={{
                root: {
                  borderRadius: 'var(--mantine-radius-md)',
                  color: activeTab === "allocateFunds" ? colors.text.primary : colors.text.secondary,
                  backgroundColor: activeTab === "allocateFunds" ? colors.brand.primary : 'transparent',
                  '&:hover': {
                    backgroundColor: activeTab === "allocateFunds" ? colors.brand.dark : colors.surface.dark,
                  },
                },
                label: {
                  color: activeTab === "allocateFunds" ? colors.text.primary : colors.text.secondary,
                },
              }}
            />
            
            <NavLink
              href="#"
              label="Contributors"
              leftSection={<IconUsers size="1.2rem" />}
              active={activeTab === "contributors"}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("contributors");
              }}
              color={activeTab === "contributors" ? "brand" : undefined}
              styles={{
                root: {
                  borderRadius: 'var(--mantine-radius-md)',
                  color: activeTab === "contributors" ? colors.text.primary : colors.text.secondary,
                  backgroundColor: activeTab === "contributors" ? colors.brand.primary : 'transparent',
                  '&:hover': {
                    backgroundColor: activeTab === "contributors" ? colors.brand.dark : colors.surface.dark,
                  },
                },
                label: {
                  color: activeTab === "contributors" ? colors.text.primary : colors.text.secondary,
                },
              }}
            />
          </Stack>
        </Paper>

        <Box 
          flex={1} 
          bg="surface.7"
          style={{ 
            borderRadius: '16px',
            border: `1px solid ${colors.surface.muted}`
          }}
        >
          {getTabContent()}
        </Box>
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
    </div>
  );
}
