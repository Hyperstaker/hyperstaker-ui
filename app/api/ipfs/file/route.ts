import { PinataSDK } from "pinata-web3";

const pinata = new PinataSDK({ pinataJwt: process.env.PINATA_JWT });

export async function POST(req: Request) {
  try {
    const file = await req.blob();
    const response = await pinata.upload.file(file as File);
    const { IpfsHash } = response;

    return new Response(JSON.stringify({ IpfsHash: IpfsHash }));
  } catch (e) {
    return new Response(`Server Error: ${e}`, { status: 500 });
  }
}
