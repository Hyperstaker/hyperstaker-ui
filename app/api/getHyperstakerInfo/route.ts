import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { hypercertId } = await request.json();

    const response = await fetch(process.env.HYPERINDEXER_ENDPOINT as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
            query MyQuery {
              hyperstakerCreated(hypercert: "${hypercertId}") {
                hypercert
                hyperstaker
                manager
              }
              hyperfundCreated(hypercert: "${hypercertId}") {
                hypercert
                hyperfund
                manager
              }
            }
          `,
      }),
    });

    const data = await response.json();

    return NextResponse.json({
      hyperstakerInfo: data.data?.hyperstakerCreated,
      hyperfundInfo: data.data?.hyperfundCreated,
    });
  } catch (error) {
    console.error("Error fetching hyperstaker info:", error);
    return NextResponse.json(
      { message: "Failed to fetch hyperstaker information" },
      { status: 500 }
    );
  }
}
