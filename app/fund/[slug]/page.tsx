import FundProject from "@/components/fundProject";
import Project from "../../../interfaces/Project";
import projects from "@/projectData";
import metadata from "../../../metaData";

export default function Page({ params }: { params: { slug: string } }) {
  const project: Project = projects.filter(
    (project) => project.slug === params.slug
  )[0];
  return (
    <div className="container mx-auto">
      <div className="">
        <FundProject project={project} metadata={metadata} isLoading={false} />
      </div>
    </div>
  );
}
