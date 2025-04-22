import { useHypercertClient } from "@/hooks/useHypercertClient";
import { formatHypercertData, TransferRestrictions } from "@hypercerts-org/sdk";
import {
  TextInput,
  Text,
  Paper,
  Title,
  Stack,
  Button,
  Group,
  Textarea,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import "@mantine/dates/styles.css";
import { useForm } from "react-hook-form";
import { useAccount, useConfig } from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { decodeAbiParameters } from "viem";
import { Dispatch, SetStateAction, useState } from "react";
import { HypercertFormData } from "./OnboardingFlow";

const testing = true;

interface CreateHypercertProps {
  onNext: () => void;
  onPrevious: () => void;
  hypercertState: [
    HypercertFormData | undefined,
    Dispatch<SetStateAction<HypercertFormData | undefined>>
  ];
}

export function CreateHypercert({
  onNext,
  onPrevious,
  hypercertState,
}: CreateHypercertProps) {
  const account = useAccount();
  const { client } = useHypercertClient();
  const wagmiConfig = useConfig();
  const [hypercertData, setHypercertData] = hypercertState;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const defaultValues = testing
    ? {
        goal: "100000",
        impactScope: ["Climate Change", "Clean Energy", "Carbon Reduction"],
        excludedImpactScope: ["Fossil Fuels"],
        workScope: ["Research", "Development", "Implementation"],
        excludedWorkScope: ["Marketing"],
        workTimeframeStart: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000),
        workTimeframeEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        impactTimeframeStart: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000),
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

  // const createHypercert = async (hypercertFormData: HypercertFormData) => {
  //   if (hypercertid) {
  //     return;
  //   }
  //   const metadata = formatHypercertData({
  //     name: hypercertFormData.title,
  //     description: hypercertFormData.description,
  //     image: hypercertFormData.image ?? "",
  //     version: "1.0",
  //     impactScope: [...hypercertFormData.impactScope],
  //     excludedImpactScope: [...hypercertFormData.excludedImpactScope],
  //     workScope: [...hypercertFormData.workScope],
  //     excludedWorkScope: hypercertFormData.excludedWorkScope as string[],
  //     workTimeframeStart:
  //       new Date(hypercertFormData.workTimeframeStart).getTime() / 1000,
  //     workTimeframeEnd:
  //       new Date(hypercertFormData.workTimeframeEnd).getTime() / 1000,
  //     impactTimeframeStart:
  //       new Date(hypercertFormData.impactTimeframeStart).getTime() / 1000,
  //     impactTimeframeEnd:
  //       new Date(hypercertFormData.impactTimeframeEnd).getTime() / 1000,
  //     contributors: hypercertFormData.contributorsList
  //       ? [account.address as string, ...hypercertFormData.contributorsList]
  //       : [account.address as string],
  //     rights: [...hypercertFormData.rights],
  //     excludedRights: [...hypercertFormData.excludedRights],
  //   });

  //   if (!metadata.data) {
  //     throw new Error("Metadata is null");
  //   }

  //   const txId = await client.mintHypercert({
  //     metaData: metadata.data,
  //     totalUnits: BigInt(hypercertFormData.goal) * BigInt(1000000),
  //     transferRestriction: TransferRestrictions.AllowAll,
  //   });

  //   const txReceipt = await waitForTransactionReceipt(wagmiConfig, {
  //     hash: txId,
  //     confirmations: 3,
  //   });

  //   // Extract hypercertId from transaction receipt events
  //   const hypercertId = decodeAbiParameters(
  //     [{ name: "id", type: "uint256" }],
  //     txReceipt.logs[0]?.topics[1] as `0x${string}`
  //   )[0];

  //   setHypercertId(hypercertId.toString());
  // };

  const onSubmit = async (data: HypercertFormData) => {
    setIsSubmitting(true);
    setHypercertData(data);
    try {
      // await createHypercert(data);
      onNext();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper p="xl" bg="transparent">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Stack gap="xl">
          <Title order={2} c="white">
            Create Hypercert
          </Title>
          <Text>
            A hypercert is a digital certificate that represents a contribution
            to a project. It is a way to recognize and reward the work of
            individuals and organizations.
          </Text>
          <TextInput
            label="Hypercert Title"
            placeholder="Enter your hypercert title"
            required
            error={form.formState.errors.title?.message}
            {...form.register("title", {
              required: "Title is required",
            })}
            styles={{
              label: { color: "var(--mantine-color-gray-4)" },
              input: {
                backgroundColor: "var(--mantine-color-dark-6)",
                color: "var(--mantine-color-white)",
                border: "1px solid var(--mantine-color-dark-4)",
              },
            }}
          />

          <Textarea
            label="Hypercert Description"
            placeholder="Describe your Hypercert"
            required
            minRows={4}
            error={form.formState.errors.description?.message}
            {...form.register("description", {
              required: "Description is required",
            })}
            styles={{
              label: { color: "var(--mantine-color-gray-4)" },
              input: {
                backgroundColor: "var(--mantine-color-dark-6)",
                color: "var(--mantine-color-white)",
                border: "1px solid var(--mantine-color-dark-4)",
              },
            }}
          />
          <TextInput
            label="Hypercert Image"
            placeholder="Enter your hypercert image"
            error={form.formState.errors.title?.message}
            {...form.register("image")}
            styles={{
              label: { color: "var(--mantine-color-gray-4)" },
              input: {
                backgroundColor: "var(--mantine-color-dark-6)",
                color: "var(--mantine-color-white)",
                border: "1px solid var(--mantine-color-dark-4)",
              },
            }}
          />
          <TextInput
            label="Project Goal (USD)"
            placeholder="Enter amount"
            required
            {...form.register("goal", { required: "Goal is required" })}
          />

          <TextInput
            label="Impact Scope"
            placeholder="Comma-separated list"
            required
            description="Inside the Changescape impact scope is used to refer thematically to projects by category. For example, the UN Sustainable Development Goals (SDGs) or the Ecological Benefits Framework (EBF). Because the Hypercerts data is only aspirational, it would be premature to immutably publish indicators, which are instead reserved to be published only once verified inside Change Credits."
            {...(form.register("impactScope"),
            {
              onChange: (e) => {
                form.setValue(
                  "impactScope",
                  e.target.value
                    .split(",")
                    .map((i) => i.trim())
                    .filter((i) => i !== "")
                );
              },
            })}
          />

          <TextInput
            label="Excluded Impact Scope"
            placeholder="Comma-separated list"
            {...(form.register("excludedImpactScope"),
            {
              onChange: (e) => {
                form.setValue(
                  "excludedImpactScope",
                  e.target.value
                    .split(",")
                    .map((i) => i.trim())
                    .filter((i) => i !== "")
                );
              },
            })}
          />

          <TextInput
            label="Work Scope"
            placeholder="Comma-separated list"
            required
            {...(form.register("workScope"),
            {
              onChange: (e) => {
                form.setValue(
                  "workScope",
                  e.target.value
                    .split(",")
                    .map((i) => i.trim())
                    .filter((i) => i !== "")
                );
              },
            })}
          />

          <TextInput
            label="Excluded Work Scope"
            placeholder="Comma-separated list"
            {...(form.register("excludedWorkScope"),
            {
              onChange: (e) => {
                form.setValue(
                  "excludedWorkScope",
                  e.target.value
                    .split(",")
                    .map((i) => i.trim())
                    .filter((i) => i !== "")
                );
              },
            })}
          />

          <DateInput
            label="Work Start Date"
            required
            value={form.watch("workTimeframeStart")}
            onChange={(value) =>
              value && form.setValue("workTimeframeStart", value)
            }
            styles={{
              label: { color: "var(--mantine-color-gray-4)" },
              input: {
                backgroundColor: "var(--mantine-color-dark-6)",
                color: "var(--mantine-color-white)",
                border: "1px solid var(--mantine-color-dark-4)",
              },
            }}
          />

          <DateInput
            label="Work End Date"
            required
            value={form.watch("workTimeframeEnd")}
            onChange={(value) =>
              value && form.setValue("workTimeframeEnd", value)
            }
            styles={{
              label: { color: "var(--mantine-color-gray-4)" },
              input: {
                backgroundColor: "var(--mantine-color-dark-6)",
                color: "var(--mantine-color-white)",
                border: "1px solid var(--mantine-color-dark-4)",
              },
            }}
          />

          <DateInput
            label="Impact Start Date"
            required
            value={form.watch("impactTimeframeStart")}
            onChange={(value) =>
              value && form.setValue("impactTimeframeStart", value)
            }
            styles={{
              label: { color: "var(--mantine-color-gray-4)" },
              input: {
                backgroundColor: "var(--mantine-color-dark-6)",
                color: "var(--mantine-color-white)",
                border: "1px solid var(--mantine-color-dark-4)",
              },
            }}
          />

          <DateInput
            label="Impact End Date"
            required
            value={form.watch("impactTimeframeEnd")}
            onChange={(value) =>
              value && form.setValue("impactTimeframeEnd", value)
            }
            styles={{
              label: { color: "var(--mantine-color-gray-4)" },
              input: {
                backgroundColor: "var(--mantine-color-dark-6)",
                color: "var(--mantine-color-white)",
                border: "1px solid var(--mantine-color-dark-4)",
              },
            }}
          />

          <TextInput
            label="Contributors"
            placeholder="Comma-separated list of addresses"
            {...(form.register("contributorsList"),
            {
              onChange: (e) => {
                form.setValue(
                  "contributorsList",
                  e.target.value
                    .split(",")
                    .map((i) => i.trim())
                    .filter((i) => i !== "")
                );
              },
            })}
          />

          <TextInput
            label="Rights"
            placeholder="Comma-separated list"
            required
            {...(form.register("rights"),
            {
              onChange: (e) => {
                form.setValue(
                  "rights",
                  e.target.value
                    .split(",")
                    .map((i) => i.trim())
                    .filter((i) => i !== "")
                );
              },
            })}
          />

          <TextInput
            label="Excluded Rights"
            placeholder="Comma-separated list"
            {...(form.register("excludedRights"),
            {
              onChange: (e) => {
                form.setValue(
                  "excludedRights",
                  e.target.value
                    .split(",")
                    .map((i) => i.trim())
                    .filter((i) => i !== "")
                );
              },
            })}
          />

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
              {isSubmitting ? "Creating Profile..." : "Next Step"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}
