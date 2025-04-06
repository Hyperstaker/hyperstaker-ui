"use client";
import ManageHypercert from "@/components/manageHypercerts";
import { useAccount } from "wagmi";
import request from "graphql-request";
import { useEffect, useState } from "react";
import { graphql } from "@/lib/graphql";
import { useConfig } from "wagmi";
import { readContract } from "@wagmi/core";
import { hyperfundAbi } from "@/components/data";

export default function Page({ params }: { params: { slug: string } }) {
  const account = useAccount();
  const [project, setProject] = useState<any>();
  const [hyperstaker, setHyperstaker] = useState<string>();
  const [hyperfund, setHyperfund] = useState<string>();
  const [unstakedFractions, setUnstakedFractions] = useState<string[]>([]);
  const [stakedFractions, setStakedFractions] = useState<string[]>([]);
  const [nonFinancialContributions, setNonfinancialContributions] = useState<
    bigint | number
  >();

  const config = useConfig();

  useEffect(() => {
    getHypercertsOfUser(account.address as string).then((total) => {
      const filteredTotal = total?.filter(
        (t: any) => t?.fractions.data[0].metadata != null
      );
      const uniqueHypercerts = new Map();
      filteredTotal?.forEach((item: any) => {
        uniqueHypercerts.set(item.hypercert_id, item);
      });
      setProject(Array.from(uniqueHypercerts.values())[0]);
    });

    getHyperstaker(account.address as string).then((hyperstaker) => {
      setHyperstaker(hyperstaker);
    });
  }, [account]);

  async function getHypercertsOfUser(walletAddress: string) {
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
            fractions {
              
              count
              data {
                fraction_id
                units
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
                owner_address
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

    const _unstakedFractions: string[] = [];
    res?.hypercerts.data?.map((d: any) => {
      d.fractions.data.map((f: any) => {
        if (f.owner_address == walletAddress) {
          _unstakedFractions.push(f.fraction_id.split("-")[2]);
        }
      });
    });

    setUnstakedFractions(Array.from(new Set(_unstakedFractions)));

    return res.hypercerts.data;
  }

  async function getHyperstaker(walletAddress: string) {
    const response = await fetch(
      process.env.NEXT_PUBLIC_HYPERINDEXER_ENDPOINT as unknown as URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
          query MyQuery {
            stakeds(where: {from: "${walletAddress}", hypercertId: "${
            params.slug.split("-")[2]
          }"}) {
              items {
                from
                fractionId
                hypercertId
                hyperstaker
                id
              }
            }
            hyperstakerCreated(hypercert: "${params.slug.split("-")[2]}") {
              hypercert
              hyperstaker
              manager
            }
            hyperfundCreated(hypercert: "${params.slug.split("-")[2]}") {
              hyperfund
              hypercert
              manager
            }
          }
        `,
        }),
      }
    );

    const data = await response.json();
    // TODO: Add additional verification to ensure that fractions are still staked
    const _stakedFractions = data.data.stakeds.items.map(
      (i: { fractionId: any }) => i.fractionId
    );
    setStakedFractions(Array.from(new Set(_stakedFractions)));
    const _hyperfund = data.data.hyperfundCreated.hyperfund;
    setHyperfund(_hyperfund);
    const _nonFinancialContributions = await readContract(config, {
      abi: hyperfundAbi,
      address: _hyperfund,
      functionName: "nonfinancialContributions",
      args: [account.address as `0x${string}`],
    });

    setNonfinancialContributions(_nonFinancialContributions as bigint);

    return data.data.hyperstakerCreated?.hyperstaker;
  }

  return (
    <div className="container mx-auto">
      <div className="">
        <ManageHypercert
          project={{
            id: project?.fractions.data[0].metadata.id,
            recipient: account.address as string,
            name: project?.fractions.data[0].metadata.name,
            shortDescription:
              project?.fractions.data[0].metadata.description.split(".")[0],
            longDescription: project?.fractions.data[0].metadata.description,
            avatarUrl: "/img/default-logo.png",
            bannerUrl: "/img/default-banner.jpg",
            slug: project?.hypercert_id,
          }}
          metadata={{
            data: {
              bio: project?.fractions.data[0].metadata.description,
              impactCategory: project?.fractions.data[0].metadata.impact_scope,
            },
          }}
          hyperfund={hyperfund as string}
          unstakedFractions={unstakedFractions}
          stakedFractions={stakedFractions}
          nonFinancialContributions={nonFinancialContributions as bigint}
          isLoading={false}
          hyperstaker={hyperstaker as string}
        />
      </div>
    </div>
  );
}
