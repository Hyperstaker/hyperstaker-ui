import { Container, Title, Text, Stack, Button, Group, ThemeIcon, Grid, Paper, Box, Center, Stepper, Timeline } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { useState } from 'react';
import { CreateAlloProfile } from './CreateAlloProfile';
import { CreateHypercert } from './CreateHypercert';
import { CreateHypers } from './CreateHypers';
/*
Allo Pool Data:
{
    "title": "title",
    "description": "desc",
    "website": "webstie",
    "projectTwitter": "positonic",
    "projectGithub": "positonic",
    "members": [
        "jamespfarrell@gmial.com"
    ],
    "credentials": "asdf",
    "logoImg": {},
    "logoImgData": "data:image/jpeg;base64,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",
    "bannerImg": {},
    "bannerImgData": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMC"
}
    _____________
    Hypercert Data: 
{
    "goal": 20000,
    "receivingAddress": "asdf",
    "impactScope": "scope",
    "excludedImpactScope": "asdf",
    "workScope": "work",
    "excludedWorkScope": [
        "asdf"
    ],
    "workTimeframeStart": "2025-04-03",
    "workTimeframeEnd": "2025-04-25",
    "impactTimeframeStart": "2025-04-25",
    "impactTimeframeEnd": "2025-04-25",
    "contributorsList": "asdf",
    "rights": [
        "asdf"
    ],
    "excludedRights": [
        "sdf"
    ]
}
    */
const steps = [
  {
    title: "Create your project",
    description: "Your profile & pool",
    completed: false
  },
  {
    title: "Create your Hypercert",
    description: "Your impact certificate",
    completed: false
  },
  // {
  //   title: "Create Allo Pool",
  //   description: "Holds your funds until allocated",
  //   completed: false,
  //   current: false
  // },
  {
    title: "Create Hyperstaker & Hyperfund Pool",
    description: "Distributes your funds",
    completed: false
  }
];
const stepsLong = [
  {
    title: "Create Allo Profile",
    description: "Used to interact with the Allo protocol",
    completed: false
  },
  {
    title: "Create Hypercert",
    description: "Your impact certificate",
    completed: false
  },
  {
    title: "Create Allo Pool",
    description: "The pool holds your funds until they are allocated to your project",
    completed: false,
    current: false
  },
  {
    title: "Create Hyperfund Pool",
    description: "Used to distribute your funds to contributors",
    completed: false
  },
  {
    title: "Create Hyperstaker",
    description: "Align incentives between the project and the contributors",
    completed: false
  }
];
// First, let's extract the sidebar into its own component
function ProgressSidebar({ currentStep }: { currentStep: number }) {
  return (
    <Paper 
      p="lg" 
      radius="lg"
      
    >
      <Title order={3} c="white" mb="xl">Creation Steps</Title>
      <Timeline active={currentStep} bulletSize={32} lineWidth={2}>
        {stepsLong.map((step, index) => (
          <Timeline.Item
            key={index}
            bullet={
              step.completed ? (
                <ThemeIcon 
                  size={32} 
                  radius="xl"
                  variant="light"
                  color="teal"
                >
                  <IconCheck size={20} />
                </ThemeIcon>
              ) : (
                <ThemeIcon 
                  size={32} 
                  radius="xl"
                  variant="light"
                  color={index === currentStep ? 'blue' : 'gray'}
                >
                  {index + 1}
                </ThemeIcon>
              )
            }
            title={
              <Text 
                size="md" 
                c={index === currentStep ? 'blue' : step.completed ? 'teal' : 'gray.3'}
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
            padding: '20px 0',
          },
          separator: {
            backgroundColor: 'var(--mantine-color-dark-4)',
            flex: '1 1 auto',
          },
          stepBody: {
            color: 'var(--mantine-color-gray-4)',
            maxWidth: '300px',
          },
          stepLabel: {
            color: 'var(--mantine-color-white)',
            fontSize: '16px',
            fontWeight: 600,
          },
          stepDescription: {
            color: 'var(--mantine-color-gray-5)',
          },
          step: {
            padding: '0 16px',
            flex: '0 0 auto',
          },
          steps: {
            justifyContent: 'space-between',
          }
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

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(-1);

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
          />
        );
      case 1:
        return (
          <CreateHypercert 
            onNext={() => setCurrentStep(2)} 
            onPrevious={handlePreviousStep}
          />
        );
        case 2:
          return (
            <CreateHypers 
              onNext={() => setCurrentStep(3)} 
              onPrevious={handlePreviousStep}
            />
          );
      // Add other cases for future steps
      default:
        return null;
    }
  };

  // Show welcome screen if currentStep is -1
  if (currentStep === -1) {
    return (
      
        <Container 
          size="xl" 
          py={50}
          style={{
            minHeight: '100vh'
          }}
        >
          <StepsProgress currentStep={currentStep} />
          <Grid gutter={60}>
            {/* Main content column */}
            <Grid.Col span={12}>
              <Stack gap="xl">
                <div>
                  <Title order={1} size={48} fw={700} c="white" mb="sm">
                    Let's get your project funded
                  </Title>
                  <Text size="lg" c="gray.4">
                    This is a multi-step process and takes approximately 3 minutes to complete, during which time we will:
                  </Text>
                  
                </div>

                {/* Image in a styled container */}
                <Paper 
                  radius="md" 
                  p="md"
                  style={{ 
                    overflow: 'hidden',
                    background: 'linear-gradient(45deg, var(--mantine-color-dark-7), var(--mantine-color-dark-6))'
                  }}
                >
                  <img 
                    src="/img/about-hyperstaker.png" 
                    alt="About Hyperstaker" 
                    style={{ 
                      width: '100%',
                      borderRadius: 'var(--mantine-radius-md)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                    }}
                  />
                </Paper>

                <Center>
                  <Button 
                    size="lg"
                    variant="gradient"
                    gradient={{ from: 'blue', to: 'cyan' }}
                    radius="md"
                    style={{ minWidth: 200 }}
                    onClick={() => setCurrentStep(0)}
                  >
                    Let's go
                  </Button>
                </Center>
              </Stack>
            </Grid.Col>

            {/* Progress sidebar column */}
            {/* <Grid.Col span={4}>
              <ProgressSidebar currentStep={currentStep} />
            </Grid.Col> */}
          </Grid>
        </Container>
     
    );
  }

  return (
    <Box style={{ 
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: '#363636'
    }}>
      <Container 
        size="xl"
        py={50}
        style={{
          backgroundColor: '#1A1B1E',
          minHeight: '100vh',
          maxWidth: '1800px',
          width: '100%'
        }}
      >
        <StepsProgress currentStep={currentStep} />
        <Grid gutter={60}>
          {/* Main content column */}
          <Grid.Col span={12}>
            {renderCurrentStep()}
          </Grid.Col>

          {/* Progress sidebar column */}
          {/* <Grid.Col span={4}>
            <ProgressSidebar currentStep={currentStep} />
          </Grid.Col> */}
        </Grid>
      </Container>
    </Box>
  );
} 