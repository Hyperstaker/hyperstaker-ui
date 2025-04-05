"use client";
import FundProject from "@/components/fundProject";
import { request } from "graphql-request";
import { useState, useEffect, use } from "react";
// Import types
import type { HypercertData, HypercertQueryResponse, HypercertFraction } from "../../../types/hypercerts";

// Remove duplicated types
/*
// --- Reusing Type Definitions --- 
interface HypercertFractionMetadata { ... }
interface HypercertFraction { ... }
interface HypercertData { ... }
interface HypercertQueryResponse { ... }
// --- End of Type Definitions ---
*/

export default function Page(props: { params: Promise<{ slug: string }> }) {
  const params = use(props.params);
  const [project, setProject] = useState<HypercertData | null>(null); 
  const [poolId, setPoolId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.slug) {
        setIsLoading(false);
        setError("Project slug not found.");
        return;
    }

    setIsLoading(true);
    setError(null);

    async function fetchData() {
      try {
        const hypercertData = await getHypercertBySlug(params.slug);

        if (!hypercertData || hypercertData.length === 0 || !hypercertData[0].fractions?.data?.[0]?.metadata) {
          setError("Project data not found or invalid.");
          setProject(null);
          setIsLoading(false);
          return;
        }
        
        const fetchedProject = hypercertData[0];
        setProject(fetchedProject);

        try {
          const alloPoolRes = await fetch(
            `/api/alloPool?slug=${fetchedProject.hypercert_id?.split("-")[2]}`
          );
          if (!alloPoolRes.ok) {
             throw new Error(`Failed to fetch allo pool: ${alloPoolRes.statusText}`);
          }
          const alloPoolData = await alloPoolRes.json();
          setPoolId(alloPoolData.alloPool ?? null);
        } catch (poolError) {
            console.error("Error fetching allo pool:", poolError);
            setError("Failed to load project funding details.");
        }
        
      } catch (fetchError) {
        console.error("Error fetching hypercert data:", fetchError);
        setError("Failed to load project details.");
        setProject(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();

  }, [params.slug]); 

  async function getHypercertBySlug(slug: string): Promise<HypercertData[] | null> {
    const query = ` 
      query MyQuery {
        hypercerts(
          where: {hypercert_id: { eq: "${slug}"}}
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

      return hypercertsData;
    } catch (err) {
      console.error(`Failed to fetch hypercert for slug ${slug}:`, err);
      return null;
    }
  }

  if (isLoading) {
    return <div className="container mx-auto text-center p-10">Loading project details...</div>;
  }

  if (error && !project) { // Show main error only if project couldn't load at all
    return <div className="container mx-auto text-center p-10 text-red-500">Error: {error}</div>;
  }

  if (!project) {
      return <div className="container mx-auto text-center p-10">Project not found.</div>;
  }

  const metadata = project.fractions?.data?.[0]?.metadata;
  if (!metadata) {
       return <div className="container mx-auto text-center p-10">Project metadata is missing or invalid.</div>;
  }

  // Decide how to handle missing poolId - show error or render component differently
  // Option 1: Show specific error if poolId is missing but project loaded
  if (poolId === null && error) { 
     return (
        <div className="container mx-auto text-center p-10">
             <p className="text-xl mb-4">Project details loaded, but funding information is unavailable.</p>
             <p className="text-red-500">Error: {error}</p>
             {/* Optionally render FundProject with poolId={null} or disabled state */}
        </div>
      );
  }
  // Option 2: Allow rendering FundProject even if poolId is null (requires FundProject to handle null)
  // if (poolId === null) { /* Potentially log warning but continue */ }

  // If proceeding only when poolId is a number:
  if (poolId === null) {
      return <div className="container mx-auto text-center p-10">Loading funding details or details unavailable...</div>; // Or a more specific error 
  }


  return (
    <div className="container mx-auto">
      <div className="">
        <FundProject
          project={{
            id: metadata.id,
            recipient: project.creator_address,
            name: metadata.name ?? "Unnamed Project",
            shortDescription: metadata.description?.split(".")[0] ?? "",
            longDescription: metadata.description ?? "",
            avatarUrl: "/img/default-logo.png",
            bannerUrl: "/img/default-banner.jpg",
            slug: project.hypercert_id,
            totalUnits: project.totalUnits, 
          }}
          metadata={{
            data: {
              bio: metadata.description ?? "",
              impactCategory: metadata.impact_scope ?? [],
            },
          }}
          isLoading={isLoading} 
          poolId={poolId} // Now guaranteed to be a number here
        />
      </div>
    </div>
  );
}
