"use client";
import React, { useEffect, useState } from "react";
import ProjectItem from "../../components/projectItem";
import { graphql } from "@/lib/graphql";
import { request } from "graphql-request";

export default function Page() {
  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    async function fetchCampaigns() {
      const projectListings = await getProjectListings();
      const hypercertIds = projectListings.data.map(
        (listing: any) => listing.hypercertId
      );

      const allCampaigns = await Promise.all(
        hypercertIds.map((id: string) => getHypercertId(id))
      );

      setCampaigns(allCampaigns.map((i) => i[0]));
    }

    fetchCampaigns();
  });

  async function getHypercertId(id: string) {
    const query = graphql(`
      query MyQuery {
        hypercerts(
          where: {
            hypercert_id: {
              eq: "11155111-0xa16DFb32Eb140a6f3F2AC68f41dAd8c7e83C4941-${id}"
            }
          }
        ) {
          data {
            contract {
              chain_id
            }
            creator_address
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

  async function getProjectListings() {
    const res = await fetch("/api/projectListings");
    if (!res.ok) {
      throw new Error("Failed to fetch project listings");
    }
    return await res.json();
  }

  return (
    <div className="container mx-auto mt-5">
      <div className="my-5 text-2xl flex justify-center">Explore Projects</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 gap-4">
        {campaigns &&
          campaigns.map((project, key) => (
            <ProjectItem
              key={key}
              project={{
                id: project.fractions.data[0].metadata.id,
                recipient: project.creator_address,
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
              buttonText="Fund this project"
              buttonLink={`/fund/${project.hypercert_id}`}
            />
          ))}
      </div>
    </div>
  );
}
