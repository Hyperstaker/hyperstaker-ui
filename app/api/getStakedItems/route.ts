import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { hypercertId, walletAddress } = await request.json();

    if (!hypercertId || !walletAddress) {
      return NextResponse.json(
        { message: "Missing required parameters" },
        { status: 400 }
      );
    }

    const response = await fetch(process.env.HYPERINDEXER_ENDPOINT as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
            query MyQuery {
              stakeds(where: {from: "${walletAddress}", hypercertId: "${hypercertId}"}) {
                items {
                  from
                  fractionId
                  hypercertId
                  hyperstaker
                  id
                }
              }
              hyperstakerCreated(hypercert: "${hypercertId}") {
                hypercert
                hyperstaker
                manager
              }
              hyperfundCreated(hypercert: "${hypercertId}") {
                hyperfund
                hypercert
                manager
              }
            }
          `,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data from hyperindexer");
    }

    const data = await response.json();

    return NextResponse.json({
      stakedItems: data.data?.stakeds?.items || [],
      hyperstakerInfo: data.data?.hyperstakerCreated,
      hyperfundInfo: data.data?.hyperfundCreated,
    });
  } catch (error) {
    console.error("Error fetching staked items:", error);
    return NextResponse.json(
      { message: "Failed to fetch staked items and related information" },
      { status: 500 }
    );
  }
}
