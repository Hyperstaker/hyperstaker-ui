import React from "react";
import { Container, Title, Text, SimpleGrid } from "@mantine/core";
import { IconClock } from "@tabler/icons-react";

interface RoadmapItemProps {
  title: string;
  description?: string;
}

const RoadmapItem: React.FC<RoadmapItemProps> = ({ 
  title, 
  description 
}) => (
  <div className="flex items-start gap-3 mb-6">
    <IconClock size={20} className="text-[#8896c5] mt-0.5 flex-shrink-0" />
    <div>
      <Text className="text-white font-medium mb-1">{title}</Text>
      {description && <Text className="text-[#94a3b8] text-sm">{description}</Text>}
    </div>
  </div>
);

interface RoadmapPhaseProps {
  status: "in-progress" | "upcoming" | "planned";
  timeline: string;
  title: string;
  items: RoadmapItemProps[];
}

const RoadmapPhase: React.FC<RoadmapPhaseProps> = ({
  status,
  timeline,
  title,
  items
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case "in-progress":
        return {
          bgColor: "#10172A",
          textColor: "#93C5FD",
          label: "In Progress"
        };
      case "upcoming":
        return {
          bgColor: "#10172A",
          textColor: "#C4B5FD",
          label: "Upcoming"
        };
      case "planned":
        return {
          bgColor: "#10172A",
          textColor: "#CBD5E1",
          label: "Planned"
        };
      default:
        return {
          bgColor: "#1F2937",
          textColor: "#CBD5E1",
          label: "Planned"
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
          <RoadmapItem key={index} title={item.title} description={item.description} />
        ))}
      </div>
    </div>
  );
};

export const ProductRoadmapSection: React.FC = () => {
  const phases: RoadmapPhaseProps[] = [
    {
      status: "in-progress",
      timeline: "Now - Q2 2025",
      title: "Phase 1: MVP Launch & Onboarding",
      items: [
        { title: "Launch Hyperstaker MVP on testnet" },
        { title: "Mint pre-launch HyperCerts", description: "Enable builders and funders to own early project value." },
        { title: "Allo governance & payout logic", description: "Use Allo to manage monthly distributions." },
        { title: "Enable HyperCert cash-out vs. stake decisions" },
        { title: "Distribute $7.5k/month to builder pool", description: "Based on 3.75% of pre-launch HyperCert valuation." },
        { title: "Launch dashboard for all participants" },
        { title: "Onboard first projects to dogfood the model" }
      ]
    },
    {
      status: "upcoming",
      timeline: "6 months",
      title: "Phase 2: Advanced Features",
      items: [
        { title: "AI-powered contribution evaluation" },
        { title: "Payment distribution for OSS devs" },
        { title: "Expand human/AI team capabilities" },
        { title: "Impact Evaluation & Feedback Loop" },
        { title: "Return software revenue to OSS developers" }
      ]
    },
    {
      status: "planned",
      timeline: "2+ years",
      title: "Phase 3: Ecosystem Expansion",
      items: [
        { title: "Broaden open-source integrations" },
        { title: "Partner with grant programs & funding platforms" },
        { title: "Position as next-gen VC for OSS" },
        { title: "Integrated payment + contribution rewards" },
        { title: "Adopt across major OSS ecosystems" }
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
            Our roadmap for making Hyperstaker the new standard for funding innovation through programmable impact and aligned incentives.
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
