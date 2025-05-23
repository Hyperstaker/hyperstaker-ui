import {
  Container,
  Title,
  Text,
  Stack,
  Button,
  ThemeIcon,
  Grid,
  Paper,
  Box,
  Center,
  Stepper,
  Timeline,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { CreateAlloProfile } from "./CreateAlloProfile";
import { CreateHypercert } from "./CreateHypercert";
import { CreateHypers } from "./CreateHypers";
import { useForm, UseFormReturn } from "react-hook-form";

export interface HypercertFormData {
  title: string;
  description: string;
  image?: string;
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

const steps = [
  {
    title: "Create Organisation",
    description: "Your allo profile",
    completed: false,
  },
  {
    title: "Create your Project",
    description: "Your impact certificate",
    completed: false,
  },
  {
    title: "Create Hyperstaker & Hyperfund Pool",
    description: "Distributes your funds",
    completed: false,
  },
];

const stepsLong = [
  {
    title: "Create Allo Profile",
    description: "Used to interact with the Allo protocol",
    completed: false,
  },
  {
    title: "Create Hypercert",
    description: "Your impact certificate",
    completed: false,
  },
  {
    title: "Create Allo Pool",
    description:
      "The pool holds your funds until they are allocated to your project",
    completed: false,
    current: false,
  },
  {
    title: "Create Hyperfund Pool",
    description: "Used to distribute your funds to contributors",
    completed: false,
  },
  {
    title: "Create Hyperstaker",
    description: "Align incentives between the project and the contributors",
    completed: false,
  },
];

// First, let"s extract the sidebar into its own component
function ProgressSidebar({ currentStep }: { currentStep: number }) {
  return (
    <Paper p="lg" radius="lg">
      <Title order={3} c="white" mb="xl">
        Creation Steps
      </Title>
      <Timeline active={currentStep} bulletSize={32} lineWidth={2}>
        {stepsLong.map((step, index) => (
          <Timeline.Item
            key={index}
            bullet={
              step.completed ? (
                <ThemeIcon size={32} radius="xl" variant="light" color="teal">
                  <IconCheck size={20} />
                </ThemeIcon>
              ) : (
                <ThemeIcon
                  size={32}
                  radius="xl"
                  variant="light"
                  color={index === currentStep ? "blue" : "gray"}
                >
                  {index + 1}
                </ThemeIcon>
              )
            }
            title={
              <Text
                size="md"
                c={
                  index === currentStep
                    ? "blue"
                    : step.completed
                    ? "teal"
                    : "gray.3"
                }
                fw={600}
              >
                {step.title}
              </Text>
            }
          >
            <Text size="sm" c="dimmed" mt={4}>
              {step.description}
            </Text>
          </Timeline.Item>
        ))}
      </Timeline>
    </Paper>
  );
}

// Add this new component
function StepsProgress({ currentStep }: { currentStep: number }) {
  return (
    <Box mb={40}>
      <Stepper
        active={currentStep === -1 ? 0 : currentStep}
        color="blue"
        styles={{
          root: {
            padding: "20px 0",
          },
          separator: {
            backgroundColor: "var(--mantine-color-dark-4)",
            flex: "1 1 auto",
          },
          stepBody: {
            color: "var(--mantine-color-gray-4)",
            maxWidth: "300px",
          },
          stepLabel: {
            color: "var(--mantine-color-white)",
            fontSize: "16px",
            fontWeight: 600,
          },
          stepDescription: {
            color: "var(--mantine-color-gray-5)",
          },
          step: {
            padding: "0 16px",
            flex: "0 0 auto",
          },
          steps: {
            justifyContent: "space-between",
          },
        }}
      >
        {steps.map((step, index) => (
          <Stepper.Step
            key={index}
            label={step.title}
            description={step.description}
            completedIcon={<IconCheck size={20} />}
          />
        ))}
      </Stepper>
    </Box>
  );
}

export interface AlloProfileFormData {
  title: string;
  description: string;
  website: string;
  projectTwitter: string;
  projectGithub: string;
  logoImg: File | null;
  bannerImg: File | null;
  logoImgData: string;
  bannerImgData: string;
  credentials: string[];
  members: string[];
}

export function OnboardingFlow() {
  const ipfsHash = useState<string>("");
  const alloProfile = useState<string>("");
  const hypercertId = useState<HypercertFormData>();
  const [currentStep, setCurrentStep] = useState(-1);

  const hypercertForm = useForm<HypercertFormData>({});
  const alloProfileForm = useForm<AlloProfileFormData>({});

  // Add this useEffect to check for the "alloprofile" query param on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const alloProfileParam = params.get("alloprofile");
      if (alloProfileParam) {
        alloProfile[1](alloProfileParam); // set the state
        setCurrentStep(1);
      }
    }
  }, []);

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(-1, prev - 1));
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <CreateAlloProfile
            onNext={() => setCurrentStep(1)}
            onPrevious={handlePreviousStep}
            alloProfileState={alloProfile}
            ipfsHash={ipfsHash}
            alloForm={
              alloProfileForm as unknown as UseFormReturn<
                AlloProfileFormData,
                any,
                AlloProfileFormData
              >
            }
          />
        );
      case 1:
        return (
          <CreateHypercert
            onNext={() => setCurrentStep(2)}
            onPrevious={handlePreviousStep}
            hypercertState={
              hypercertId as unknown as [
                HypercertFormData,
                Dispatch<SetStateAction<HypercertFormData>>
              ]
            }
            hypercertForm={
              hypercertForm as unknown as UseFormReturn<
                HypercertFormData,
                any,
                HypercertFormData
              >
            }
          />
        );
      case 2:
        return (
          <CreateHypers
            alloProfileState={alloProfile}
            ipfsHash={ipfsHash}
            hypercertState={
              hypercertId as unknown as [
                HypercertFormData,
                Dispatch<SetStateAction<HypercertFormData>>
              ]
            }
            onPrevious={handlePreviousStep}
          />
        );
      default:
        return null;
    }
  };

  if (currentStep === -1) {
    return (
      <Container
        size="xl"
        py={50}
        style={{
          minHeight: "100vh",
        }}
      >
        <StepsProgress currentStep={currentStep} />
        <Grid gutter={60}>
          <Grid.Col span={12}>
            <Stack gap="xl">
              <div>
                <Title order={1} size={48} fw={700} c="white" mb="sm">
                  Let&apos;s get your project funded
                </Title>
                <Text size="lg" c="gray.4">
                  This is a multi-step process and takes approximately 3 minutes
                  to complete, during which time we will:
                </Text>
              </div>

              <Paper
                radius="md"
                p="md"
                style={{
                  overflow: "hidden",
                  background:
                    "linear-gradient(45deg, var(--mantine-color-dark-7), var(--mantine-color-dark-6))",
                }}
              >
                <img
                  src="/img/about-hyperstaker.png"
                  alt="About Hyperstaker"
                  style={{
                    width: "100%",
                    borderRadius: "var(--mantine-radius-md)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                  }}
                />
              </Paper>

              <Center>
                <Button
                  size="lg"
                  variant="gradient"
                  gradient={{ from: "blue", to: "cyan" }}
                  radius="md"
                  style={{ minWidth: 200 }}
                  onClick={() => setCurrentStep(0)}
                >
                  Let&apos;s go
                </Button>
              </Center>
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>
    );
  }

  return (
    <Box
      style={{
        width: "100vw",
        minHeight: "100vh",
      }}
    >
      <Container
        size="xl"
        py={50}
        style={{
          minHeight: "100vh",
          maxWidth: "1800px",
          width: "100%",
        }}
      >
        <StepsProgress currentStep={currentStep} />
        <Grid gutter={60}>
          <Grid.Col span={12}>{renderCurrentStep()}</Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}
