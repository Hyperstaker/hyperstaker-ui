"use client";
import React, { useEffect, useState } from "react";
import ProjectItem from "../../components/projectItem";

import { graphql } from "@/lib/graphql";
import request from "graphql-request";
import { useAccount } from "wagmi";

export default function Page() {
  const account = useAccount();
  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    getHypercertsOfUser(account.address as string).then((total) => {
      const filteredTotal = total?.filter(
        (t: any) => t.fractions.data[0].metadata != null
      );
      const uniqueHypercerts = new Map();
      filteredTotal?.forEach((item) => {
        uniqueHypercerts.set(item.hypercert_id, item);
      });
      setCampaigns(Array.from(uniqueHypercerts.values()));
    });
  }, [account]);

  async function getHypercertsOfUser(walletAddress: string) {
    const query = graphql(`
      query MyQuery {
          hypercerts(
            where: {creator_address: {contains: "${walletAddress}"}}
          ) {
            data {
              contract {
                chain_id
              }
              hypercert_id
              fractions {
                count
                data {
                  metadata {
                    id
                    name
                    description
                    external_url
                    impact_scope
                    impact_timeframe_from
                    impact_timeframe_to
                    work_timeframe_from
                    work_timeframe_to
                  }
                  units
                }
              }
              units
            }
          }
        }
    `);

    const res = await request(
      process.env.NEXT_PUBLIC_HYPERCERTS_API_URL_GRAPH as string,
      query
    );

    res?.hypercerts.data?.map((d: any) => {
      let totalUnits = 0;
      d?.fractions?.data?.map(
        (i: any) => (totalUnits = totalUnits + Number(i.units))
      );
      (d as any)["totalUnits"] = totalUnits;
    });

    return res.hypercerts.data;
  }

  return (
    <div className="container mx-auto mt-5">
      <div className="my-5 text-2xl flex justify-center">My Projects</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 gap-4">
        {campaigns &&
          campaigns.map((project, key) => (
            <ProjectItem
              key={key}
              project={{
                id: project.fractions.data[0].metadata.id,
                recipient: account.address as string,
                name: project.fractions.data[0].metadata.name,
                shortDescription:
                  project.fractions.data[0].metadata.description.split(".")[0],
                longDescription: project.fractions.data[0].metadata.description,
                avatarUrl: "/img/default-logo.png",
                bannerUrl: "/img/default-banner.jpg",
                slug: project.hypercert_id,
              }}
              metadata={{
                data: {
                  bio: project.fractions.data[0].metadata.description,
                  impactCategory:
                    project.fractions.data[0].metadata.impact_scope,
                },
              }}
              isLoading={false}
              buttonText="Manage"
              buttonLink={`/manage/${project.hypercert_id}`}
            />
          ))}
      </div>
    </div>
  );
}
