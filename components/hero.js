import Image from "next/image";
import Container from "./container";
import heroImg from "../public/img/hero.png";
import Link from "next/link";
import Partner from "./partner";
const Hero = () => {
  return (
    <>
      <Container className="flex flex-wrap ">
        <div className="flex items-center w-full lg:w-1/2">
          <div className="max-w-2xl mb-8">
            <h1 className="text-4xl font-bold leading-snug tracking-tight text-gray-800 lg:text-4xl lg:leading-tight xl:text-6xl xl:leading-tight dark:text-white">
              Programatic reciprocity
            </h1>
            <p className="py-5 text-xl leading-normal text-gray-500 lg:text-xl xl:text-2xl dark:text-gray-300">
              Hyperstaker catalyses early stage software projects by attaching
              early contributors to future project success.
            </p>

            <div className="flex flex-col items-start space-y-3 sm:space-x-4 sm:space-y-0 sm:items-center sm:flex-row">
              <Link
                href="https://docs.google.com/forms/d/e/1FAIpQLSfj4w6oKlv-vY54oIA3pmGl1yVpQFKXxdB8D1eaF1K5aAlHQg/viewform?usp=sf_link"
                className="px-8 py-4 text-lg font-medium text-center text-white bg-indigo-800 rounded-md "
              >
                Join the project waiting list
              </Link>
              <Link
                href="/projects"
                className="px-8 py-4 text-lg font-medium text-center text-white bg-indigo-600 rounded-md "
              >
                Fund public goods
              </Link>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center w-full lg:w-1/2">
          <div className="">
            <Image
              src={"/img/unicorn-dream.jpg"}
              width="616"
              height="617"
              className={"object-cover"}
              alt="Hero Illustration"
              loading="eager"
            />
          </div>
        </div>
      </Container>
      <Container>
        <div className="flex flex-col justify-center">
          <div className="text-xl text-center text-gray-700 dark:text-white">
            Our partners
          </div>

          <div className="flex flex-wrap justify-center gap-5 mt-10 md:justify-around">
            <Partner name="Hypercerts" logo="/img/hypercerts-logo.svg" />
            <Partner name="Allo Protocol" logo="/img/allo-logo-square.png" />
            <Partner name="Funding the Commons" logo="/img/ftc-square.jpg" />
            <Partner name="Octant" logo="/img/octant-logo-square.jpg" />
            <Partner
              name="Impact market"
              logo="/img/impact-market-square.jpg"
            />
          </div>
        </div>
      </Container>
    </>
  );
};

export default Hero;
