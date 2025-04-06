import {
  FaceSmileIcon,
  ChartBarSquareIcon,
  CursorArrowRaysIcon,
  DevicePhoneMobileIcon,
  AdjustmentsHorizontalIcon,
  SunIcon,
} from "@heroicons/react/24/solid";

import benefitOneImg from "../public/img/benefit-one.png";
import benefitTwoImg from "../public/img/benefit-two.png";

const benefitOne = {
  title: "What's in it for you?",
  desc: "Predict which public goods projects should be funded. Fund them, and be rewarded for their success.",
  image: benefitOneImg,
  bullets: [
    {
      title: "Prospectively fund projects",
      desc: "Get projects moving forward, and receive a hypercert",
      icon: <FaceSmileIcon />,
    },
    {
      title: "Signal with your hypercerts which projects should be funded",
      desc: "The higher your conviction, the more benefit you receive.",
      icon: <ChartBarSquareIcon />,
    },
    {
      title: "Hypercert stakers are rewarded upon Retro payout",
      desc: "If and when someone pays for the work the project has done, you get paid.",
      icon: <CursorArrowRaysIcon />,
    },
  ],
};

const benefitTwo = {
  title: "Offer more benefits here",
  desc: "You can use this same layout with a flip image to highlight your rest of the benefits of your product. It can also contain an image or Illustration as above section along with some bullet points.",
  image: benefitTwoImg,
  bullets: [
    {
      title: "Mobile Responsive Template",
      desc: "Nextly is designed as a mobile first responsive template.",
      icon: <DevicePhoneMobileIcon />,
    },
    {
      title: "Powered by Next.js & TailwindCSS",
      desc: "This template is powered by latest technologies and tools.",
      icon: <AdjustmentsHorizontalIcon />,
    },
    {
      title: "Dark & Light Mode",
      desc: "Nextly comes with a zero-config light & dark mode. ",
      icon: <SunIcon />,
    },
  ],
};

export { benefitOne, benefitTwo };
