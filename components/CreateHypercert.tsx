import { TextInput, Text, Paper, Title, Stack, Button, Group } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import "@mantine/dates/styles.css";
import { useForm } from "react-hook-form";

const testing = true;

interface CreateHypercertProps {
  onNext: () => void;
  onPrevious: () => void;
}

interface HypercertFormData {
  goal: string;
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

export function CreateHypercert({ onNext, onPrevious }: CreateHypercertProps) {
  const defaultValues = testing ? {
    goal: "100000",
    impactScope: ["Climate Change", "Clean Energy", "Carbon Reduction"],
    excludedImpactScope: ["Fossil Fuels"],
    workScope: ["Research", "Development", "Implementation"],
    excludedWorkScope: ["Marketing"],
    workTimeframeStart: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000),
    workTimeframeEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    impactTimeframeStart: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000),
    impactTimeframeEnd: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000), // 2 years from now
    contributorsList: ["0x1234567890123456789012345678901234567890", "0x0987654321098765432109876543210987654321"],
    rights: ["Commercial Use", "Distribution", "Modification"],
    excludedRights: ["Patent Rights"]
  } : {};

  const form = useForm<HypercertFormData>({
    defaultValues
  });

  const onSubmit = (data: HypercertFormData) => {
    console.log("Hypercert Data:", data);
    onNext();
  };

  return (
    <Paper 
      p="xl" 
      bg="transparent"
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Stack gap="xl">
          <Title order={2} c="white">Create Hypercert</Title>
          <Text>A hypercert is a digital certificate that represents a contribution to a project. It is a way to recognize and reward the work of individuals and organizations.</Text>
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
            {...form.register("impactScope")}
            onChange={(e) => {
              form.setValue("impactScope", e.target.value.split(",").map(i => i.trim()).filter(i => i !== ""));
            }}
          />

          <TextInput
            label="Excluded Impact Scope"
            placeholder="Comma-separated list"
            {...form.register("excludedImpactScope")}
            onChange={(e) => {
              form.setValue("excludedImpactScope", e.target.value.split(",").map(i => i.trim()).filter(i => i !== ""));
            }}
          />

          <TextInput
            label="Work Scope"
            placeholder="Comma-separated list"
            required
            {...form.register("workScope")}
            onChange={(e) => {
              form.setValue("workScope", e.target.value.split(",").map(i => i.trim()).filter(i => i !== ""));
            }}
          />

          <TextInput
            label="Excluded Work Scope"
            placeholder="Comma-separated list"
            {...form.register("excludedWorkScope")}
            onChange={(e) => {
              form.setValue("excludedWorkScope", e.target.value.split(",").map(i => i.trim()).filter(i => i !== ""));
            }}
          />

          <DateInput
            label="Work Start Date"
            required
            value={form.watch("workTimeframeStart")}
            onChange={(value) => value && form.setValue("workTimeframeStart", value)}
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
            onChange={(value) => value && form.setValue("workTimeframeEnd", value)}
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
            onChange={(value) => value && form.setValue("impactTimeframeStart", value)}
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
            onChange={(value) => value && form.setValue("impactTimeframeEnd", value)}
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
            {...form.register("contributorsList")}
            onChange={(e) => {
              form.setValue("contributorsList", e.target.value.split(",").map(i => i.trim()).filter(i => i !== ""));
            }}
          />

          <TextInput
            label="Rights"
            placeholder="Comma-separated list"
            required
            {...form.register("rights")}
            onChange={(e) => {
              form.setValue("rights", e.target.value.split(",").map(i => i.trim()).filter(i => i !== ""));
            }}
          />

          <TextInput
            label="Excluded Rights"
            placeholder="Comma-separated list"
            {...form.register("excludedRights")}
            onChange={(e) => {
              form.setValue("excludedRights", e.target.value.split(",").map(i => i.trim()).filter(i => i !== ""));
            }}
          />

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