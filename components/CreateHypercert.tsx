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
import { useForm, UseFormReturn } from "react-hook-form";
import { Dispatch, SetStateAction, useState } from "react";
import { HypercertFormData } from "./OnboardingFlow";

interface CreateHypercertProps {
  onNext: () => void;
  onPrevious: () => void;
  hypercertState: [
    HypercertFormData,
    Dispatch<SetStateAction<HypercertFormData>>
  ];
  hypercertForm: UseFormReturn<HypercertFormData, any, HypercertFormData>;
}

export function CreateHypercert({
  onNext,
  onPrevious,
  hypercertState,
  hypercertForm,
}: CreateHypercertProps) {
  const [hypercertData, setHypercertData] = hypercertState;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const form = hypercertForm;

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
            Create Project
          </Title>
          <Text>
            When you create a project you mint a new{" "}
            <a
              href="https://hypercerts.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              {" "}
              Hypercert
            </a>
            . A hypercert is a digital certificate that represents a
            contribution to a project. It is a way to recognize and reward the
            work of individuals and organizations.
          </Text>
          <TextInput
            label="Project Title"
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
            label="Project Description"
            placeholder="Describe your project"
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
            label="Project Image"
            placeholder="Enter your project image"
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

          <Button
            variant="subtle"
            color="blue"
            onClick={() => setShowAdvanced((prev) => !prev)}
            mt="md"
          >
            {showAdvanced
              ? "Hide Advanced Configurations"
              : "Advanced Configurations"}
          </Button>

          {showAdvanced && (
            <>
              <TextInput
                label="Excluded Impact Scope"
                placeholder="Comma-separated list"
                description="Specify areas or categories that your project explicitly does NOT impact. For example, if your project focuses on education but not healthcare, you might list 'Healthcare' here."
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
                description="List the specific activities or types of work your project will undertake. For example: 'Software Development, Community Building, Documentation'"
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
                description="Specify types of work that your project will NOT engage in. For example, if your project doesn't involve hardware development, you might list 'Hardware Development' here."
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
                description="When will your project's work activities begin? This is when you plan to start implementing your project."
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
                description="When do you expect to complete the main work of your project? This is your target completion date."
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
                description="When do you expect your project to start making a positive impact? This might be different from your work start date if there's a delay between work and impact."
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
                description="How long do you expect your project's impact to last? This could be ongoing if your project creates lasting change."
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
                description="List the Ethereum addresses of all team members and contributors who will be working on this project. These people will receive recognition for their contributions."
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
                description="What rights or permissions do you want to grant to contributors? For example: 'Recognition, Revenue Share, Governance Rights'"
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
                description="Specify any rights that contributors will NOT receive. For example, if you don't want to grant commercial usage rights, you might list 'Commercial Usage' here."
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
            </>
          )}

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
