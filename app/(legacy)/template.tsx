"use client";

// import Navbar from "../../components/navbar";
import Rainbow from "./rainbow";
import { Header } from "../../components/Header";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import ThemeChanger from "../../components/DarkSwitch";

export default function Template({ children }: { children: React.ReactNode }) {
  const navigation = [
    { page: "Home", url: "/" },
    { page: "Organizations", url: "/organizations" },
    { page: "Explore", url: "/explore" },
    {page: "My Contributions", url: "/contributions"}
  ];
  return (
    <div className="bg-bg-base">
      <Rainbow>
        {/* <Navbar /> */}
        <Header>
           {/* Desktop Navigation */} 
           <div className="hidden lg:flex lg:items-center lg:gap-8">
             {navigation.map((item) => (
               <Link key={item.page} href={item.url} className="text-sm font-medium text-gray-300 hover:text-white">
                 {item.page}
               </Link>
             ))}
           </div>

           {/* Desktop Actions & Mobile Menu Container */} 
           <div className="flex items-center gap-4">
             {/* Desktop Action Buttons */}
             <div className="hidden lg:flex items-center gap-2">
               <ConnectButton />
               <ThemeChanger />
             </div>

             {/* Mobile Menu Disclosure */} 
             <div className="lg:hidden">
               <Disclosure as="div" className="relative"> 
                 {({ open }) => (
                   <>
                     <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                       <span className="sr-only">Open main menu</span>
                       {open ? (
                         <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                       ) : (
                         <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                       )}
                     </Disclosure.Button>
                     {/* Use absolute positioning for the panel relative to the button"s container */}
                     <Disclosure.Panel className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                         <div className="px-2 pt-2 pb-3 space-y-1">
                           {navigation.map((item) => (
                             <Disclosure.Button
                               key={item.page}
                               as={Link}
                               href={item.url}
                               className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                             >
                               {item.page}
                             </Disclosure.Button>
                           ))}
                           {/* Add ConnectButton inside the panel for mobile */}
                           <div className="border-t border-gray-700 pt-4 pb-2 px-3">
                              <ConnectButton />
                           </div>
                         </div>
                     </Disclosure.Panel>
                   </>
                 )}
               </Disclosure>
             </div>
          </div>
        </Header>
        {children}
      </Rainbow>
    </div>
  );
}
