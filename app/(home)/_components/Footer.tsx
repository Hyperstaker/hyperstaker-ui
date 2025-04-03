import Image from "next/image";
import { IconBrandGithub, IconBrandTwitter, IconWorld } from "@tabler/icons-react";
import Link from "next/link";

export function Footer() {
    const currentYear = new Date().getFullYear();
  
    return (
      <footer className="bg-[#0e1525] text-gray-400 border-t border-[#242b3d] mt-20">
        <div className="container mx-auto px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Logo and Description */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <img 
                  src="/img/logo.png" 
                  alt="Hyperstaker Logo" 
                  width={32} 
                  height={32} 
                  className="w-8" 
                />
                <span className="text-xl font-bold text-white">Hyperstaker</span>
              </div>
              <p className="text-sm mb-4 pr-8">
                Aligning incentives between builders and funders with programmable impact certificates (HyperCerts) for retroactive rewards.
              </p>
              <div className="flex space-x-4">
                <a href="https://github.com/hyperstaker" aria-label="GitHub" className="text-gray-500 hover:text-white transition-colors">
                  <IconBrandGithub size={20} />
                </a>
                <a href="https://x.com/hyperstaker" aria-label="Twitter" className="text-gray-500 hover:text-white transition-colors">
                  <IconBrandTwitter size={20} />
                </a>
                
              </div>
            </div>
  
            {/* Product Links */}
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Product</h3>
              <ul className="space-y-3">
                <li><Link href="#" className="hover:text-white transition-colors text-sm">Features</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors text-sm">Roadmap</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors text-sm">Dashboard</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors text-sm">Documentation</Link></li>
              </ul>
            </div>
  
            {/* Company Links */}
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h3>
              <ul className="space-y-3">
                <li><Link href="#" className="hover:text-white transition-colors text-sm">About</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors text-sm">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors text-sm">Careers</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors text-sm">Contact</Link></li>
              </ul>
            </div>
          </div>
  
          {/* Bottom Bar */}
          <div className="border-t border-[#242b3d] pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
            <p>&copy; {currentYear} Hyperstaker. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    );
  }
  