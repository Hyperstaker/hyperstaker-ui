import { TextInput, Text, Paper, Title, Stack, Button, Group } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import "@mantine/dates/styles.css";
import { useForm } from "react-hook-form";
import { useAccount, useWriteContract, useConfig } from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { Abi, encodeAbiParameters, decodeAbiParameters } from "viem";
import { formatHypercertData, TransferRestrictions } from "@hypercerts-org/sdk";
import { useHypercertClient } from "@/hooks/useHypercertClient";
import { alloAbi, alloRegistryAbi, hyperfundFactoryAbi, contracts } from "@/components/data";
import { useRouter } from "next/navigation";
import { useState } from "react";

const testing = true;

interface CreateHypercertProps {
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

export function CreateHypers({ onPrevious }: CreateHypercertProps) {
  const defaultValues = testing ? {
    title: "Climate Action Project",
    description: "A project focused on reducing carbon emissions through innovative technology",
    goal: "100000",
    impactScope: ["Climate Change", "Carbon Reduction", "Renewable Energy"],
    excludedImpactScope: ["Fossil Fuels"],
    workScope: ["Research", "Development", "Implementation"],
    excludedWorkScope: ["Marketing"],
    workTimeframeStart: new Date(),
    workTimeframeEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    impactTimeframeStart: new Date(),
    impactTimeframeEnd: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000), // 2 years from now
    contributorsList: [
      "0x1234567890123456789012345678901234567890",
      "0x0987654321098765432109876543210987654321"
    ],
    rights: ["Commercial Use", "Distribution", "Modification"],
    excludedRights: ["Patent Rights"]
  } : {};

  const form = useForm<HypercertFormData>({
    defaultValues
  });
  const account = useAccount();
  const alloContract = useWriteContract();
  const { client } = useHypercertClient();
  const wagmiConfig = useConfig();
  const router = useRouter();

  const [completedSteps, setCompletedSteps] = useState<{
    hypercertId?: string;
    hyperfundAddress?: string;
    hyperstakerAddress?: string;
  }>({});

  const onSubmit = async (data: HypercertFormData) => {
    console.log("Hypercert Data:", data);
    
    if (!account.chainId) {
      throw new Error("Please connect wallet");
    }

    try {
      // Step 1: Create Hypercert
      let currentHypercertId = completedSteps.hypercertId;
      
      if (!currentHypercertId) {
        const metadata = formatHypercertData({
          name: data.title,
          description: data.description,
          image: "https://placehold.co/600x400",
          version: "1.0",
          impactScope: data.impactScope,
          excludedImpactScope: data.excludedImpactScope,
          workScope: data.workScope,
          excludedWorkScope: data.excludedWorkScope,
          workTimeframeStart: new Date(data.workTimeframeStart).getTime() / 1000,
          workTimeframeEnd: new Date(data.workTimeframeEnd).getTime() / 1000,
          impactTimeframeStart: new Date(data.impactTimeframeStart).getTime() / 1000,
          impactTimeframeEnd: new Date(data.impactTimeframeEnd).getTime() / 1000,
          contributors: data.contributorsList ? [account.address as string, ...data.contributorsList] : [account.address as string],
          rights: [...data.rights],
          excludedRights: [...data.excludedRights],
        });

        if (!metadata.data) {
          throw new Error("Metadata is null");
        }

        const txId = await client.mintHypercert({
          metaData: metadata.data,
          totalUnits: BigInt(data.goal) * BigInt(1000000),
          transferRestriction: TransferRestrictions.AllowAll,
        });

        const txReceipt = await waitForTransactionReceipt(wagmiConfig, {
          hash: txId,
          confirmations: 3,
        });

        const hypercertId = decodeAbiParameters(
          [{ name: "id", type: "uint256" }],
          txReceipt.logs[0]?.topics[1] as `0x${string}`
        )[0];

        if (!hypercertId) {
          throw new Error("Failed to get hypercert ID from transaction");
        }

        currentHypercertId = hypercertId.toString();
        setCompletedSteps(prev => ({
          ...prev,
          hypercertId: currentHypercertId
        }));
      }

      // Step 2: Create Hyperfund Pool
      if (!completedSteps.hyperfundAddress && currentHypercertId) {
        const tx = await alloContract.writeContractAsync({
          address: contracts[account.chainId as keyof typeof contracts].hyperstakerFactoryContract as `0x${string}`,
          abi: hyperfundFactoryAbi as Abi,
          functionName: "createHyperfund",
          args: [
            BigInt(currentHypercertId),
            account.address as `0x${string}`,
          ],
        });

        const txReceipt = await waitForTransactionReceipt(wagmiConfig, {
          hash: tx,
        });

        const hyperfundAddress = decodeAbiParameters(
          [{ name: "hypperfundAddress", type: "address" }],
          txReceipt.logs[2]?.topics?.[1] as `0x${string}`
        )[0];

        if (hyperfundAddress) {
          setCompletedSteps(prev => ({
            ...prev,
            hyperfundAddress
          }));
        }
      }

      // Step 3: Create Hyperstaker
      if (!completedSteps.hyperstakerAddress && currentHypercertId) {
        const tx = await alloContract.writeContractAsync({
          address: contracts[account.chainId as keyof typeof contracts].hyperstakerFactoryContract as `0x${string}`,
          abi: hyperfundFactoryAbi as Abi,
          functionName: "createHyperstaker",
          args: [
            BigInt(currentHypercertId),
            account.address as `0x${string}`,
          ],
        });

        const txReceipt = await waitForTransactionReceipt(wagmiConfig, {
          hash: tx,
        });

        const hyperstakerAddress = decodeAbiParameters(
          [{ name: "hyperstakerAddress", type: "address" }],
          txReceipt.logs[2]?.topics?.[1] as `0x${string}`
        )[0];

        if (hyperstakerAddress) {
          setCompletedSteps(prev => ({
            ...prev,
            hyperstakerAddress
          }));
        }
      }

      router.push("/projects");
      
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  };

  return (
    <Paper 
      p="xl" 
      radius="lg"
      bg="dark.7"
      style={{ border: "1px solid var(--mantine-color-dark-4)" }}
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Stack gap="xl">
          <Title order={2} c="white">Create Hyperfund and Hyperstaker pool</Title>
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
            <Button
              variant="default"
              onClick={onPrevious}
            >
              Previous Step
            </Button>
            <Button
              variant="gradient"
              gradient={{ from: "blue", to: "cyan" }}
              type="submit"
            >
              Next Step
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
} 