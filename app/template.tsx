import Navbar from "../components/navbar";
import Rainbow from "./rainbow";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Rainbow>
        <Navbar />
        {children}
      </Rainbow>
    </div>
  );
}
