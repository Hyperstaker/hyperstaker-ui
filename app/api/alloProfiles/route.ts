import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { alloProfileIds, chainId } = await request.json();
    if (alloProfileIds.length == 0) {
      return NextResponse.json(
        { message: "No allo profile found for user" },
        { status: 400 }
      );
    }

    const payload = `query MyQuery {
      alloProfiles(where: {AND: {alloProfileId_in: [${alloProfileIds.map(
        (id: string) => `"${id}"`
      )}]}}) {
        items {
          metadata
          alloProfileId
          name
        }
      }
    }`;

    const response = await fetch(process.env.HYPERINDEXER_ENDPOINT as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: payload,
      }),
    });

    const data = await response.json();
    const profiles = (data.data?.alloProfiles?.items || []).map(
      (profile: any) => ({
        ...profile,
        name: profile.name,
        id: profile.alloProfileId,
        chainId: chainId,
        metadata: profile.metadata,
      })
    );
    return NextResponse.json({ profiles });
  } catch (error) {
    console.error("error fetching allo profiles: ", error);
    return NextResponse.json(
      { message: "Failed to fetch user allo profiles" },
      { status: 500 }
    );
  }
}
