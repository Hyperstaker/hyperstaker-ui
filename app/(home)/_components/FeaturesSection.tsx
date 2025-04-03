import React from "react";
import { Container, Title, Text, SimpleGrid } from "@mantine/core";
import { 
  IconGitPullRequest, 
  IconUsers, 
  IconCode, 
  IconBriefcase, 
  IconChartBar, 
  IconWorld 
} from "@tabler/icons-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  iconColor,
  title,
  description
}) => (
  <div className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#0a1020] p-8 transition-all duration-300 hover:border-[rgba(255,255,255,0.15)] hover:shadow-md">
    <div className="mb-5" style={{ color: iconColor }}>
      {icon}
    </div>
    <h3 className="text-white text-xl font-semibold mb-3">{title}</h3>
    <p className="text-[#94a3b8] leading-relaxed text-base">{description}</p>
  </div>
);

export const FeaturesSection: React.FC = () => {
  // Feature data
  const features: FeatureCardProps[] = [
    {
      icon: <IconGitPullRequest size={32} stroke={1.5} />,
      iconColor: "#c4b5fd", // Light purple
      title: "Project Management",
      description: "AI-assisted tracking of tasks, milestones, and progress with GitHub integration for seamless workflow."
    },
    {
      icon: <IconUsers size={32} stroke={1.5} />,
      iconColor: "#93c5fd", // Light blue
      title: "Team Management",
      description: "Coordinate human and AI contributors efficiently, ensuring everyone works together harmoniously."
    },
    {
      icon: <IconCode size={32} stroke={1.5} />,
      iconColor: "#c4b5fd", // Light purple
      title: "Human/AI Coordination Layer",
      description: "Automate workflow optimization with AI agents that help manage tasks and improve productivity."
    },
    {
      icon: <IconBriefcase size={32} stroke={1.5} />,
      iconColor: "#6ee7b7", // Light green
      title: "Virtual Scalable Next-Gen VC",
      description: "Create a funding ecosystem for OSS projects that helps them grow from zero to one and beyond."
    },
    {
      icon: <IconChartBar size={32} stroke={1.5} />,
      iconColor: "#fcd34d", // Light amber
      title: "Fair Compensation",
      description: "Ensure contributors are rewarded based on their impact with transparent evaluation mechanisms."
    },
    {
      icon: <IconWorld size={32} stroke={1.5} />,
      iconColor: "#fda4af", // Light red
      title: "Self-Sovereign Software",
      description: "Enable teams to work in an autonomous, transparent, and fair ecosystem with decentralized governance."
    }
  ];

  return (
    <section className="py-24 w-full bg-[#0e1525]">
      <Container size="lg">
        <div className="mb-16 text-center">
          <Title 
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: "#a78bfa" }} // Specific purple color from design
          >
            Key Features & Differentiators
          </Title>
          <p className="text-gray-300 text-lg mb-8 max-w-[60%] mx-auto">
            Exponential combines AI-driven project coordination, decentralized funding, and a 
            governance model that rewards contributions fairly.
          </p>
        </div>

        <SimpleGrid
          cols={{ base: 1, md: 2, lg: 3 }}
          spacing={{ base: 16, md: 24 }}
          verticalSpacing={{ base: 16, md: 24 }}
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              iconColor={feature.iconColor}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </SimpleGrid>
      </Container>
    </section>
  );
}; 