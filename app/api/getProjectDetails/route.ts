import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import {
  HypercertData,
  HypercertFraction,
  HypercertQueryResponse,
} from "@/app/types/hypercerts";
import request from "graphql-request";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { alloProfileId, chainId } = await req.json();

    if (!alloProfileId) {
      throw new Error("Invalid input body");
    }

    const hypercertIds = await prisma.alloProfiles.findMany({
      where: { alloProfile: alloProfileId },
    });

    const query = ` 
      query MyQuery {
        hypercerts(
          where: {hypercert_id: {in: [${hypercertIds.map(
            (h) =>
              `"${
                chainId || 11155111
              }-0xa16DFb32Eb140a6f3F2AC68f41dAd8c7e83C4941-${h.hypercertId}"`
          )}]}}
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
    `;

    const res = await request<HypercertQueryResponse>(
      process.env.NEXT_PUBLIC_HYPERCERTS_API_URL_GRAPH as string,
      query
    );

    const hypercertsData = res?.hypercerts?.data;
    if (!hypercertsData) {
      return NextResponse.json({ hypercertsData });
    }

    hypercertsData.forEach((d: HypercertData) => {
      let totalUnits = 0;
      d?.fractions?.data?.forEach(
        (i: HypercertFraction) => (totalUnits += Number(i.units))
      );
      d.totalUnits = totalUnits;
    });

    return NextResponse.json({ hypercertsData });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
