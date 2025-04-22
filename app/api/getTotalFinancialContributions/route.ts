import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { poolId } = await request.json();

    const response = await fetch(process.env.HYPERINDEXER_ENDPOINT as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
            query MyQuery {
              totalFinancialContributionsToPool(poolId: "${poolId}") {
                totalHypercertUnits
                poolId
              }
            }
          `,
      }),
    });

    const data = await response.json();
    const units =
      data.data?.totalFinancialContributionsToPool?.totalHypercertUnits ?? 0;

    return NextResponse.json({ units });
  } catch (error) {
    console.error("Error fetching financial contributions:", error);
    return NextResponse.json(
      { message: "Failed to fetch financial contributions" },
      { status: 500 }
    );
  }
}
