import { IconCode, IconUsers, IconWorld } from  "@tabler/icons-react";
import { GetStartedButton } from './_components/GetStartedButton';
import { ThemeToggle } from './_components/ThemeToggle';
import { FeaturesSection } from './_components/FeaturesSection';
import { ValuePropositionSection } from './_components/ValuePropositionSection';
import { ProductRoadmapSection } from './_components/ProductRoadmapSection';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0e1525] text-white">
      {/* Navigation */}
      <header 
        className="relative z-10 flex justify-between items-center py-6 px-8 border-b"
        style={{ borderBottomColor: '#242b3d' }}
      >
        <div className="flex items-center">
          <Image
            src="/img/logo.png"
            alt="Hyperstaker Logo"
            width={32}
            height={32}
            className="w-8"
          />
          <span className="text-xl ml-2 font-bold text-white">Hyperstaker</span>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-purple-400 hover:text-white transition-colors">Home</a>
          <a href="#" className="text-purple-400 hover:text-white transition-colors">Features</a>
          <a href="#" className="text-purple-400 hover:text-white transition-colors">Roadmap</a>
          <a href="#" className="text-purple-400 hover:text-white transition-colors">Dashboard</a>
        </nav>

        <div className="flex items-center gap-2">
          <GetStartedButton size="small" />
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <main className="min-h-screen relative">
        <div className="absolute inset-0 bg-gradient-custom" />
        
        <div 
          className="container mx-auto px-4 py-20 flex flex-col items-center text-center"
          style={{
            background: `radial-gradient(circle at center, 
              rgba(59, 130, 246, 0.2) 0%, 
              rgba(55, 48, 163, 0.1) 45%, 
              rgba(30, 27, 75, 0.05) 70%,
              rgba(15, 23, 42, 0) 100%)`,
            position: 'relative',
            zIndex: 10
          }}
        >
          <div className="max-w-3xl mx-auto">
            <div className="mb-12">
              <span className="inline-block px-4 py-2 rounded-full bg-purple-900/30 text-purple-300 text-sm font-medium mb-6 border border-[rgb(107,33,168)]">
                The Operating System for Self-Sovereign Software
              </span>
              
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
                Exponential Growth for Open-Source Projects
              </h1>
              
              <p className="text-gray-300 text-lg mb-8">
                Exponential is the platform where teams of AIs and humans organize to collaborate on software
                development, bringing ideas from zero to one with fair compensation based on contributions.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <GetStartedButton />
                <a href="#" className="px-6 py-3 bg-transparent border border-gray-700 text-gray-300 font-medium rounded-md hover:bg-gray-800 transition-colors">
                  Learn More
                </a>
              </div>
            </div>

            {/* Feature Cards - Moved up right below the buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {[
                {
                  icon: <IconCode size={36} stroke={1.5} />,
                  iconBg: '#2F2459',
                  iconColor: '#B794F4',
                  title: 'Open-Source Sustainability',
                  description: 'Fair compensation for all contributors'
                },
                {
                  icon: <IconUsers size={36} stroke={1.5} />,
                  iconBg: '#1E3A8A',
                  iconColor: '#90CDF4',
                  title: 'Human-AI Collaboration',
                  description: 'Teams of humans and AIs working together'
                },
                {
                  icon: <IconWorld size={36} stroke={1.5} />,
                  iconBg: '#322659',
                  iconColor: '#D6BCFA',
                  title: 'Decentralized Funding',
                  description: 'Enabling innovation through fair distribution'
                }
              ].map((feature, index) => (
                <div 
                  key={index}
                  style={{ 
                    background: 'linear-gradient(180deg, rgba(14, 23, 47, 0.5) 0%, rgba(11, 15, 36, 0.7) 100%)',
                    backdropFilter: 'blur(10px)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderRadius: '12px'
                  }}
                  className="p-6 transition-all duration-300 hover:border-opacity-20"
                >
                  <div className="flex flex-col items-center text-center">
                    <div 
                      className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                      style={{ 
                        backgroundColor: feature.iconBg,
                        boxShadow: `0 4px 16px rgba(79, 70, 229, 0.25)`,
                        color: feature.iconColor
                      }}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Features Section */}
        <FeaturesSection />
        
        {/* Value Proposition Section */}
        <ValuePropositionSection />
        
        {/* Product Roadmap Section - added after Value Proposition */}
        <ProductRoadmapSection />
      </main>
    </div>
  )
}

