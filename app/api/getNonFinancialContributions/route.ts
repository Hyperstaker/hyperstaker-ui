import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { hyperfund } = await request.json();

    if (!hyperfund) {
      return NextResponse.json(
        { message: "Missing hyperfund address" },
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
              nonfinancialContributions(
                where: {hyperfund: "${hyperfund.toLowerCase()}"}
              ) {
                items {
                  address
                  units
                }
              }
            }
          `,
        variables: {
          hyperfund: hyperfund.toLowerCase(),
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data from hyperindexer");
    }

    const data = await response.json();

    return NextResponse.json({
      contributions: data.data?.nonfinancialContributions?.items || [],
    });
  } catch (error) {
    console.error("Error fetching non-financial contributions:", error);
    return NextResponse.json(
      { message: "Failed to fetch non-financial contributions" },
      { status: 500 }
    );
  }
}
