import { Container, Title, Text, Stack, Button, Group, ThemeIcon, Grid, Paper, Box, Center } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

const steps = [
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

export function OnboardingFlow() {
  return (
    <Box style={{ minHeight: '100vh' }}>
      <Container size="lg" py={50}>
        <Grid gutter={60}>
          {/* Main content column */}
          <Grid.Col span={8}>
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
                >
                  Let's go
                </Button>
              </Center>
            </Stack>
          </Grid.Col>

          {/* Progress sidebar column */}
          <Grid.Col span={4}>
            <Paper 
              p="xl" 
              radius="lg"
              bg="dark.7"
              style={{ border: '1px solid var(--mantine-color-dark-4)' }}
            >
              <Title order={3} c="white" mb="xl">Steps</Title>
              <Stack gap="lg">
                {steps.map((step, index) => (
                  <Group key={index} wrap="nowrap">
                    <ThemeIcon 
                      size={36} 
                      radius="xl"
                      variant="light"
                      color={step.completed ? 'teal' : 'blue'}
                      style={{ border: '2px solid var(--mantine-color-dark-4)' }}
                    >
                      {step.completed ? <IconCheck size={20} /> : (index + 1)}
                    </ThemeIcon>
                    <div>
                      <Text 
                        size="md" 
                        c={step.current ? 'blue' : step.completed ? 'teal' : 'gray.3'}
                        fw={600}
                      >
                        {step.title}
                      </Text>
                      {step.description && (
                        <Text size="sm" c="dimmed">{step.description}</Text>
                      )}
                    </div>
                  </Group>
                ))}
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
} 