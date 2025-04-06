import {
  TextInput,
  Text,
  Paper,
  Title,
  Stack,
  Button,
  Group,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import "@mantine/dates/styles.css";
import { useForm } from "react-hook-form";
import { useAccount, useWriteContract, useConfig } from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { Abi, encodeAbiParameters, decodeAbiParameters } from "viem";
import { formatHypercertData, TransferRestrictions } from "@hypercerts-org/sdk";
import { useHypercertClient } from "@/hooks/useHypercertClient";
import {
  alloAbi,
  alloRegistryAbi,
  hyperfundFactoryAbi,
  contracts,
  hyperstrategyFactoryAbi,
  hypercertMinterAbi,
  hyperfundAbi,
} from "@/components/data";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { ProjectConfigurationsSection } from "./ProjectConfigurationsSection"; // Add this import

const testing = true;

interface CreateHypercertProps {
  ipfsHash: [string, Dispatch<SetStateAction<string>>];
  alloProfileState: [string, Dispatch<SetStateAction<string>>];
  hypercertState: [string, Dispatch<SetStateAction<string>>];
  onPrevious: () => void;
}

interface HypercertFormData {
  goal: string;
  title: string;
  description: string;
  impactScope: string[];
  excludedImpactScope: string[];
  workScope: string[];
  excludedWorkScope: string[];
  workTimeframeStart: Date;
  workTimeframeEnd: Date;
  impactTimeframeStart: Date;
  impactTimeframeEnd: Date;
  contributorsList: string[];
  rights: string[];
  excludedRights: string[];
}

export function CreateHypers({
  onPrevious,
  alloProfileState,
  ipfsHash,
  hypercertState,
}: CreateHypercertProps) {
  const defaultValues = testing
    ? {
        title: "Climate Action Project",
        description:
          "A project focused on reducing carbon emissions through innovative technology",
        goal: "100000",
        impactScope: ["Climate Change", "Carbon Reduction", "Renewable Energy"],
        excludedImpactScope: ["Fossil Fuels"],
        workScope: ["Research", "Development", "Implementation"],
        excludedWorkScope: ["Marketing"],
        workTimeframeStart: new Date(),
        workTimeframeEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        impactTimeframeStart: new Date(),
        impactTimeframeEnd: new Date(
          Date.now() + 2 * 365 * 24 * 60 * 60 * 1000
        ), // 2 years from now
        contributorsList: [
          "0x1234567890123456789012345678901234567890",
          "0x0987654321098765432109876543210987654321",
        ],
        rights: ["Commercial Use", "Distribution", "Modification"],
        excludedRights: ["Patent Rights"],
      }
    : {};

  const form = useForm<HypercertFormData>({
    defaultValues,
  });
  const account = useAccount();
  const contract = useWriteContract();
  const alloContract = useWriteContract();
  const { client } = useHypercertClient();
  const wagmiConfig = useConfig();
  const router = useRouter();
  const [alloProfile] = alloProfileState;
  const [ipfshash] = ipfsHash;
  const [hypercertId] = hypercertState;

  const [completedSteps, setCompletedSteps] = useState<{
    hypercertId?: string;
    hyperfundAddress?: string;
    hyperstakerAddress?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const createAlloPool = async (hyperfund: `0x${string}`) => {
    try {
      // Deploy strategy contract
      const stx = await contract.writeContractAsync({
        address: contracts[account.chainId as keyof typeof contracts]
          .hyperstrategyFactory as `0x${string}`,
        abi: hyperstrategyFactoryAbi as Abi,
        functionName: "createHyperstrategy",
        args: [
          contracts[account.chainId as keyof typeof contracts]
            .alloContract as `0x${string}`,
          "HyperStrategy",
        ],
      });

      const txreceipt = await waitForTransactionReceipt(wagmiConfig, {
        hash: stx,
      });

      // Extract hyperfundAddress from transaction receipt events
      const hyperstrategyAddress = decodeAbiParameters(
        [{ name: "hyperstrategyAddress", type: "address" }],
        txreceipt.logs[1]?.topics?.[1] as `0x${string}`
      )[0];

      // Approve strategy to distribute hypercerts
      await contract.writeContractAsync({
        abi: hypercertMinterAbi,
        address: contracts[account.chainId as keyof typeof contracts]
          .hypercertMinterContract as `0x${string}`,
        functionName: "setApprovalForAll",
        args: [hyperstrategyAddress, true],
      });

      // Strategy initialization data
      const initializationData = encodeAbiParameters(
        [
          { name: "manager", type: "address" },
          { name: "hyperfund", type: "address" },
        ],
        [
          contracts[account.chainId as keyof typeof contracts]
            .alloContract as `0x${string}`,
          hyperfund,
        ]
      );

      // Pool metadata
      const metadata = {
        pointer: ipfshash ?? "",
        protocol: "1",
      };
      const tx = await contract.writeContractAsync({
        // Allo contract address
        address: contracts[account.chainId as keyof typeof contracts]
          .alloContract as `0x${string}`,
        abi: alloAbi as Abi,
        functionName: "createPoolWithCustomStrategy",
        args: [
          alloProfile as `0x${string}`,
          hyperstrategyAddress,
          initializationData,
          contracts[account.chainId as keyof typeof contracts]
            .usdc as `0x${string}`, // USDC on Sepolia
          BigInt(0), // amount
          metadata,
          [], // managers array
        ],
      });

      const txReceipt = await waitForTransactionReceipt(wagmiConfig, {
        hash: tx,
      });

      // Extract alloPoolId from transaction receipt events
      const alloPoolId = decodeAbiParameters(
        [{ name: "poolId", type: "uint256" }],
        txReceipt.logs[5]?.topics?.[1] as `0x${string}`
      )[0];

      if (alloPoolId) {
        setCompletedSteps((prevSteps) => ({
          ...prevSteps,
          alloPoolId: alloPoolId.toString(),
        }));

        // Call the API to add entries to the database
        await fetch("/api/addEntry", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            hypercertId: hypercertId,
            alloProfile: alloProfile,
            alloPool: alloPoolId,
            listed: false,
          }),
        });

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error("Error creating Allo Pool:", error);
      throw new Error("Error creating Allo Pool");
      return;
    }
  };

  const createHyperfund = async () => {
    try {
      const tx = await contract.writeContractAsync({
        address: contracts[account.chainId as keyof typeof contracts]
          .hyperstakerFactoryContract as `0x${string}`,
        abi: hyperfundFactoryAbi as Abi,
        functionName: "createHyperfund",
        args: [BigInt(hypercertId as string), account.address as `0x${string}`],
      });

      const txReceipt = await waitForTransactionReceipt(wagmiConfig, {
        hash: tx,
      });

      // Extract hyperfundAddress from transaction receipt events
      const hyperfundAddress = decodeAbiParameters(
        [{ name: "hyperfundAddress", type: "address" }],
        txReceipt.logs[2]?.topics?.[1] as `0x${string}`
      )[0];

      if (hyperfundAddress) {
        await contract.writeContractAsync({
          address: hyperfundAddress as `0x${string}`,
          abi: hyperfundAbi as Abi,
          functionName: "allowlistToken",
          args: [
            contracts[account.chainId as keyof typeof contracts]
              .usdc as `0x${string}`,
            1,
          ],
        });

        setCompletedSteps((prevSteps) => ({
          ...prevSteps,
          hyperfundAddress: hyperfundAddress,
        }));

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      return hyperfundAddress;
    } catch (error) {
      console.error("Error creating Hyperfund Pool:", error);
      throw new Error("Unable to create Hyperfund");
    }
  };

  const createHyperstaker = async () => {
    try {
      const tx = await contract.writeContractAsync({
        address: contracts[account.chainId as keyof typeof contracts]
          .hyperstakerFactoryContract as `0x${string}`,
        abi: hyperfundFactoryAbi as Abi,
        functionName: "createHyperstaker",
        args: [BigInt(hypercertId as string), account.address as `0x${string}`],
      });

      const txReceipt = await waitForTransactionReceipt(wagmiConfig, {
        hash: tx,
      });

      // Extract hyperstakerAddress from transaction receipt events
      const hyperstakerAddress = decodeAbiParameters(
        [{ name: "hyperstakerAddress", type: "address" }],
        txReceipt.logs[2]?.topics?.[1] as `0x${string}`
      )[0];

      if (hyperstakerAddress) {
        setCompletedSteps((prevSteps) => ({
          ...prevSteps,
          hyperstakerAddress: hyperstakerAddress,
        }));

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error("Error creating Hyperstaker:", error);
      throw new Error("Failed to create Hyperstaker");
    }
  };

  const onSubmit = async (data: HypercertFormData) => {
    setIsSubmitting(true);
    console.log("Hypercert Data:", data);

    if (!account.chainId) {
      throw new Error("Please connect wallet");
    }

    try {
      const hyperfund = await createHyperfund();
      await createAlloPool(hyperfund);
      await createHyperstaker();
      router.push("/projects");
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper
      p="xl"
      radius="lg"
      bg="transparent"
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Stack gap="xl">
          <Title order={2} c="white">Create Hyperfund and Hyperstaker pool</Title>
          <ProjectConfigurationsSection />
          {/* <TextInput
            label="Project Goal (USD)"
            placeholder="Enter amount"
            required
            {...form.register("goal", { required: "Goal is required" })}
            styles={{
              label: { color: "var(--mantine-color-gray-4)" },
              input: {
                backgroundColor: "var(--mantine-color-dark-6)",
                color: "var(--mantine-color-white)",
                border: "1px solid var(--mantine-color-dark-4)",
              },
            }}
          /> */}

          <Group justify="space-between">
            <Button variant="default" onClick={onPrevious}>
              Previous Step
            </Button>
            <Button
              variant="gradient"
              gradient={{ from: "blue", to: "cyan" }}
              type="submit"
              loading={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Next Step"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}
