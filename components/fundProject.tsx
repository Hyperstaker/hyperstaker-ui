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

export default function FundProject({
  project,
  metadata,
  isLoading,
}: {
  project: Project;
  metadata: Metadata;
  isLoading: boolean;
}) {
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
            rounded="full"
            className="-mt-8 ml-4"
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
                      Funds raised <span className="float-right">40%</span>
                    </h5>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div
                        style={{ width: "45%" }}
                        className="mb-4 bg-blue-600 h-2.5 rounded-full"
                      ></div>
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <div className="text-sm font-medium text-gray-100">
                            Past Funding
                          </div>
                          <div className="text-2xl font-bold text-gray-200">
                            1.2 ETH
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-medium text-gray-100">
                            Target
                          </div>
                          <div className="text-2xl font-bold text-gray-300">
                            40 ETH
                          </div>
                          {/* <div className="text-xs text-gray-200">
                            20% of prev RPGF
                          </div> */}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-200">
                            Retro split
                          </div>
                          <div className="text-2xl font-bold text-gray-300">
                            20%
                          </div>
                        </div>
                      </div>
                      <div className="clear-both"></div>
                    </div>
                    <div className="clear-both"></div>

                    <button className="disabled mt-40 bg-zinc-400 text-red w-full py-3 rounded-lg font-medium hover:bg-zinc-200">
                      Stake hypercerts (coming soon)
                    </button>
                  </div>
                </Skeleton>
              </div>
              {/* <Skeleton isLoading={isLoading} className="w-[100px]">
                <ImpactCategories tags={metadata?.data?.impactCategory} />
              </Skeleton> */}
            </div>
            <div className="flex-1">
              {/* <h3>Fund this project</h3> */}
              <Fund project={project} />
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
