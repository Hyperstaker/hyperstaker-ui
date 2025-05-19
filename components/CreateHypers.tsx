import {
  Text,
  Paper,
  Title,
  Stack,
  Button,
  Group,
  Modal,
  Progress,
  Box,
  BoxProps,
  Center,
} from "@mantine/core";
import "@mantine/dates/styles.css";
import { useAccount, useWriteContract, useConfig } from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { Abi, encodeAbiParameters, decodeAbiParameters } from "viem";
import { formatHypercertData, TransferRestrictions } from "@hypercerts-org/sdk";
import { useHypercertClient } from "@/hooks/useHypercertClient";
import {
  alloAbi,
  hyperfundFactoryAbi,
  contracts,
  hyperstrategyFactoryAbi,
  hypercertMinterAbi,
  hyperfundAbi,
} from "@/components/data";
import { useRouter } from "next/navigation";
import { useState, Dispatch, SetStateAction } from "react";
import { ProjectConfigurationsSection } from "./ProjectConfigurationsSection"; // Add this import
import { HypercertFormData } from "./OnboardingFlow";

interface CreateHypercertProps {
  ipfsHash: [string, Dispatch<SetStateAction<string>>];
  alloProfileState: [string, Dispatch<SetStateAction<string>>];
  hypercertState: [
    HypercertFormData,
    Dispatch<SetStateAction<HypercertFormData>>
  ];
  onPrevious: () => void;
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

export function CreateHypers({
  onPrevious,
  ipfsHash,
  alloProfileState,
  hypercertState,
}: CreateHypercertProps) {
  // const form = useForm<HypercertFormData>({
  //   defaultValues,
  // });
  const account = useAccount();
  const contract = useWriteContract();
  const alloContract = useWriteContract();
  const { client } = useHypercertClient();
  const wagmiConfig = useConfig();
  const router = useRouter();
  const [alloProfile] = alloProfileState;
  const [ipfshash] = ipfsHash;
  const [hypercertData] = hypercertState;

  // State for tracking completed steps within this component's scope
  const [localCompletedSteps, setLocalCompletedSteps] = useState<{
    hypercertId?: string;
    hyperfundAddress?: string;
    hyperstakerAddress?: string;
    alloPoolId?: string;
  }>({});

  // State for the progress modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stepStatus, setStepStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Define the steps for the modal
  const steps = [
    "Creating Hypercert",
    "Creating Hyperfund Pool",
    "Creating Hyperstaker",
    "Creating Allo Pool",
    // Add API/DB step if applicable
  ];

  const onSubmit = async (data: HypercertFormData) => {
    setIsSubmitting(true);
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
          impactScope: data.impactScope ?? [],
          excludedImpactScope: data.excludedImpactScope ?? [],
          workScope: data.workScope ?? [],
          excludedWorkScope: data.excludedWorkScope ?? [],
          workTimeframeStart:
            new Date(data.workTimeframeStart ?? 0).getTime() / 1000,
          workTimeframeEnd:
            new Date(data.workTimeframeEnd ?? 0).getTime() / 1000,
          impactTimeframeStart:
            new Date(data.impactTimeframeStart ?? 0).getTime() / 1000,
          impactTimeframeEnd:
            new Date(data.impactTimeframeEnd ?? 0).getTime() / 1000,
          contributors: data.contributorsList
            ? [account.address as string, ...data.contributorsList]
            : [account.address as string],
          rights: data.rights ?? [],
          excludedRights: data.excludedRights ?? [],
        });

