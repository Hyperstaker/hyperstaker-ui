import React from "react";
import { Container, Group, Title, Text } from "@mantine/core";
import { 
  IconBolt, 
  IconMedal, 
  IconUsers, 
  IconCode 
} from "@tabler/icons-react";
import { IconCheck } from "@tabler/icons-react";

interface FeatureDetailCardProps {
  icon: React.ReactNode;
  iconColor: string;
  iconBgColor: string;
  title: string;
  description: string;
}

const FeatureDetailCard: React.FC<FeatureDetailCardProps> = ({
  icon,
  iconColor,
  iconBgColor,
  title,
  description
}) => (
  <div className="rounded-xl border border-[rgba(255,255,255,0.1)] p-8 transition-all duration-300 hover:border-[rgba(255,255,255,0.15)] hover:shadow-lg" 
    style={{ backgroundColor: iconBgColor }}>
    <div className="mb-6" style={{ color: iconColor }}>
      {icon}
    </div>
    <h3 className="text-white text-2xl font-semibold mb-3">{title}</h3>
    <p className="text-[#cbd5e1] leading-relaxed">{description}</p>
  </div>
);

const BenefitItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-start gap-3 mb-4">
    <IconCheck size={20} className="text-emerald-500 mt-0.5 flex-shrink-0" />
    <Text className="text-[#cbd5e1] text-lg">{children}</Text>
  </div>
);

export const ValuePropositionSection: React.FC = () => {
  const benefits = [
    "Open-source sustainability",
    "Fair compensation for contributions",
    "Human-AI collaboration",
    "Decentralized funding for innovation",
    "Rewarding early contributors",
    "Enabling self-sovereign software development"
  ];

  const features = [
    {
      icon: <IconBolt size={32} stroke={1.5} />,
      iconColor: "#c4b5fd", // Light purple
      iconBgColor: "#170F24", // Dark purple background
      title: "HyperFund Mechanism",
      description: "Stake HyperCerts to earn governance tokens and participate in project funding decisions."
    },
    {
      icon: <IconMedal size={32} stroke={1.5} />,
      iconColor: "#93c5fd", // Light blue
      iconBgColor: "#0F1224", // Dark blue background
      title: "Impact Evaluation",
      description: "Proof of ship with SolEng integration to evaluate and reward contributions fairly."
    },
    {
      icon: <IconUsers size={32} stroke={1.5} />,
      iconColor: "#c4b5fd", // Light purple
      iconBgColor: "#151E31", // Dark purple background
      title: "AI Project Manager",
      description: "Intelligent coordination of tasks and resources to optimize project workflows."
    },
    {
      icon: <IconCode size={32} stroke={1.5} />,
      iconColor: "#6ee7b7", // Light green
      iconBgColor: "#172033", // Dark green background
      title: "GitHub Integration",
      description: "Seamless connection with existing repositories for issue tracking and milestone setting."
    }
  ];

  return (
    <section className="w-full py-24 bg-[#1E293B]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="flex flex-col justify-center">
            <div className="mb-6">
              <span className="px-4 py-2 bg-[#1e293b] rounded-full text-[#a78bfa] text-sm font-medium">
                Value Proposition
              </span>
            </div>
            
            <Title
              className="text-4xl md:text-5xl font-bold mb-6 text-white pb-4"
            >
              The Platform Where Self-Sovereign Software Development Thrives
            </Title>
            
            <Text 
              className="text-[#cbd5e1] text-xl mb-12 leading-relaxed"
            >
              Exponential enables projects to find early funding, attract non-financial contributors, and fairly compensate open-source developers based on their relative contributions.
            </Text>

            <div className="space-y-3 mt-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start mb-3">
                  <div className="text-[#10b981] mr-3 mt-1 flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.5 12L10.5 15L16.5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <span className="text-[#cbd5e1]">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right column - Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <FeatureDetailCard
                key={index}
                icon={feature.icon}
                iconColor={feature.iconColor}
                iconBgColor={feature.iconBgColor}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValuePropositionSection; 