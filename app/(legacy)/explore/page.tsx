"use client";
import React, { useEffect, useState } from "react";
import ProjectItem from "../../../components/projectItem";
import { request } from "graphql-request";
// Import types from the centralized file
import type {
  HypercertData,
  HypercertQueryResponse,
  HypercertFraction,
} from "../../types/hypercerts";

// Remove duplicated type definitions
/*
interface HypercertFractionMetadata { ... }
interface HypercertFraction { ... }
interface HypercertData { ... }
interface HypercertQueryResponse { ... }
*/

export default function Page() {
  const [campaigns, setCampaigns] = useState<HypercertData[]>([]);
  // Add loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    async function fetchCampaigns() {
      try {
        const projectListings = await getProjectListings();
        if (!projectListings || !Array.isArray(projectListings.data)) {
          console.error("Invalid project listings data:", projectListings);
          setCampaigns([]);
          throw new Error("Invalid project listing data");
        }

        const hypercertIds = projectListings.data.map(
          (listing: any) => listing.hypercertId
        );

        const allCampaignsData = await Promise.all(
          hypercertIds.map((id: string) => getHypercertById(id)) // Renamed function
        );

        const validCampaigns = allCampaignsData
          .flat()
          .filter((c) => c !== null && c !== undefined) as HypercertData[];
        setCampaigns(validCampaigns);
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
        setError("Failed to load projects.");
        setCampaigns([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCampaigns();
  }, []);

  // Renamed function and adjusted return type
  async function getHypercertById(id: string): Promise<HypercertData[] | null> {
    const query = `query MyQuery {
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
      }`;

    try {
      const res = await request<HypercertQueryResponse>(
        process.env.NEXT_PUBLIC_HYPERCERTS_API_URL_GRAPH as string,
        query
      );

      const hypercertsData = res?.hypercerts?.data;
      if (!hypercertsData) {
        console.warn(`No hypercert data found for ID: ${id}`);
        return null;
      }

      // Use correct types here
      hypercertsData.forEach((d: HypercertData) => {
        let totalUnits = 0;
        d?.fractions?.data?.forEach(
          (i: HypercertFraction) => (totalUnits += Number(i.units))
        );
        d.totalUnits = totalUnits;
      });

      return hypercertsData;
    } catch (error) {
      console.error(`Failed to fetch hypercert for ID ${id}:`, error);
      return null;
    }
  }

  async function getProjectListings() {
    const res = await fetch("/api/projectListings", {
      next: {
        revalidate: 1,
      },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch project listings");
    }
    return await res.json();
  }

  return (
    <div className="container mx-auto mt-5">
      <div className="my-5 text-2xl flex justify-center">Explore Projects</div>

      {isLoading && <p className="text-center">Loading projects...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!isLoading && !error && campaigns.length === 0 && (
        <p className="text-center">No projects found.</p>
      )}

      {!isLoading && !error && campaigns.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 gap-4">
          {campaigns.map(
            (project) =>
              project?.fractions?.data?.[0]?.metadata && (
                <ProjectItem
                  key={project.hypercert_id} // Use hypercert_id
                  project={{
                    id: project.fractions.data[0].metadata.id,
                    recipient: project.creator_address,
                    name:
                      project.fractions.data[0].metadata.name ??
                      "Unnamed Project",
                    shortDescription:
                      project.fractions.data[0].metadata.description?.split(
                        "."
                      )[0] ?? "",
                    longDescription:
                      project.fractions.data[0].metadata.description ?? "",
                    avatarUrl: "/img/default-logo.png",
                    bannerUrl: "/img/default-banner.jpg",
                    slug: project.hypercert_id,
                  }}
                  metadata={{
                    data: {
                      bio: project.fractions.data[0].metadata.description ?? "",
                      impactCategory:
                        project.fractions.data[0].metadata.impact_scope ?? [],
                    },
                  }}
                  isLoading={false} // Should reflect actual item loading if needed
                  buttonText="Fund this project"
                  buttonLink={`/fund/${project.hypercert_id}`}
                />
              )
          )}
        </div>
      )}
    </div>
  );
}
