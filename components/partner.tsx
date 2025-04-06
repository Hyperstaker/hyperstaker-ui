import Image from "next/image";
import { type ComponentProps } from "react";

type Partner = {
  logo: string;
  name: string;
};
export default function Partner({
  logo,
  name,
}: {
  logo: string;
  name: string;
}) {
  return (
    <div className="pt-2 text-gray-400 dark:text-gray-400">
      <div className="flex items-center">
        <Image
          src={logo}
          width="30"
          height="30"
          className={"object-cover"}
          alt="Hero Illustration"
          loading="eager"
        />
        <span className="ml-2">{name}</span>
      </div>
    </div>
  );
}
