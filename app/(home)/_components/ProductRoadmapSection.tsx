import React from "react";
import { Container, Title, Text, SimpleGrid } from "@mantine/core";
import { IconClock } from "@tabler/icons-react";

interface RoadmapItemProps {
  title: string;
}

const RoadmapItem: React.FC<RoadmapItemProps & { children: React.ReactNode }> = ({ 
  title, 
  children 
}) => (
  <div className="flex items-start gap-3 mb-6">
    <IconClock size={20} className="text-[#8896c5] mt-0.5 flex-shrink-0" />
    <div>
      <Text className="text-[rgb(203 213 225 / var(--tw-text-opacity))] text-base font-medium">{title}</Text>
      {children}
    </div>
  </div>
);

interface RoadmapPhaseProps {
  status: 'in-progress' | 'upcoming' | 'planned';
  timeline: string;
  title: string;
  items: string[];
}

const RoadmapPhase: React.FC<RoadmapPhaseProps> = ({
  status,
  timeline,
  title,
  items
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'in-progress':
        return {
          bgColor: '#10172A',
          textColor: '#93C5FD',
          label: 'In Progress'
        };
      case 'upcoming':
        return {
          bgColor: '#10172A',
          textColor: '#C4B5FD',
          label: 'Upcoming'
        };
      case 'planned':
        return {
          bgColor: '#10172A',
          textColor: '#CBD5E1',
          label: 'Planned'
        };
      default:
        return {
          bgColor: '#1F2937',
          textColor: '#CBD5E1',
          label: 'Planned'
        };
    }
  };

  const { bgColor, textColor, label } = getStatusStyles();

  return (
    <div className="rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#0f172a] p-8 transition-all duration-300 hover:border-[rgba(255,255,255,0.15)] hover:shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <div 
          className="px-3 py-1 rounded-md text-sm font-medium" 
          style={{ backgroundColor: bgColor, color: textColor }}
        >
          {label}
        </div>
        <div className="flex items-center gap-2 text-[#8896c5]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M3 10H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M16 2L16 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M8 2L8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <Text size="sm">{timeline}</Text>
        </div>
      </div>

      <Title order={3} className="text-2xl font-semibold text-white mb-6 pb-4">
        {title}
      </Title>

      <div className="space-y-6">
        {items.map((item, index) => (
          <RoadmapItem key={index} title={item}>{item}</RoadmapItem>
        ))}
      </div>
    </div>
  );
};

export const ProductRoadmapSection: React.FC = () => {
  const phases: RoadmapPhaseProps[] = [
    {
      status: 'in-progress',
      timeline: '3 months',
      title: 'Phase 1: MVP Development',
      items: [
        'GitHub integration for issue tracking and milestone setting',
        'AI-driven project estimation and roadmap tracking',
        'HyperCert staking and governance token integration',
        'Integrated with Github',
        'AI project manager'
      ]
    },
    {
      status: 'upcoming',
      timeline: '6 months',
      title: 'Phase 2: Advanced Features',
      items: [
        'AI-powered contribution evaluation',
        'Payment distribution mechanism for open-source developers',
        'Expansion of human/AI team functionalities',
        'Impact Evaluation & Feedback Loop',
        'Return Software revenue to Open Source developers'
      ]
    },
    {
      status: 'planned',
      timeline: '2+ years',
      title: 'Phase 3: Ecosystem Expansion',
      items: [
        'Scaling integrations to broader open-source communities',
        'Partnering with funding platforms and grant programs',
        'Position as the "Virtual, scalable next-gen VC" for open-source',
        'Fully integrate payment rails and contribution-based compensation',
        'Expand adoption to major open-source communities'
      ]
    }
  ];

  return (
    <section className="w-full py-24 bg-[#0e1525]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <Title 
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: "#a78bfa" }}
          >
            Product Roadmap
          </Title>
          <p className="text-gray-300 text-lg mb-8 max-w-[60%] mx-auto">
            Our strategic plan for developing Exponential and bringing self-sovereign software to life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {phases.map((phase, index) => (
            <RoadmapPhase
              key={index}
              status={phase.status}
              timeline={phase.timeline}
              title={phase.title}
              items={phase.items}
            />
          ))}
        </div>
      </div>
    </section>
  );
}; 