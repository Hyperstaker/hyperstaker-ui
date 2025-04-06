import { type ComponentProps } from "react";
import { type Address } from "viem";

import { Banner } from "./ui/Banner";
//import { useProfileWithMetadata } from "~/hooks/useProfile";
const profileImageUrl = "/img/hs-banner.jpg";

export function ProjectBanner(
  props: { profileId: Address | string; url: string } & ComponentProps<
    typeof Banner
  >
) {
  return (
    <div className="overflow-hidden rounded-3xl">
      <Banner url={props.url} src={props.url} fallbackSrc={profileImageUrl} />
    </div>
  );
}
