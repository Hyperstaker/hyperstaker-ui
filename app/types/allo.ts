export interface AlloProfile {
  id: `0x${string}`;
  name: string;
  metadata?: {
    type?: string;
    title?: string;
    logoImg?: string;
    members?: Array<`0x${string}`>;
    website?: string;
    bannerImg?: string;
    credentials?: Array<string>;
    description?: string;
    logoImgData?: string;
    bannerImgData?: string;
    projectGithub?: string;
    projectTwitter?: string;
  };
  chainId: number;
  projectNumber?: number;
}
