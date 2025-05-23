"use client";
import { ProjectAvatar } from "./ProjectAvatar";
import { ProjectBanner } from "./ProjectBanner";
import { Heading } from "./ui/Heading";
import { Skeleton } from "./ui/Skeleton";
import { ImpactCategories } from "./ImpactCategories";
import { Button } from "./ui/Button";
import { type Address } from "viem";
import Project from "../interfaces/Project";
import Metadata from "../interfaces/Metadata";
import Link from "next/link";
import Fund from "./fund";
import { Accordion } from "@mantine/core";
import Timeline from "./Timeline";
import { useEffect, useState } from "react";

export default function FundProject({
  project,
  metadata,
  isLoading,
  poolId,
}: {
  project: Project;
  metadata: Metadata;
  isLoading: boolean;
  poolId: number;
}) {
  const [usdRaised, setUsdRaised] = useState(0);
  const [raisePercent, setRaisePercent] = useState(0);

  useEffect(() => {
    const updateDonations = async () => {
      const response = await fetch("/api/getTotalFinancialContributions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          poolId: poolId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch total financial contributions");
      }

      const data = await response.json();
      const { units } = data;

      setUsdRaised(units / 10 ** 6);
      setRaisePercent((units * 100) / (project.totalUnits ?? 1));
    };

    if (poolId != 0) {
      updateDonations();
    }
  }, [poolId]);

  const content = [
    {
      value: "What is this project?",
      emoji: "📡",
      description:
        "Hyperstaker bridges the funding gap between early research funding and later VC funding.",
    },
    {
      value: "How does this work?",
      emoji: "🍺",
      description: (
        <>
          <h5>About this round</h5>
          <p>
            This is a <Link href="/">fixed raise round</Link>, which means that
            the prospective funding round will be open until the project raises
            it&apos;s funding goal.
          </p>
          <p>
            Hyperstaker as allocated 20% of it&apos;s level 1 hypercert to this
            round.
          </p>
        </>
      ),
    },
    {
      value: "How can I acquire Hypercerts?",
      emoji: "🍺",
      description: (
        <>
          <h5>Be a contributor!</h5>
          <p>
            Each project is free to allocate Hypercerts in it&apos;s own way.
            It&apos;s usually best to talk to the project directly, and ask how
            you can best support them.
          </p>
        </>
      ),
    },
    {
      value: "Which retro rounds is this project applying for?",
      emoji: "🚀",
      description: (
        <>
          <div>RPGF4: Applications open in April</div>
        </>
      ),
    },
    {
      value: "How and why stake hypercerts?",
      emoji: "🎉",
      description: (
        <ul>
          <li>
            A full explanation of the how and why of hypercert staking is coming
            soon 🎉
          </li>
        </ul>
      ),
    },
    {
      value: "How will impact be evaluated?",
      emoji: "⚖️",
      description: (
        <ul>
          <li>Project heartbeat impact evaluator</li>
        </ul>
      ),
    },
  ];
  const stones = content.map((item) => (
    <Accordion.Item key={item.value} value={item.value}>
      <Accordion.Control icon={item.emoji}>{item.value}</Accordion.Control>
      <Accordion.Panel>{item.description}</Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <div className="basis-10/12 mx-auto">
      {/* data-testid={`project-${project.id}`} */}
      <article className=" group rounded-2xl border border-gray-200 p-2 hover:border-primary-500 dark:border-gray-700 dark:hover:border-primary-500">
        <div className="opacity-70 transition-opacity group-hover:opacity-100">
          <ProjectBanner
            profileId={project?.recipient}
            url={project?.bannerUrl}
          />
          <ProjectAvatar
            className="-mt-8 ml-4 rounded-full"
            address={project?.recipient}
            url={project?.avatarUrl}
          />
        </div>
        <div className="px-4">
          <div className="flex">
            <div className="p-2 mr-16  flex-1">
              <h3>{project?.name}</h3>
              <div className="mb-2">
                <p className="h-10 text-sm dark:text-gray-300">
                  <Skeleton isLoading={isLoading} className="w-full">
                    {project?.longDescription || project?.longDescription}
                  </Skeleton>
                </p>
              </div>
              <div className="mb-24">
                <Accordion defaultValue="Milestone 1">{stones}</Accordion>
                <Skeleton isLoading={isLoading} className="w-full">
                  <div className="">
                    <h5 className="mt-8">
                      Funds raised{" "}
                      <span className="float-right">{raisePercent}%</span>
                    </h5>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div
                        style={{ width: raisePercent.toString() + "%" }}
                        className="mb-4 bg-blue-600 h-2.5 rounded-full"
                      ></div>
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <div className="text-sm font-medium text-gray-100">
                            Past Funding
                          </div>
                          <div className="text-2xl font-bold text-gray-200">
                            {usdRaised} USD
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-medium text-gray-100">
                            Target
                          </div>
                          <div className="text-2xl font-bold text-gray-300">
                            {(project.totalUnits ?? 0) / 10 ** 6} USD
                          </div>
                          {/* <div className="text-xs text-gray-200">
                            20% of prev RPGF
                          </div> */}
                        </div>
                      </div>
                      <div className="clear-both"></div>
                    </div>
                    <div className="clear-both"></div>
                  </div>
                </Skeleton>
              </div>
              {/* <Skeleton isLoading={isLoading} className="w-[100px]">
                <ImpactCategories tags={metadata?.data?.impactCategory} />
              </Skeleton> */}
            </div>
            <div className="flex-1">
              {/* <h3>Fund this project</h3> */}
              <Fund project={project} poolId={poolId} />
              <div className="mt-16 mx-6">
                <h3>Project timeline</h3>
                <Timeline />
              </div>
              {/* <Fund project={project} /> */}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
