import { TextInput, Text, Paper, Title, Stack, Button, Group, Modal, Progress, Box, BoxProps, Center } from "@mantine/core";
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
import { useState, useEffect } from "react";
import { ProjectConfigurationsSection } from "./ProjectConfigurationsSection"; // Add this import

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

// Helper component for styling steps inside the modal (copied from createProject.tsx)
interface StepBoxProps extends BoxProps {
  isActive: boolean;
  isCompleted: boolean;
  children: React.ReactNode;
}

function StepBox({ isActive, isCompleted, children, ...props }: StepBoxProps) {
  return (
    <Box
      style={{
        display: "flex",
        width: "100%",
        padding: "8px", // Use theme spacing if available
      }}
      {...props}
    >
      <Text c={isActive ? "blue" : isCompleted ? "teal" : "dimmed"}>
        {children}
      </Text>
    </Box>
  );
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

  // State for tracking completed steps within this component's scope
  const [localCompletedSteps, setLocalCompletedSteps] = useState<{
    hypercertId?: string;
    hyperfundAddress?: string;
    hyperstakerAddress?: string;
  }>({});

  // State for the progress modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stepStatus, setStepStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Define the steps for the modal
  const steps = [
    "Creating Hypercert",
    "Creating Hyperfund Pool",
    "Creating Hyperstaker",
    // Add API/DB step if applicable
  ];

  const onSubmit = async (data: HypercertFormData) => {
    console.log("Hypercert Data:", data);

    if (!account.chainId) {
      alert("Please connect wallet"); // Use a more user-friendly notification
      return;
    }

    // Open modal and reset state
    setIsModalOpen(true);
    setStepStatus("processing");
    setErrorMessage("");
    // Use a ref to ensure state updates correctly within the async function
    const stateRef = { current: { ...localCompletedSteps } };


    try {
      // --- Step 1: Create Hypercert ---
      setCurrentStepIndex(0);
      let currentHypercertId = stateRef.current.hypercertId;

      if (!currentHypercertId) {
        console.log("Step 1: Creating Hypercert...");
        const metadata = formatHypercertData({
          name: data.title,
          description: data.description,
          image: "https://placehold.co/600x400", // Placeholder, consider adding image upload
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

        console.log("Waiting for Hypercert tx receipt:", txId);
        const txReceipt = await waitForTransactionReceipt(wagmiConfig, {
          hash: txId,
          confirmations: 3, // Consider adjusting confirmations
        });
        console.log("Hypercert tx receipt:", txReceipt);

        const hypercertId = decodeAbiParameters(
          [{ name: "id", type: "uint256" }],
          txReceipt.logs[0]?.topics[1] as `0x${string}`
        )[0];

        if (!hypercertId) {
          throw new Error("Failed to get hypercert ID from transaction");
        }

        currentHypercertId = hypercertId.toString();
        stateRef.current = { ...stateRef.current, hypercertId: currentHypercertId };
        setLocalCompletedSteps(stateRef.current); // Update state
        console.log("Step 1 Complete. Hypercert ID:", currentHypercertId);
        await new Promise(resolve => setTimeout(resolve, 500)); // Short delay for UI update
      } else {
        console.log("Step 1: Skipped (Hypercert already created)");
      }


      // --- Step 2: Create Hyperfund Pool ---
      setCurrentStepIndex(1);
      let currentHyperfundAddress = stateRef.current.hyperfundAddress;

      if (!currentHyperfundAddress && currentHypercertId) {
          console.log("Step 2: Creating Hyperfund Pool...");
          const tx = await alloContract.writeContractAsync({
            address: contracts[account.chainId as keyof typeof contracts].hyperstakerFactoryContract as `0x${string}`,
            abi: hyperfundFactoryAbi as Abi,
            functionName: "createHyperfund",
            args: [
              BigInt(currentHypercertId),
              account.address as `0x${string}`,
            ],
          });

          console.log("Waiting for Hyperfund tx receipt:", tx);
          const txReceipt = await waitForTransactionReceipt(wagmiConfig, {
            hash: tx,
          });
          console.log("Hyperfund tx receipt:", txReceipt);

          // NOTE: Double check the log index and event signature if this fails
          const hyperfundAddress = decodeAbiParameters(
            [{ name: "hypperfundAddress", type: "address" }], // Typo? Check contract event name ('hypperfundAddress' vs 'hyperfundAddress')
            txReceipt.logs[2]?.topics?.[1] as `0x${string}` // Assuming index 2 is correct
          )[0];

          if (!hyperfundAddress) {
              throw new Error("Failed to get Hyperfund address from transaction");
          }

          currentHyperfundAddress = hyperfundAddress;
          stateRef.current = { ...stateRef.current, hyperfundAddress: currentHyperfundAddress };
          setLocalCompletedSteps(stateRef.current); // Update state
          console.log("Step 2 Complete. Hyperfund Address:", currentHyperfundAddress);
          await new Promise(resolve => setTimeout(resolve, 500)); // Short delay
      } else {
          console.log("Step 2: Skipped (Hyperfund already created or Hypercert missing)");
      }


      // --- Step 3: Create Hyperstaker ---
      setCurrentStepIndex(2);
      let currentHyperstakerAddress = stateRef.current.hyperstakerAddress;

      if (!currentHyperstakerAddress && currentHypercertId) {
        console.log("Step 3: Creating Hyperstaker...");
        const tx = await alloContract.writeContractAsync({
          address: contracts[account.chainId as keyof typeof contracts].hyperstakerFactoryContract as `0x${string}`,
          abi: hyperfundFactoryAbi as Abi, // Assuming same factory ABI? Double check.
          functionName: "createHyperstaker",
          args: [
            BigInt(currentHypercertId),
            account.address as `0x${string}`,
          ],
        });

        console.log("Waiting for Hyperstaker tx receipt:", tx);
        const txReceipt = await waitForTransactionReceipt(wagmiConfig, {
          hash: tx,
        });
        console.log("Hyperstaker tx receipt:", txReceipt);

        // NOTE: Double check the log index and event signature if this fails
        const hyperstakerAddress = decodeAbiParameters(
          [{ name: "hyperstakerAddress", type: "address" }],
          txReceipt.logs[2]?.topics?.[1] as `0x${string}` // Assuming index 2 is correct
        )[0];

        if (!hyperstakerAddress) {
          throw new Error("Failed to get Hyperstaker address from transaction");
        }

        currentHyperstakerAddress = hyperstakerAddress;
        stateRef.current = { ...stateRef.current, hyperstakerAddress: currentHyperstakerAddress };
        setLocalCompletedSteps(stateRef.current); // Update state
        console.log("Step 3 Complete. Hyperstaker Address:", currentHyperstakerAddress);
        await new Promise(resolve => setTimeout(resolve, 500)); // Short delay
      } else {
        console.log("Step 3: Skipped (Hyperstaker already created or Hypercert missing)");
      }

      // --- Final Step: Success ---
      setCurrentStepIndex(steps.length); // Visually mark all steps complete
      setStepStatus("success");
      console.log("All steps completed successfully!");

      setTimeout(() => {
        setIsModalOpen(false);
        router.push("/projects"); // Navigate to projects page after success
      }, 2000); // Keep modal open for 2 seconds to show success message

    } catch (error) {
      console.error("Error during project creation steps:", error);
      setStepStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      // Keep the modal open to show the error and retry button
    }
  };

  // Function to handle retrying the submission
  const handleRetry = () => {
    // Reset potentially problematic state before retry?
    // E.g., maybe only retry from the failed step? Needs more complex state management.
    // For now, just restart the whole process.
    setLocalCompletedSteps({}); // Clear completed steps for a full retry
    onSubmit(form.getValues()); // Resubmit with current form values
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

      {/* Progress Modal */}
      <Modal
        opened={isModalOpen}
        onClose={() => stepStatus !== "processing" && setIsModalOpen(false)}
        title="Creating Project..."
        centered
        closeOnClickOutside={stepStatus !== "processing"}
        closeOnEscape={stepStatus !== "processing"}
        withCloseButton={stepStatus !== "processing"}
      >
        <Stack gap="md">
          <Progress
             // variant="determinate" // Mantine uses 'value' directly
             value={ (currentStepIndex / steps.length) * 100 } // Calculate percentage
             animated={stepStatus === "processing"}
             size="lg"
             radius="sm"
          />

          {steps.map((step, index) => {
             const stepKey = ["hypercertId", "hyperfundAddress", "hyperstakerAddress"][index] as keyof typeof localCompletedSteps;
             const isCompleted = index < currentStepIndex;
             const isActive = index === currentStepIndex && stepStatus === "processing";
             const stepData = localCompletedSteps[stepKey];

             return (
                 <StepBox
                   key={step}
                   isActive={isActive}
                   isCompleted={isCompleted}
                 >
                   {isCompleted && <Text span c="teal" mr={5}>✓</Text>}
                   {step}
                   {stepData && (
                     <Text span size="xs" c="dimmed" ml="xs">
                       (ID: {stepData.slice(0, 6)}...)
                     </Text>
                   )}
                 </StepBox>
              );
          })}

          {stepStatus === "success" && (
            <Box mt="md">
              <Text c="teal" ta="center" fw={500}>
                Project created successfully! Redirecting...
              </Text>
            </Box>
          )}

          {stepStatus === "error" && (
            <Box mt="md">
              <Text c="red" ta="center" fw={500} mb="xs">Error:</Text>
              <Text c="red" ta="center" size="sm" mb="md">{errorMessage}</Text>
              <Center>
                <Button
                   variant="light" color="red"
                   onClick={handleRetry}
                 >
                   Retry
                 </Button>
              </Center>
            </Box>
          )}
        </Stack>
      </Modal>
    </Paper>
  );
} 