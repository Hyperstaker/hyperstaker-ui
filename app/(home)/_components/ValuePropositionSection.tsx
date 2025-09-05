import React from "react";
import { Title, Text } from "@mantine/core";
import {
  IconCertificate,
  IconScale,
  IconUsers,
  IconCurrencyDollar
} from "@tabler/icons-react";
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
export const ValuePropositionSection: React.FC = () => {
  const benefits = [
    "Reward early contributors with future upside",
    "Mix prospective and retro funding models",
    "Create trustless, programmable funding infrastructure",
    "Align incentives across builders, funders, and speculators",
    "Bootstrap new projects without relying on VC funding",
    "Earn governance through contribution, not capital"
  ];
  const features = [
    {
      icon: <IconCertificate size={32} stroke={1.5} />,
      iconColor: "#c4b5fd",
      iconBgColor: "#170F24",
      title: "HyperCerts",
      description: "Digital proof of contribution — stakable, tradable, and redeemable for governance or value."
    },
    {
      icon: <IconCurrencyDollar size={32} stroke={1.5} />,
      iconColor: "#6ee7b7",
      iconBgColor: "#0F1224",
      title: "Retroactive Funding",
      description: "Earn payouts and rewards when your project succeeds through retrofunding mechanisms."
    },
    {
      icon: <IconUsers size={32} stroke={1.5} />,
      iconColor: "#93c5fd",
      iconBgColor: "#151E31",
      title: "Builder Governance",
      description: "Stakers of HyperCerts gain governance rights — power shifts to contributors, not speculators."
    },
    {
      icon: <IconScale size={32} stroke={1.5} />,
      iconColor: "#fcd34d",
      iconBgColor: "#172033",
      title: "Aligned Incentives",
      description: "Everyone benefits when projects succeed. No winners-take-all — just shared value."
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
              Hyperstaker: The Engine Behind Sustainable Innovation
            </Title>
            <Text
              className="text-[#cbd5e1] text-xl mb-12 leading-relaxed"
            >
              Hyperstaker creates a programmable impact layer for funding innovation, helping projects attract early support, reward meaningful work, and align long-term incentives with sustainable open-source development.
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
