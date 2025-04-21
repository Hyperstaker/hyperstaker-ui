import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { alloProfileIds, chainId } = await request.json();
    if (alloProfileIds.length == 0) {
      throw new Error("empty alloprofile array");
    }

    const payload = `query MyQuery {
      projects(
        filter: {and: {id: {in: [${alloProfileIds.map(
          (i: string) => `"${i}"`
        )}]}, chainId: {equalTo: ${chainId}}}}
      ) {
        id
        name
        metadata
        chainId
        projectNumber
      }
    }`;

    const response = await fetch(process.env.ALLO_GRAPHQL_ENDPOINT as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: payload,
      }),
    });

    const data = await response.json();
    const profiles = data.data?.projects;
    return NextResponse.json({ profiles });
  } catch (error) {
    console.error("error fetching allo profiles: ", error);
    return NextResponse.json(
      { message: "Failed to fetch user allo profiles" },
      { status: 500 }
    );
  }
}
