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
  ActionIcon,
  Group,
  Menu,
  Badge,
} from "@mantine/core";
import { IconCheck, IconBell, IconX } from "@tabler/icons-react";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { CreateAlloProfile } from "./CreateAlloProfile";
import { CreateHypercert } from "./CreateHypercert";
import { CreateNewProject } from "./CreateNewProject";
import { useForm, UseFormReturn } from "react-hook-form";
import { useAccount } from "wagmi";
import { notifications } from "@mantine/notifications";

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

interface PendingProject {
  organisationName: string;
  projectName: string;
  walletAddress: string;
}

export function OnboardingFlow() {
  const ipfsHash = useState<string>("");
  const alloProfile = useState<string>("");
  const hypercertId = useState<HypercertFormData>();
  const [currentStep, setCurrentStep] = useState(-1);
  const [, setContinueOnboarding] = useState(false);
  const continueOnboardingParam = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [pendingProjects, setPendingProjects] = useState<PendingProject[]>([]);

  const hypercertForm = useForm<HypercertFormData>({});
  const alloProfileForm = useForm<AlloProfileFormData>({});
  const account = useAccount();
  const [pendingProgress, setPendingProgress] = useState<PendingProject[]>();

  // Add this useEffect to check for the "alloprofile" query param on mount
  useEffect(() => {
    const getProgress = async (alloProfileParam: string) => {
      const resp = await fetch("/api/getProgress", {
        method: "POST",
        body: JSON.stringify({
          walletAddress: account.address,
          projectName: alloProfileParam,
        }),
      });
      const formData = await resp.json();
      continueOnboardingParam[1](formData);
      hypercertForm.setValue("title", formData.formData.title);
      hypercertForm.setValue("description", formData.formData.description);
      hypercertForm.setValue("image", formData.formData.image);
      hypercertForm.setValue("goal", formData.formData.goal);
      hypercertForm.setValue("impactScope", formData.formData.impactScope);
      hypercertForm.setValue(
        "excludedImpactScope",
        formData.formData.excludedImpactScope
      );
      hypercertForm.setValue("workScope", formData.formData.workScope);
      hypercertForm.setValue(
        "excludedWorkScope",
        formData.formData.excludedWorkScope
      );
      hypercertForm.setValue(
        "workTimeframeStart",
        formData.formData.workTimeframeStart
      );
      hypercertForm.setValue(
        "workTimeframeEnd",
        formData.formData.workTimeframeEnd
      );
      hypercertForm.setValue(
        "impactTimeframeStart",
        formData.formData.impactTimeframeStart
      );
      hypercertForm.setValue(
        "impactTimeframeEnd",
        formData.formData.impactTimeframeEnd
      );
      hypercertForm.setValue(
        "contributorsList",
        formData.formData.contributorsList
      );
      hypercertForm.setValue("rights", formData.formData.rights);
      hypercertForm.setValue(
        "excludedRights",
        formData.formData.excludedRights
      );
    };

    const getPendingProgress = async () => {
      const resp = await fetch(
        "/api/getProgress?walletAddress=" + account.address,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const pendingProgress = await resp.json();
      setPendingProgress(pendingProgress);
    };

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const alloProfileParam = params.get("alloprofile");
      if (alloProfileParam) {
        alloProfile[1](alloProfileParam); // set the state
        setCurrentStep(1);
      }
      getPendingProgress();
      const continueOnboardingParam = params.get("continueOnboarding");
      const projectNameParam = params.get("projectName");
      if (continueOnboardingParam) {
        setContinueOnboarding(continueOnboardingParam === "true");
        getProgress(projectNameParam as string);
      }
    }
  }, [account.address]);

  // Add this useEffect to check for pending projects
  useEffect(() => {
    const checkPendingProjects = async () => {
      if (pendingProgress && pendingProgress.length > 0) {
        setPendingProjects(pendingProgress);
        setShowNotification(true);
        notifications.show({
          id: "pending-projects",
          title: "Pending Projects",
          message: `You have ${pendingProgress.length} pending project(s) to complete`,
          color: "blue",
          icon: <IconBell size={20} />,
          autoClose: false,
          withCloseButton: true,
        });
      }
    };

    checkPendingProjects();
  }, [pendingProgress]);

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(-1, prev - 1));
  };

  const handleProjectClick = (project: PendingProject) => {
    const url = `/organizations/create?alloprofile=${project.organisationName}&projectName=${project.projectName}&continueOnboarding=true`;
    window.location.href = url;
  };

  const handleDismissNotification = () => {
    setShowNotification(false);
    notifications.hide("pending-projects");
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
          <CreateNewProject
            alloProfileState={alloProfile}
            ipfsHash={ipfsHash}
            hypercertState={
              hypercertId as unknown as [
                HypercertFormData,
                Dispatch<SetStateAction<HypercertFormData>>
              ]
            }
            onPrevious={handlePreviousStep}
            continueOnboardingParam={continueOnboardingParam}
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
        <Group justify="flex-end" mb="md">
          {showNotification && (
            <Menu shadow="md" width={300}>
              <Menu.Target>
                <ActionIcon size="lg" variant="light" color="blue">
                  <Badge
                    size="xs"
                    color="red"
                    variant="filled"
                    style={{ position: "absolute", top: -5, right: -5 }}
                  >
                    {pendingProjects.length}
                  </Badge>
                  <IconBell size={20} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Pending Projects</Menu.Label>
                {pendingProjects.map((project, index) => (
                  <Menu.Item
                    key={index}
                    onClick={() => handleProjectClick(project)}
                    rightSection={
                      <ActionIcon
                        color="red"
                        variant="subtle"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDismissNotification();
                        }}
                      >
                        <IconX size={16} />
                      </ActionIcon>
                    }
                  >
                    {project.projectName}
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
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
                  Contribute
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
