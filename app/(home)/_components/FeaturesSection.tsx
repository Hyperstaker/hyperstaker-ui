import React from "react";
import { Container, Title, SimpleGrid } from "@mantine/core";
import {
  IconCertificate,
  IconCurrencyDollar,
  IconBolt,
  IconUsers,
  IconRocket,
  IconLayoutGrid
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
  const features: FeatureCardProps[] = [
    {
      icon: <IconCertificate size={32} stroke={1.5} />,
      iconColor: "#c4b5fd",
      title: "HyperCerts",
      description: "Programmatic, tradable proof of contribution that links early work to future value."
    },
    {
      icon: <IconCurrencyDollar size={32} stroke={1.5} />,
      iconColor: "#6ee7b7",
      title: "Prospective & Retro Funding",
      description: "Mix early-stage capital with retroactive rewards to fund innovation at any stage."
    },
    {
      icon: <IconBolt size={32} stroke={1.5} />,
      iconColor: "#facc15",
      title: "Aligned Incentives",
      description: "Builders, funders, and speculators all benefit when projects succeed — not just VCs."
    },
    {
      icon: <IconUsers size={32} stroke={1.5} />,
      iconColor: "#93c5fd",
      title: "Governance by Builders",
      description: "Contributors earn decision-making power by staking their HyperCerts."
    },
    {
      icon: <IconRocket size={32} stroke={1.5} />,
      iconColor: "#f472b6",
      title: "Bootstrapping Made Easy",
      description: "Pre-launch HyperCerts enable projects to fundraise and onboard contributors from day one."
    },
    {
      icon: <IconLayoutGrid size={32} stroke={1.5} />,
      iconColor: "#fda4af",
      title: "Composable & Interoperable",
      description: "Built to work with Gitcoin, Allo, and the broader web3 funding ecosystem."
    }
  ];

  return (
    <section className="py-24 w-full bg-bg-base">
      <Container size="lg">
        <div className="mb-16 text-center">
          <Title
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: "#a78bfa" }}
          >
            Core Innovations of Hyperstaker
          </Title>
          <p className="text-gray-300 text-lg mb-8 max-w-[60%] mx-auto">
            A new foundation for open-source sustainability: programmable rewards, shared risk, and retroactive value alignment.
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
