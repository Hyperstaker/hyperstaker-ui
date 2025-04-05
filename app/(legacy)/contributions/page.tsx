"use client";
import React, { useEffect, useState } from "react";
import ProjectItem from "../../../components/projectItem";
import request from "graphql-request";
import { useAccount } from "wagmi";
// Import types
import type { HypercertData, HypercertQueryResponse, HypercertFraction } from "../../types/hypercerts";

// Remove duplicated types
/*
// --- Reusing Type Definitions (adjusting HypercertFraction for fraction_id) ---
interface HypercertFractionMetadata { ... }
interface HypercertFraction { ... }
interface HypercertData { ... }
interface HypercertQueryResponse { ... }
// --- End of Type Definitions ---
*/

export default function Page() {
  const account = useAccount();
  const [campaigns, setCampaigns] = useState<HypercertData[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!account.address) {
      setIsLoading(false);
      setCampaigns([]); 
      return;
    }

    setIsLoading(true);
    setError(null);

    getHypercertsOwnedByUser(account.address)
      .then((data) => {
        if (data) {
          const uniqueHypercerts = new Map<string, HypercertData>();
          data.forEach((item) => {
            if (item.fractions?.data?.[0]?.metadata) {
               uniqueHypercerts.set(item.hypercert_id, item);
            }
          });
          setCampaigns(Array.from(uniqueHypercerts.values()));
        } else {
          setCampaigns([]); 
        }
      })
      .catch(err => {
        console.error("Error fetching user contributions:", err);
        setError("Failed to load contributions.");
        setCampaigns([]);
      })
      .finally(() => {
        setIsLoading(false);
      });

  }, [account.address]);

  async function getHypercertsOwnedByUser(walletAddress: string): Promise<HypercertData[] | null> {
    const query = ` 
      query MyQuery {
          hypercerts(
            where: { fractions: {owner_address: {contains: "${walletAddress}"}}} 
          ) {
            data {
              contract {
                chain_id
              }
              hypercert_id
              creator_address
              fractions {
                count
                data {
                  fraction_id
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
    `;

    try {
      const res = await request<HypercertQueryResponse>(
        process.env.NEXT_PUBLIC_HYPERCERTS_API_URL_GRAPH as string,
        query
      );

      const hypercertsData = res?.hypercerts?.data;
      if (!hypercertsData) {
        return null;
      }

      hypercertsData.forEach((d: HypercertData) => {
        let totalUnits = 0;
        d?.fractions?.data?.forEach(
          (i: HypercertFraction) => (totalUnits += Number(i.units))
        );
        d.totalUnits = totalUnits;
      });

      const filteredCerts = hypercertsData.filter(
        (i) => i.creator_address?.toLowerCase() !== walletAddress.toLowerCase()
      );

      return filteredCerts;
      
    } catch (err) {
      console.error(`Failed to fetch hypercerts owned by ${walletAddress}:`, err);
      return null; 
    }
  }
  
  return (
    <div className="container mx-auto mt-5">
      <div className="my-5 text-2xl flex justify-center">My Contributions</div>

      {isLoading && <p className="text-center">Loading your contributions...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!isLoading && !error && campaigns.length === 0 && (
        <p className="text-center">You haven't contributed to any projects yet (or own fractions of your own projects).</p>
      )}

      {!isLoading && !error && campaigns.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 gap-4">
          {campaigns.map((project) => (
            project.fractions?.data?.[0]?.metadata && (
              <ProjectItem
                key={project.hypercert_id} 
                project={{
                  id: project.fractions.data[0].metadata.id,
                  recipient: project.creator_address, 
                  name: project.fractions.data[0].metadata.name ?? "Unnamed Project",
                  shortDescription:
                    project.fractions.data[0].metadata.description?.split(".")[0] ?? "",
                  longDescription: project.fractions.data[0].metadata.description ?? "",
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
                isLoading={false}
                buttonText="Manage Hypercerts"
                buttonLink={`/manage/hypercerts/${project.hypercert_id}`}
              />
            )
          ))}
        </div>
      )}
    </div>
  );
}