        console.log(metadata);

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
        stateRef.current = {
          ...stateRef.current,
          hypercertId: currentHypercertId,
        };
        setLocalCompletedSteps(stateRef.current); // Update state
        console.log("Step 1 Complete. Hypercert ID:", currentHypercertId);
        await new Promise((resolve) => setTimeout(resolve, 500)); // Short delay for UI update
      } else {
        console.log("Step 1: Skipped (Hypercert already created)");
      }

      // --- Step 2: Create Hyperfund Pool ---
      setCurrentStepIndex(1);
      let currentHyperfundAddress = stateRef.current.hyperfundAddress;

      if (!currentHyperfundAddress && currentHypercertId) {
        console.log("Step 2: Creating Hyperfund Pool...");
        const tx = await alloContract.writeContractAsync({
          address: contracts[account.chainId as keyof typeof contracts]
            .hyperstakerFactoryContract as `0x${string}`,
          abi: hyperfundFactoryAbi as Abi,
          functionName: "createHyperfund",
          args: [
            BigInt(currentHypercertId),
            account.address as `0x${string}`,
            account.address as `0x${string}`,
            account.address as `0x${string}`,
            account.address as `0x${string}`,
          ],
        });

        console.log("Waiting for Hyperfund tx receipt:", tx);
        const txReceipt = await waitForTransactionReceipt(wagmiConfig, {
          hash: tx,
        });
        console.log("Hyperfund tx receipt:", txReceipt);

        // NOTE: Double check the log index and event signature if this fails
        const hyperfundAddress = txReceipt.logs[2]?.address as `0x${string}`;

        if (!hyperfundAddress) {
          throw new Error("Failed to get Hyperfund address from transaction");
        }

        currentHyperfundAddress = hyperfundAddress;
        stateRef.current = {
          ...stateRef.current,
          hyperfundAddress: currentHyperfundAddress,
        };

        if (hyperfundAddress) {
          stateRef.current = {
            ...stateRef.current,
            hyperfundAddress: hyperfundAddress,
          };

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
        }
        setLocalCompletedSteps(stateRef.current); // Update state
        console.log(
          "Step 2 Complete. Hyperfund Address:",
          currentHyperfundAddress
        );
        await new Promise((resolve) => setTimeout(resolve, 500)); // Short delay
      } else {
        console.log(
          "Step 2: Skipped (Hyperfund already created or Hypercert missing)"
        );
      }

      // --- Step 3: Create Hyperstaker ---
      setCurrentStepIndex(2);
      let currentHyperstakerAddress = stateRef.current.hyperstakerAddress;

      if (!currentHyperstakerAddress && currentHypercertId) {
        console.log("Step 3: Creating Hyperstaker...");
        const tx = await alloContract.writeContractAsync({
          address: contracts[account.chainId as keyof typeof contracts]
            .hyperstakerFactoryContract as `0x${string}`,
          abi: hyperfundFactoryAbi as Abi, // Assuming same factory ABI? Double check.
          functionName: "createHyperstaker",
          args: [
            BigInt(currentHypercertId),
            account.address as `0x${string}`,
            account.address as `0x${string}`,
            account.address as `0x${string}`,
            account.address as `0x${string}`,
          ],
        });

        console.log("Waiting for Hyperstaker tx receipt:", tx);
        const txReceipt = await waitForTransactionReceipt(wagmiConfig, {
          hash: tx,
        });
        console.log("Hyperstaker tx receipt:", txReceipt);

        // NOTE: Double check the log index and event signature if this fails
        const hyperstakerAddress = txReceipt.logs[2]?.address as `0x${string}`;

        if (!hyperstakerAddress) {
          throw new Error("Failed to get Hyperstaker address from transaction");
        }

        currentHyperstakerAddress = hyperstakerAddress;
        stateRef.current = {
          ...stateRef.current,
          hyperstakerAddress: currentHyperstakerAddress,
        };
        setLocalCompletedSteps(stateRef.current); // Update state
        console.log(
          "Step 3 Complete. Hyperstaker Address:",
          currentHyperstakerAddress
        );
        await new Promise((resolve) => setTimeout(resolve, 500)); // Short delay
      } else {
        console.log(
          "Step 3: Skipped (Hyperstaker already created or Hypercert missing)"
        );
      }

      setCurrentStepIndex(3);
      let alloPoolId = stateRef.current.alloPoolId;

      if (!alloPoolId && currentHyperfundAddress) {
        console.log("Step 4: Creating Allo Pool...");
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

          await new Promise((resolve) => setTimeout(resolve, 2000)); // Short delay for UI update

          // Strategy initialization data
          const initializationData = encodeAbiParameters(
            [
              { name: "manager", type: "address" },
              { name: "hyperfund", type: "address" },
            ],
            [
              contracts[account.chainId as keyof typeof contracts]
                .alloContract as `0x${string}`,
              stateRef.current.hyperfundAddress as `0x${string}`,
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
                .usdc as `0x${string}`, // USDC
              BigInt(0), // amount
              metadata,
              [], // managers array
            ],
          });

          const txReceipt = await waitForTransactionReceipt(wagmiConfig, {
            hash: tx,
          });

          // Extract alloPoolId from transaction receipt events
          const _alloPoolId = decodeAbiParameters(
            [{ name: "poolId", type: "uint256" }],
            txReceipt.logs[5]?.topics?.[1] as `0x${string}`
          )[0];

          alloPoolId = _alloPoolId.toString();

          if (alloPoolId) {
            stateRef.current = {
              ...stateRef.current,
              alloPoolId: alloPoolId,
            };
            setLocalCompletedSteps(stateRef.current); // Update state
            console.log("Step 4 Complete. AlloPool ID:", alloPoolId);

            // Call the API to add entries to the database
            await fetch("/api/addEntry", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                hypercertId: stateRef.current.hypercertId,
                alloProfile: alloProfile,
                alloPool: alloPoolId,
                listed: false,
              }),
            });

            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        } catch (error) {
          console.error("Error creating Allo Pool:", error);
          setStepStatus("error");
          setErrorMessage("Failed to create Allo Pool");
          return;
        }
      }

      // --- Final Step: Success ---
      setCurrentStepIndex(steps.length); // Visually mark all steps complete
      setStepStatus("success");
      console.log("All steps completed successfully!");

      setTimeout(() => {
        setIsModalOpen(false);
        router.push("/organizations"); // Navigate to projects page after success
      }, 2000); // Keep modal open for 2 seconds to show success message
    } catch (error) {
      console.error("Error during project creation steps:", error);
      setStepStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      // Keep the modal open to show the error and retry button
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle retrying the submission
  const handleRetry = () => {
    // Reset potentially problematic state before retry?
    // E.g., maybe only retry from the failed step? Needs more complex state management.
    // For now, just restart the whole process.
    setLocalCompletedSteps({}); // Clear completed steps for a full retry
    onSubmit(hypercertData as HypercertFormData); // Resubmit with current form values
  };

  return (
    <Paper p="xl" radius="lg" bg="transparent">
      <Stack gap="xl">
        <Title order={2} c="white">
          Create Project
        </Title>
        <Text>
          This will create a Hypercert, a Hyperfund and Hyperstaker pool, and an
          Allo Pool.
        </Text>
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
            onClick={() => onSubmit(hypercertData as HypercertFormData)}
            loading={isSubmitting}
            disabled={hypercertData == undefined}
          >
            {isSubmitting ? "Creating..." : "Next Step"}
          </Button>
        </Group>
      </Stack>

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
            value={(currentStepIndex / steps.length) * 100} // Calculate percentage
            animated={stepStatus === "processing"}
            size="lg"
            radius="sm"
          />

          {steps.map((step, index) => {
            const stepKey = [
              "hypercertId",
              "hyperfundAddress",
              "hyperstakerAddress",
            ][index] as keyof typeof localCompletedSteps;
            const isCompleted = index < currentStepIndex;
            const isActive =
              index === currentStepIndex && stepStatus === "processing";
            const stepData = localCompletedSteps[stepKey];

            return (
              <StepBox key={step} isActive={isActive} isCompleted={isCompleted}>
                {isCompleted && (
                  <Text span c="teal" mr={5}>
                    ✓
                  </Text>
                )}
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
              <Text c="red" ta="center" fw={500} mb="xs">
                Error:
              </Text>
              <Text c="red" ta="center" size="sm" mb="md">
                {errorMessage}
              </Text>
              <Center>
                <Button variant="light" color="red" onClick={handleRetry}>
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
