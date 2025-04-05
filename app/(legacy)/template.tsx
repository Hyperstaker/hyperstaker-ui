import Navbar from "../../components/navbar";
import Rainbow from "./rainbow";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-bg-base">
      <Rainbow>
        <Navbar />
        {children}
      </Rainbow>
    </div>
  );
}
