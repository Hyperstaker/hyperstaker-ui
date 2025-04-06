"use client";

import React from "react";
import Image from "next/image";
import { Disclosure } from "@headlessui/react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
interface HeaderProps {
  children: React.ReactNode;
}

export function Header({ children }: HeaderProps) {
  return (
    <header className="relative z-10 flex justify-between items-center py-6 px-8 border-b border-b-border-muted">
      <div className="flex items-center">
      <Disclosure>
            {({ open }) => (
              <>
                <div className="flex flex-wrap items-center justify-between w-full lg:w-auto">
                  <Link href="/">
                    <span className="flex items-center space-x-2 text-2xl font-medium text-indigo-500 dark:text-gray-100">
                      <span>
                        <Image
                          src="/img/logo.png"
                          alt="N"
                          width="32"
                          height="32"
                          className="w-8"
                        />
                      </span>
                      <span>HyperStaker</span>
                    </span>
                  </Link>

                  <Disclosure.Button
                    aria-label="Toggle Menu"
                    className="px-2 py-1 ml-auto text-gray-500 rounded-md lg:hidden hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none dark:text-gray-300 dark:focus:bg-trueGray-700"
                  >
                    <svg
                      className="w-6 h-6 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      {open && (
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                        />
                      )}
                      {!open && (
                        <path
                          fillRule="evenodd"
                          d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                        />
                      )}
                    </svg>
                  </Disclosure.Button>

                  
                </div>
              </>
            )}
          </Disclosure>
      </div>
      {children}
    </header>
  );
}
