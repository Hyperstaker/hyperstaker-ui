import Hero from "../components/hero";
import SectionTitle from "../components/sectionTitle";
import { benefitOne } from "../components/data";
// import Video from "../components/video";
import Benefits from "../components/benefits";
import Footer from "../components/footer";
// import Testimonials from "../components/testimonials";
// import Cta from "../components/cta";
// import Faq from "../components/faq";
// import PopupWidget from "../components/popupWidget";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Hyperstaker",
  description: "Your Insight, Everyone's Reward.",
};
const Home = () => {
  return (
    <>
      <div style={{ background: "#341E6A" }}>
        <Hero />
        <SectionTitle pretitle="How does it work?" title=" How does it work?">
          <ul>
            <li>
              Projects choose whether to do a &apos;fixed amount&apos; or a
              &apos;fixed duration&apos; raise.
            </li>
            <li>
              The project mints a Hypercert and deposits it into the vault
            </li>
            <li>
              Funders donate to projects, and receive a fraction of the
              hypercert relative to their donation.
            </li>
            <li>
              Non-financial contributors realize the project for Hypercerts
            </li>
            <li>
              Hypercerts can be sold, staked, or bought by a bonding curve
            </li>
            <li>
              When a retro payout is made - stakers are trustlessly paid out
              relative to their staked amout of Hypercerts
            </li>
          </ul>
        </SectionTitle>
        <Benefits data={benefitOne} />
        {/* <Benefits imgPos="right" data={benefitTwo} />
      <SectionTitle
        pretitle="Watch a video"
        title="Learn how to fullfil your needs"
      >
        This section is to highlight a promo or demo video of your product.
        Analysts says a landing page with video has 3% more conversion rate. So,
        don&apos;t forget to add one. Just like this.
      </SectionTitle>
      {/* <Video /> */}
        {/* <SectionTitle
        pretitle="Testimonials"
        title="Here's what our customers said"
      >
        Testimonails is a great way to increase the brand trust and awareness.
        Use this section to highlight your popular customers.
      </SectionTitle> */}
        {/* <Testimonials />
      <SectionTitle pretitle="FAQ" title="Frequently Asked Questions">
        Answer your customers possible questions here, it will increase the
        conversion rate as well as support or chat requests.
      </SectionTitle>
      <Faq />
      <Cta />
       */}
        <Footer />
        {/* <PopupWidget /> */}
      </div>
    </>
  );
};

export default Home;
