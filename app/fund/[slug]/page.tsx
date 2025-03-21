"use client";
import FundProject from "@/components/fundProject";
import { graphql } from "@/lib/graphql";
import { request } from "graphql-request";
import { useState, useEffect } from "react";

export default function Page({ params }: { params: { slug: string } }) {
  const [project, setProject] = useState<any>();
  const [poolId, setPoolId] = useState(0);

  useEffect(() => {
    getHypercertsOfUser().then(async (total) => {
      const filteredTotal = total?.filter(
        (t: any) => t?.fractions.data[0].metadata != null
      );
      const uniqueHypercerts = new Map();
      filteredTotal?.forEach((item: any) => {
        uniqueHypercerts.set(item.hypercert_id, item);
      });
      const project_ = Array.from(uniqueHypercerts.values())[0];
      setProject(project_);

      // Fetch alloPool from the new API route
      const alloPoolRes = await fetch(
        `/api/alloPool?slug=${project_?.hypercert_id?.split("-")[2]}`
      );
      const alloPoolData = await alloPoolRes.json();
      setPoolId(alloPoolData.alloPool);
    });
  }, []);

  async function getHypercertsOfUser() {
    const query = graphql(`
      query MyQuery {
        hypercerts(
          where: {hypercert_id: { eq: "${params.slug}"}}
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
    <div className="container mx-auto">
      <div className="">
        <FundProject
          project={{
            id: project?.fractions.data[0].metadata.id,
            recipient: project?.creator_address,
            name: project?.fractions.data[0].metadata.name,
            shortDescription:
              project?.fractions.data[0].metadata.description.split(".")[0],
            longDescription: project?.fractions.data[0].metadata.description,
            avatarUrl: "/img/default-logo.png",
            bannerUrl: "/img/default-banner.jpg",
            slug: project?.hypercert_id,
            totalUnits: project?.totalUnits,
          }}
          metadata={{
            data: {
              bio: project?.fractions.data[0].metadata.description,
              impactCategory: project?.fractions.data[0].metadata.impact_scope,
            },
          }}
          isLoading={false}
          poolId={poolId}
        />
      </div>
    </div>
  );
}
